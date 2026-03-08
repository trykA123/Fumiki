<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import Icon from "$lib/components/Icon.svelte";
    import { notesStore } from "$lib/stores/notes";
    import type { Note } from "@fumiki/shared/types";
    import { onMount, onDestroy } from "svelte";

    let {
        bookId,
        onNavigate,
        onClose,
    }: {
        bookId: string;
        onNavigate: (cfi: string) => void;
        onClose: () => void;
    } = $props();

    // We access the Reactive store values via subscription to guarantee it updates
    // However with Svelte 5, $notesStore is reactive.
    let notes = $derived($notesStore.bookCache[bookId] || []);

    // Sort by position (roughly by CFI string order, though real CFI sort is complex)
    // We'll sort by createdAt for now or group them.
    let sortedNotes = $derived(
        [...notes].sort((a, b) => b.createdAt - a.createdAt),
    );

    function getExcerptPreview(note: Note) {
        if (note.positionType === "audio")
            return note.positionValue?.chapterTitle || "Audio Bookmark";
        if (note.type === "highlight" || note.type === "note") {
            const text = note.positionValue?.excerpt || "";
            return text.length > 80 ? text.substring(0, 80) + "..." : text;
        }
        return note.positionValue?.chapter || "Bookmark";
    }

    function formatDate(ts: number) {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(new Date(ts * 1000));
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="fixed inset-0 z-[9900] bg-black/40 backdrop-blur-sm pointer-events-auto"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
    onclick={onClose}
>
    <div
        class="absolute top-0 right-0 h-full w-full max-w-sm bg-surface-0 shadow-2xl flex flex-col pointer-events-auto"
        in:fly={{ x: "100%", duration: 300, opacity: 1 }}
        out:fly={{ x: "100%", duration: 250, opacity: 1 }}
        onclick={(e) => e.stopPropagation()}
    >
        <div
            class="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface-1"
        >
            <div class="flex items-center gap-2 text-text-primary">
                <Icon name="edit" size={20} />
                <h2 class="font-medium text-[16px]">Notes & Highlights</h2>
            </div>

            <div class="flex items-center gap-1">
                <button
                    class="p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-2 transition-colors cursor-pointer"
                    onclick={() => notesStore.exportMarkdown(bookId)}
                    title="Export to Markdown"
                >
                    <Icon name="device-floppy" size={20} />
                </button>
                <button
                    class="p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-2 transition-colors cursor-pointer"
                    onclick={onClose}
                    title="Close Tab"
                >
                    <Icon name="x" size={20} />
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-4">
            {#if sortedNotes.length === 0}
                <div
                    class="h-full flex flex-col items-center justify-center text-text-muted text-center space-y-3"
                >
                    <div
                        class="w-12 h-12 rounded-full bg-surface-1 flex items-center justify-center"
                    >
                        <Icon name="edit" size={24} />
                    </div>
                    <p class="text-[14px]">
                        No notes or highlights yet.<br />Select text to add one.
                    </p>
                </div>
            {:else}
                {#each sortedNotes as note}
                    <button
                        class="w-full text-left p-3 rounded-[8px] bg-surface-1 border border-border-subtle hover:border-accent/40 transition-colors group cursor-pointer block"
                        onclick={() => onNavigate(note.positionValue?.cfi)}
                    >
                        {#if note.type === "highlight" || (note.type === "note" && note.positionValue?.excerpt)}
                            <div
                                class="pl-3 border-l-2 border-accent/50 text-text-secondary text-[14px] leading-relaxed italic mb-2 line-clamp-3"
                            >
                                "{getExcerptPreview(note)}"
                            </div>
                        {/if}

                        {#if note.content}
                            <div
                                class="text-text-primary text-[15px] leading-relaxed"
                            >
                                {note.content}
                            </div>
                        {/if}

                        {#if note.type === "bookmark"}
                            <div
                                class="flex items-center gap-2 text-text-primary font-medium"
                            >
                                <Icon
                                    name="list"
                                    size={16}
                                    class="text-accent"
                                />
                                Bookmark
                            </div>
                        {/if}

                        <div
                            class="flex items-center justify-between mt-3 text-[12px] text-text-muted font-medium"
                        >
                            <span>{formatDate(note.createdAt)}</span>
                            <div
                                class="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Go to position &rarr;
                            </div>
                        </div>
                    </button>
                {/each}
            {/if}
        </div>
    </div>
</div>
