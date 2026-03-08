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
    import BookmarkButton from "$lib/components/player/BookmarkButton.svelte";
    import NoteEditorModal from "$lib/components/reader/NoteEditorModal.svelte";
    import NotesDrawer from "$lib/components/reader/NotesDrawer.svelte";
    import Icon from "$lib/components/Icon.svelte";

    import { notesStore } from "$lib/stores/notes";
    import { toast } from "$lib/stores/toast";

    let { data } = $props();

    let notesVisible = $state(false);
    let noteEditorVisible = $state(false);

    onMount(() => {
        notesStore.loadBookNotes(data.id);
    });

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

    async function handleSaveNote(content: string) {
        try {
            await notesStore.createNote(
                data.id,
                "note", // Audio annotation
                "audio",
                {
                    seconds: $player.currentTime,
                    chapterTitle: $currentChapter?.title || "Unknown",
                },
                content,
                "yellow",
            );
            toast.add("Note saved", "success");
            noteEditorVisible = false;
        } catch (e) {
            // Handled
        }
    }

    function navigateAudioNote(pos: number | any) {
        const seconds = typeof pos === "number" ? pos : pos?.seconds;
        if (typeof seconds === "number") {
            player.seek(seconds);
            notesVisible = false;
        }
    }
</script>

<svelte:head>
    <title>{$player.activeBook?.title || "Player"} - Fumiki</title>
</svelte:head>

<div
    class="fixed inset-0 bg-surface-0 z-[100] flex flex-col overflow-y-auto p-0"
>
    <div
        class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 shrink-0"
    >
        <button
            class="bg-transparent border-none text-text-primary cursor-pointer p-2 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-surface-2"
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
        <div class="flex-1"></div>
        <button
            class="bg-transparent border-none text-text-primary cursor-pointer p-2 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-surface-2"
            onclick={() => (notesVisible = true)}
            aria-label="View Notes and Bookmarks"
        >
            <Icon name="list" size={24} />
        </button>
    </div>

    {#if $player.activeBook}
        <div class="flex flex-col flex-1 w-full mb-8">
            <!-- Main Column (Cover + Controls) -->
            <div class="flex flex-col items-center w-full mx-auto">
                <div
                    class="relative w-full flex flex-col items-center pt-[calc(theme(spacing.8)+32px)] px-4 pb-8 overflow-hidden rounded-b-[40px] shadow-md mb-8"
                >
                    <img
                        src={`/api/abs/items/${$player.activeBook.id}/cover`}
                        alt=""
                        class="absolute inset-0 w-full h-full object-cover opacity/15 blur-[40px] saturate-150 scale-125 z-0"
                        style="mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0) 100%); -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0) 100%);"
                        aria-hidden="true"
                    />

                    <div
                        class="relative z-10 flex flex-col items-center w-full max-w-[440px]"
                    >
                        <div
                            class="w-full aspect-square max-w-[320px] rounded-lg overflow-hidden mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                        >
                            <img
                                src={`/api/abs/items/${$player.activeBook.id}/cover`}
                                alt="Cover"
                                class="w-full h-full object-cover"
                            />
                        </div>

                        <div class="text-center mb-8 w-full">
                            <h1
                                class="font-display text-2xl font-semibold text-text-primary mb-1 line-clamp-2 leading-[1.2]"
                            >
                                {$player.activeBook.title}
                            </h1>
                            <p class="text-base text-text-muted">
                                {$player.activeBook.author}
                            </p>
                            {#if $player.activeBook?.chapters && $player.activeBook.chapters.length > 0}
                                <div
                                    class="relative inline-flex items-center max-w-full mt-2"
                                >
                                    <select
                                        class="mt-0 appearance-none border-none outline-none cursor-pointer pr-8 font-[inherit] w-full truncate transition-colors duration-200 text-sm text-accent font-medium inline-block bg-accent/10 hover:bg-accent/15 px-3 py-1 rounded-full focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 [&>option]:text-text-primary [&>option]:bg-surface-1 [&>option]:font-normal"
                                        value={$currentChapter?.start || 0}
                                        onchange={(e) =>
                                            player.seek(
                                                Number(e.currentTarget.value),
                                            )}
                                        aria-label="Select chapter"
                                    >
                                        {#each $player.activeBook.chapters as chapter}
                                            <option value={chapter.start}>
                                                {chapter.title}
                                            </option>
                                        {/each}
                                    </select>
                                    <div
                                        class="absolute right-3 pointer-events-none text-accent flex items-center justify-center"
                                    >
                                        <Icon name="chevron-down" size={16} />
                                    </div>
                                </div>
                            {:else if $currentChapter}
                                <p
                                    class="text-sm text-accent mt-2 font-medium inline-block bg-accent/10 px-3 py-1 rounded-full"
                                >
                                    {$currentChapter.title}
                                </p>
                            {/if}
                        </div>
                    </div>
                </div>

                <div
                    class="w-full max-w-[440px] mx-auto px-4 flex flex-col gap-2"
                >
                    <SeekBar />
                    <PlayerControls />

                    <div class="flex items-center justify-between mt-4">
                        <SpeedSelector />
                        <SleepTimer />
                        <button
                            class="bg-surface-2 border border-border-subtle text-text-primary w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-surface-3 hover:border-border-strong active:scale-95"
                            aria-label="Write Note"
                            title="Write Note"
                            onclick={() => (noteEditorVisible = true)}
                        >
                            <Icon name="edit" size={20} />
                        </button>
                        <BookmarkButton bookId={data.id} />
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if notesVisible}
        <NotesDrawer
            bookId={data.id}
            onNavigate={navigateAudioNote}
            onClose={() => (notesVisible = false)}
        />
    {/if}

    <NoteEditorModal
        visible={noteEditorVisible}
        onSave={handleSaveNote}
        onClose={() => (noteEditorVisible = false)}
    />
</div>
