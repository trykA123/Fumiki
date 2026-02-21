<script lang="ts">
    import { page } from "$app/stores";
    import { book } from "$lib/stores/book";
    import { player, currentChapter } from "$lib/stores/player";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    import PlayerControls from "$lib/components/player/PlayerControls.svelte";
    import SeekBar from "$lib/components/player/SeekBar.svelte";
    import SpeedSelector from "$lib/components/player/SpeedSelector.svelte";
    import SleepTimer from "$lib/components/player/SleepTimer.svelte";
    import ChapterList from "$lib/components/library/ChapterList.svelte";

    let { data } = $props();

    onMount(() => {
        // Only load if it's not already the active book playing
        if ($player.activeBook?.id !== data.id) {
            if ($book.data) {
                player.load($book.data);
            }
        }
    });

    function minimize() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            goto("/library");
        }
    }
</script>

<svelte:head>
    <title>{$player.activeBook?.title || "Player"} - Fumiki</title>
</svelte:head>

<div class="player-page">
    <div class="header">
        <button
            class="icon-btn minimize-btn"
            onclick={minimize}
            aria-label="Minimize player"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg
            >
        </button>
        <div class="spacer"></div>
    </div>

    {#if $player.activeBook}
        <div class="player-content">
            <!-- Main Column (Cover + Controls) -->
            <div class="main-column">
                <div class="cover-wrapper">
                    <img
                        src={`/api/abs/items/${$player.activeBook.id}/cover`}
                        alt="Cover"
                        class="cover shadow-lg"
                    />
                </div>

                <div class="metadata">
                    <h1 class="title">{$player.activeBook.title}</h1>
                    <p class="author">{$player.activeBook.author}</p>
                    {#if $currentChapter}
                        <p class="chapter-info">
                            {$currentChapter.title}
                        </p>
                    {/if}
                </div>

                <div class="playback-area">
                    <SeekBar />
                    <PlayerControls />

                    <div class="secondary-controls">
                        <SpeedSelector />
                        <SleepTimer />
                        <button class="bookmark-btn" aria-label="Add Bookmark">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><path
                                    d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
                                /></svg
                            >
                        </button>
                    </div>
                </div>
            </div>

            <!-- Side Column (Chapters) -->
            <div class="side-column">
                {#if $player.activeBook.chapters && $player.activeBook.chapters.length > 0}
                    <div class="panel">
                        <h2 class="panel-title">Chapters</h2>
                        <div class="panel-scroll">
                            <ChapterList
                                chapters={$player.activeBook.chapters}
                            />
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .player-page {
        position: fixed;
        inset: 0;
        background: var(--surface-0);
        z-index: 100; /* Above everything */
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: var(--space-4) var(--space-4) var(--space-8);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: var(--space-4);
        flex-shrink: 0;
    }

    .minimize-btn {
        background: transparent;
        border: none;
        color: var(--text-base);
        cursor: pointer;
        padding: var(--space-2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color var(--transition-base);
    }

    .minimize-btn:hover {
        background-color: var(--surface-2);
    }

    .player-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-8);
        flex: 1;
        max-width: 1000px;
        margin: 0 auto;
        width: 100%;
    }

    /* Tablet/Desktop split view */
    @media (min-width: 768px) {
        .player-content {
            flex-direction: row;
            align-items: flex-start;
        }

        .main-column {
            flex: 1;
            position: sticky;
            top: 20px;
        }

        .side-column {
            flex: 1;
            height: calc(100vh - 120px);
        }
    }

    .main-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 440px;
        margin: 0 auto;
    }

    .cover-wrapper {
        width: 100%;
        aspect-ratio: 1;
        max-width: 320px;
        border-radius: var(--radius-lg);
        overflow: hidden;
        margin-bottom: var(--space-6);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .metadata {
        text-align: center;
        margin-bottom: var(--space-8);
        width: 100%;
    }

    .title {
        font-family: var(--font-serif);
        font-size: var(--text-2xl);
        font-weight: 600;
        color: var(--text-base);
        margin-bottom: var(--space-1);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.2;
    }

    .author {
        font-size: var(--text-base);
        color: var(--text-muted);
    }

    .chapter-info {
        font-size: var(--text-sm);
        color: var(--accent);
        margin-top: var(--space-2);
        font-weight: 500;
        display: inline-block;
        background: color-mix(in srgb, var(--accent) 10%, transparent);
        padding: 4px 12px;
        border-radius: var(--radius-full);
    }

    .playback-area {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .secondary-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: var(--space-6);
    }

    .bookmark-btn {
        background: transparent;
        border: 1px solid var(--border-subtle);
        color: var(--text-base);
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-base);
    }

    .bookmark-btn:hover {
        background-color: var(--surface-2);
        border-color: var(--border-strong);
    }

    .bookmark-btn:active {
        transform: scale(0.95);
    }

    .side-column {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .panel {
        background: var(--surface-1);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-subtle);
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .panel-title {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-base);
        margin-bottom: var(--space-4);
        padding-bottom: var(--space-2);
        border-bottom: 1px solid var(--border-subtle);
    }

    .panel-scroll {
        overflow-y: auto;
        flex: 1;
        /* Custom scrollbar for panel */
        scrollbar-width: thin;
        scrollbar-color: var(--surface-3) transparent;
    }

    .panel-scroll::-webkit-scrollbar {
        width: 4px;
    }

    .panel-scroll::-webkit-scrollbar-track {
        background: transparent;
    }

    .panel-scroll::-webkit-scrollbar-thumb {
        background-color: var(--surface-3);
        border-radius: var(--radius-full);
    }
</style>
