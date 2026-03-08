<script lang="ts">
    import { player, currentChapter } from "$lib/stores/player";
    import { notesStore } from "$lib/stores/notes";
    import { toast } from "$lib/stores/toast";

    let { bookId }: { bookId: string } = $props();

    let isSaving = $state(false);

    async function handleBookmark() {
        if (!$player.activeBook || isSaving) return;
        isSaving = true;
        try {
            await notesStore.createNote(
                bookId,
                "bookmark",
                "audio",
                {
                    seconds: $player.currentTime,
                    chapterTitle: $currentChapter?.title || "Unknown",
                },
                null,
                null,
            );
            toast.add("Bookmark added", "success");
        } catch (e) {
            // Error handled by store
        } finally {
            isSaving = false;
        }
    }
</script>

<button
    class="bg-surface-2 border border-border-subtle text-text-primary w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-surface-3 hover:border-border-strong active:scale-95 disabled:opacity-50"
    aria-label="Add Bookmark"
    onclick={handleBookmark}
    disabled={isSaving}
    title="Add Bookmark"
>
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
        ><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg
    >
</button>
