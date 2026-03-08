<script lang="ts">
    import type { Chapter } from "../../../../../shared/types";
    import SectionHeader from "../ui/SectionHeader.svelte";

    let {
        chapters = [],
        currentTime = 0,
        isAudiobook = false,
    }: {
        chapters?: Chapter[];
        currentTime?: number;
        isAudiobook?: boolean;
    } = $props();

    // Formatting helpers
    function formatTime(seconds: number): string {
        if (!seconds && seconds !== 0) return "";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        }
        return `${m}:${s.toString().padStart(2, "0")}`;
    }

    const currentChapterId = $derived(
        chapters.find((ch) => currentTime >= ch.start && currentTime < ch.end)
            ?.id,
    );
</script>

<div class="flex flex-col gap-4">
    <SectionHeader title="Chapters" />

    {#if chapters && chapters.length > 0}
        <ul class="list-none p-0 m-0 flex flex-col gap-1">
            {#each chapters as chapter, i}
                <li
                    class={`flex items-center gap-3 p-2 px-3 rounded-[var(--radius)] transition-colors duration-200 ease-in-out hover:bg-surface-1 group ${chapter.id === currentChapterId ? "!bg-surface-2 !text-accent font-medium" : ""}`}
                >
                    <span
                        class={`text-text-muted min-w-[1.5rem] ${chapter.id === currentChapterId ? "!text-accent" : ""}`}
                        >{i + 1}.</span
                    >
                    <span
                        class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                        title={chapter.title}>{chapter.title}</span
                    >

                    {#if isAudiobook}
                        <span
                            class={`text-text-muted text-sm tabular-nums flex items-center gap-2 ${chapter.id === currentChapterId ? "!text-accent" : ""}`}
                        >
                            {formatTime(chapter.start)}
                            {#if chapter.id === currentChapterId}
                                <span class="text-[0.75rem]" aria-hidden="true"
                                    >►</span
                                >
                            {/if}
                        </span>
                    {/if}
                </li>
            {/each}
        </ul>
    {:else}
        <p class="text-text-muted italic">No chapters available</p>
    {/if}
</div>
