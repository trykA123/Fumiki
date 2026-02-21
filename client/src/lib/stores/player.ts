import { writable, get, derived } from 'svelte/store';
import type { BookDetail, Chapter } from '@fumiki/shared/types';
import { api } from '$lib/api/client';

export type PlayerState = {
    activeBook: BookDetail | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    playbackRate: number;
    loading: boolean;
    error: string | null;
    sleepTimerRemaining: number | null; // seconds remaining
};

const initialState: PlayerState = {
    activeBook: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    loading: false,
    error: null,
    sleepTimerRemaining: null,
};

function createPlayerStore() {
    const { subscribe, set, update } = writable<PlayerState>(initialState);

    // We instantiate the audio element only on the client
    let audio: HTMLAudioElement | null = null;
    let syncInterval: ReturnType<typeof setInterval> | null = null;
    let sleepInterval: ReturnType<typeof setInterval> | null = null;
    let lastSyncedTime: number = 0;

    if (typeof window !== 'undefined') {
        audio = new Audio();

        audio.addEventListener('timeupdate', () => {
            if (!audio) return;
            // Limit store updates to every ~500ms to reduce render noise if we want,
            // but for a smooth seek bar, frequent updates are fine.
            update(s => ({ ...s, currentTime: audio!.currentTime }));

            // Sync progress every 60 seconds of playback
            if (Math.abs(audio!.currentTime - lastSyncedTime) >= 60) {
                syncProgress();
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            update(s => ({ ...s, duration: audio!.duration }));
        });

        audio.addEventListener('playing', () => {
            update(s => ({ ...s, isPlaying: true, loading: false }));
        });

        audio.addEventListener('pause', () => {
            update(s => ({ ...s, isPlaying: false }));
            syncProgress(); // Sync on pause
        });

        audio.addEventListener('waiting', () => {
            update(s => ({ ...s, loading: true }));
        });

        audio.addEventListener('error', (e) => {
            console.error("Audio error", e);
            update(s => ({ ...s, error: 'Failed to stream audio', loading: false }));
        });

        audio.addEventListener('ended', () => {
            update(s => ({ ...s, isPlaying: false }));
            syncProgress();
        });

        // Media Session API
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => play());
            navigator.mediaSession.setActionHandler('pause', () => pause());
            navigator.mediaSession.setActionHandler('seekbackward', (details) => {
                const skipTime = details.seekOffset || 30;
                seek(Math.max(0, (audio?.currentTime || 0) - skipTime));
            });
            navigator.mediaSession.setActionHandler('seekforward', (details) => {
                const skipTime = details.seekOffset || 30;
                seek(Math.min(audio?.duration || 0, (audio?.currentTime || 0) + skipTime));
            });
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.seekTime !== undefined) {
                    seek(details.seekTime);
                }
            });
        }
    }

    async function syncProgress() {
        if (!audio) return;
        const state = get({ subscribe });
        if (!state.activeBook) return;

        const time = audio.currentTime;
        lastSyncedTime = time;

        try {
            await api.patch(`/abs/items/${state.activeBook.id}/progress`, {
                currentTime: time,
                isFinished: time >= (state.activeBook.duration || audio.duration) - 10
            });
        } catch (e) {
            console.error("Failed to sync progress", e);
        }
    }

    function updateMediaSessionMetadata(book: BookDetail) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: book.title,
                artist: book.author,
                album: book.subtitle || undefined,
                artwork: [
                    { src: `/api/abs/items/${book.id}/cover`, sizes: '512x512', type: 'image/jpeg' }
                ]
            });
            navigator.mediaSession.playbackState = 'playing';
        }
    }

    const play = async () => {
        if (audio) {
            try {
                await audio.play();
                if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
            } catch (e) {
                update(s => ({ ...s, error: 'Playback failed', loading: false }));
            }
        }
    };

    const pause = () => {
        if (audio) {
            audio.pause();
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
        }
    };

    const seek = (time: number) => {
        if (audio) {
            audio.currentTime = time;
            update(s => ({ ...s, currentTime: time }));
        }
    };

    const load = async (book: BookDetail) => {
        if (!audio) return;
        const state = get({ subscribe });

        // If we're loading the same book, just force play if paused
        if (state.activeBook?.id === book.id) {
            if (audio.paused) {
                play();
            }
            return;
        }

        // Different book, load it
        pause();
        // Force sync old book before switching
        if (state.activeBook) {
            syncProgress();
        }

        update(s => ({
            ...s,
            activeBook: book,
            currentTime: book.currentTime || 0,
            duration: book.duration || 0,
            loading: true,
            error: null
        }));

        audio.src = `/api/abs/items/${book.id}/stream`;
        audio.currentTime = book.currentTime || 0;
        lastSyncedTime = audio.currentTime;
        audio.playbackRate = state.playbackRate;
        updateMediaSessionMetadata(book);

        play();
    };

    const setSpeed = (speed: number) => {
        if (audio) {
            audio.playbackRate = speed;
            update(s => ({ ...s, playbackRate: speed }));
        }
    };

    const skipForward = () => {
        if (audio) seek(Math.min(audio.duration, audio.currentTime + 30));
    };

    const skipBackward = () => {
        if (audio) seek(Math.max(0, audio.currentTime - 30));
    };

    // Sleep timer logic
    const setSleepTimer = (minutes: number) => {
        if (sleepInterval) clearInterval(sleepInterval);

        if (minutes === 0) {
            update(s => ({ ...s, sleepTimerRemaining: null }));
            return;
        }

        let secondsLeft = minutes * 60;
        update(s => ({ ...s, sleepTimerRemaining: secondsLeft }));

        sleepInterval = setInterval(() => {
            secondsLeft -= 1;
            update(s => ({ ...s, sleepTimerRemaining: Math.max(0, secondsLeft) }));

            if (secondsLeft <= 0) {
                pause();
                if (sleepInterval) {
                    clearInterval(sleepInterval);
                    sleepInterval = null;
                }
                update(s => ({ ...s, sleepTimerRemaining: null }));
            }
        }, 1000);
    };

    const setSleepTimerEndOfChapter = () => {
        // Find current chapter
        const state = get({ subscribe });
        if (!state.activeBook?.chapters) return;

        const currentChapter = state.activeBook.chapters.find(c =>
            state.currentTime >= c.start && state.currentTime <= c.end
        );

        if (currentChapter) {
            const secondsLeft = Math.ceil(currentChapter.end - state.currentTime);
            setSleepTimer(secondsLeft / 60);
        }
    };

    const closePlayer = () => {
        if (audio) {
            audio.pause();
            syncProgress();
            audio.removeAttribute('src');
            audio.load();
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = null;
                navigator.mediaSession.playbackState = 'none';
            }
        }
        const state = get({ subscribe });
        update(s => ({ ...initialState, playbackRate: state.playbackRate })); // Keep speed setting
    };

    return {
        subscribe,
        load,
        play,
        pause,
        seek,
        setSpeed,
        skipForward,
        skipBackward,
        setSleepTimer,
        setSleepTimerEndOfChapter,
        closePlayer,
        syncProgress
    };
}

export const player = createPlayerStore();

// Derived store to get the current active chapter
export const currentChapter = derived(player, ($player) => {
    if (!$player.activeBook?.chapters || $player.currentTime === undefined) {
        return null;
    }
    const time = $player.currentTime;
    return $player.activeBook.chapters.find(c => time >= c.start && time <= c.end) || null;
});
