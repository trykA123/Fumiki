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

<div class="chapter-list">
    <SectionHeader title="Chapters" />

    {#if chapters && chapters.length > 0}
        <ul class="chapters">
            {#each chapters as chapter, i}
                <li
                    class="chapter-item"
                    class:active={chapter.id === currentChapterId}
                >
                    <span class="chapter-index">{i + 1}.</span>
                    <span class="chapter-title" title={chapter.title}
                        >{chapter.title}</span
                    >

                    {#if isAudiobook}
                        <span class="chapter-time">
                            {formatTime(chapter.start)}
                            {#if chapter.id === currentChapterId}
                                <span class="playing-icon" aria-hidden="true"
                                    >►</span
                                >
                            {/if}
                        </span>
                    {/if}
                </li>
            {/each}
        </ul>
    {:else}
        <p class="empty-text">No chapters available</p>
    {/if}
</div>

<style>
    .chapter-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .chapters {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
    }

    .chapter-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius);
        transition: background-color var(--transition-base) ease;
    }

    .chapter-item:hover {
        background: var(--surface-1);
    }

    .chapter-item.active {
        background: var(--surface-2);
        color: var(--accent);
        font-weight: 500;
    }

    .chapter-index {
        color: var(--text-muted);
        min-width: 1.5rem;
    }

    .chapter-item.active .chapter-index {
        color: var(--accent);
    }

    .chapter-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .chapter-time {
        color: var(--text-muted);
        font-size: 0.875rem;
        font-variant-numeric: tabular-nums;
        display: flex;
        align-items: center;
        gap: var(--space-2);
    }

    .chapter-item.active .chapter-time {
        color: var(--accent);
    }

    .playing-icon {
        font-size: 0.75rem;
    }

    .empty-text {
        color: var(--text-muted);
        font-style: italic;
    }
</style>
