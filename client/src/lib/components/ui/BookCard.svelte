<script lang="ts">
    import Card from "./Card.svelte";
    import BookCover from "./BookCover.svelte";
    import ProgressBar from "./ProgressBar.svelte";
    import type { Book } from "$lib/stores/library";
    import { goto } from "$app/navigation";

    let { book }: { book: Book } = $props();

    function navigate() {
        goto(`/library/${book.id}`);
    }

    // Determine intent color based on progress (finished vs in-progress)
    const intent = $derived(book.progress >= 100 ? "success" : "accent");
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="book-card-container" onclick={navigate}>
    <Card variant="interactive" class="book-card p-0">
        <div class="cover-wrapper">
            <!-- Ensure cover spans full width, typical book aspect ratio -->
            <BookCover
                src={book.coverUrl}
                alt={book.title}
                size="md"
                class="cover-image"
            />

            <div class="media-type-badge">
                {#if book.mediaType === "audiobook"}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                        ></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"
                        ></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"
                        ></path></svg
                    >
                {:else}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
                        ></path><path
                            d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                        ></path></svg
                    >
                {/if}
            </div>

            {#if book.progress > 0}
                <div class="progress-indicator">
                    <ProgressBar value={book.progress} {intent} size="xs" />
                </div>
            {/if}
        </div>

        <div class="book-info">
            <h3 class="book-title" title={book.title}>{book.title}</h3>
            <p class="book-author" title={book.author}>{book.author}</p>
        </div>
    </Card>
</div>

<style>
    .book-card-container {
        width: 100%;
        display: block;
        cursor: pointer;
    }

    /* Important: We strip padding off this specific card so the image can flush to edges */
    :global(.book-card.p-0) {
        padding: 0 !important;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .cover-wrapper {
        position: relative;
        width: 100%;
        aspect-ratio: 2 / 3;
        background: var(--surface-2);
        overflow: hidden;
    }

    :global(.cover-wrapper .cover-image) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0; /* Reset border radius since container handles it */
    }

    .media-type-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 4px;
        border-radius: 4px;
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .progress-indicator {
        position: absolute;
        bottom: 0px;
        left: 0;
        right: 0;
        z-index: 10;
        /* Background behind progress bar to ensure visibility */
        background: rgba(0, 0, 0, 0.4);
    }

    .book-info {
        padding: var(--space-3);
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex-grow: 1;
    }

    .book-title {
        font-family: var(--font-body);
        font-weight: 600;
        font-size: var(--text-sm);
        color: var(--text-primary);
        line-height: 1.3;

        /* Truncate to 2 lines */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin: 0;
    }

    .book-author {
        font-family: var(--font-body);
        font-size: 12px;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
    }
</style>
