<script lang="ts">
    import type { Note } from "@fumiki/shared/types";
    import Icon from "$lib/components/Icon.svelte";

    let {
        note,
        selected = false,
        onclick,
    }: {
        note: Note;
        selected?: boolean;
        onclick?: () => void;
    } = $props();

    function getExcerptPreview(nt: Note) {
        if (nt.positionType === "audio")
            return nt.positionValue?.chapterTitle || "Audio Bookmark";
        if (nt.type === "highlight" || nt.type === "note") {
            const text = nt.positionValue?.excerpt || "";
            return text.length > 100 ? text.substring(0, 100) + "..." : text;
        }
        return nt.positionValue?.chapter || "Bookmark";
    }

    function formatDate(ts: number) {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
        }).format(new Date(ts * 1000));
    }
</script>

<button
    class={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer group flex flex-col gap-2 ${
        selected
            ? "bg-surface-0 border-accent shadow-md"
            : "bg-surface-1 border-border-subtle hover:border-border-strong hover:bg-surface-2"
    }`}
    {onclick}
>
    <!-- Header / Metadata -->
    <div
        class="flex items-center justify-between text-[12px] font-medium text-text-muted w-full"
    >
        <div class="flex items-center gap-2 max-w-[70%]">
            {#if note.type === "note"}
                <Icon name="edit" size={14} class="text-accent" />
            {:else if note.type === "highlight"}
                <div
                    class="w-3 h-3 rounded-full"
                    style="background-color: {note.color === 'yellow'
                        ? 'var(--highlight-yellow)'
                        : note.color === 'blue'
                          ? 'var(--highlight-blue)'
                          : note.color === 'pink'
                            ? 'var(--highlight-pink)'
                            : 'var(--highlight-green)'}"
                ></div>
            {:else}
                <Icon name="list" size={14} />
            {/if}
            <span class="truncate">{note.bookTitle || "Unknown Book"}</span>
        </div>
        <span class="shrink-0">{formatDate(note.createdAt)}</span>
    </div>

    <!-- Highlight / Excerpt context -->
    {#if note.type === "highlight" || (note.type === "note" && note.positionValue?.excerpt)}
        <div
            class="pl-3 border-l-[3px] border-accent/30 text-text-secondary text-[14px] italic line-clamp-3"
        >
            "{getExcerptPreview(note)}"
        </div>
    {/if}

    <!-- Actual User Note -->
    {#if note.content}
        <div
            class="text-text-primary text-[15px] leading-relaxed line-clamp-4 font-body"
        >
            {note.content}
        </div>
    {/if}

    {#if note.type === "bookmark"}
        <div class="text-text-primary text-[15px] font-medium">Bookmark</div>
        {#if note.positionType === "audio"}
            <div class="text-text-secondary text-[13px]">
                {note.positionValue?.chapterTitle || ""}
            </div>
        {/if}
    {/if}
</button>
