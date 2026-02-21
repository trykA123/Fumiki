<script lang="ts">
    import type { Book } from "$lib/stores/library";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
    import Icon from "$lib/components/Icon.svelte";

    let { book }: { book: Book } = $props();

    // Default to the detail view, but could be overridden if dual formats need special handling
    let targetUrl = $derived(`/library/${book.id}`);
</script>

<a
    href={targetUrl}
    class="book-card"
    aria-label={`View details for ${book.title}`}
>
    <div class="cover-wrapper">
        <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            onload={(e) =>
                (e.target as HTMLImageElement).classList.add("loaded")}
            onerror={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
                if (img.nextElementSibling) {
                    img.nextElementSibling.classList.add("visible");
                }
            }}
            loading="lazy"
        />
        <div class="cover-fallback">
            <span class="fallback-title">{book.title}</span>
        </div>

        {#if book.mediaType === "both"}
            <div
                class="media-badge both-badge"
                aria-label="Audiobook and Ebook"
            >
                <Icon name="play" size={12} />
                <Icon name="library" size={12} />
            </div>
        {:else if book.mediaType === "audiobook"}
            <div class="media-badge" aria-label="Audiobook">
                <Icon name="play" size={12} />
            </div>
        {:else if book.mediaType === "ebook"}
            <div class="media-badge" aria-label="Ebook">
                <Icon name="library" size={12} />
            </div>
        {/if}

        {#if book.progress > 0 && book.progress < 1}
            <div class="progress-overlay">
                <ProgressBar
                    value={book.progress * 100}
                    max={100}
                    intent="accent"
                />
            </div>
        {/if}
    </div>

    <div class="metadata">
        <h3 class="title" title={book.title}>{book.title}</h3>
        <p class="author" title={book.author}>{book.author}</p>
    </div>
</a>

<style>
    .book-card {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        text-decoration: none;
        color: inherit;
        position: relative;
    }

    .cover-wrapper {
        position: relative;
        width: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1.5; /* Standard book cover ratio 2:3 */
        border-radius: var(--radius-sm);
        /* Fix the distortion by strictly commanding no stretches */
        display: block;
        flex-shrink: 0;
        overflow: hidden;
        background-color: var(--surface-2);
        box-shadow: var(--shadow-sm);
        transition:
            transform var(--transition-base),
            box-shadow var(--transition-base);
    }

    .book-card:hover .cover-wrapper {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .book-card:active .cover-wrapper {
        transform: translateY(0);
        transition-duration: var(--animate-duration-fast);
        box-shadow: var(--shadow-sm);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity var(--transition-base);
        position: relative;
        z-index: 10;
        display: block; /* Removes bottom gap */
    }

    :global(img.loaded) {
        opacity: 1;
    }

    .cover-fallback {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-3);
        background: linear-gradient(135deg, var(--surface-2), var(--surface-3));
        text-align: center;
        z-index: 1;
        opacity: 0;
    }

    :global(.cover-fallback.visible) {
        opacity: 1;
    }

    .fallback-title {
        font-family: var(--font-serif);
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-muted);
        display: -webkit-box;
        -webkit-line-clamp: 4;
        line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .media-badge {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        color: white;
        padding: 4px;
        border-radius: var(--radius-sm);
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .both-badge {
        flex-direction: row;
        gap: 2px;
        padding: 4px 6px;
    }

    .progress-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        z-index: 20;
    }

    /* Target the inner progress bar to make it fit the overlay perfectly */
    .progress-overlay :global(.progress-container) {
        height: 100%;
        border-radius: 0; /* Remove radius to merge with bottom edge */
    }

    .metadata {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .title {
        font-family: var(--font-sans);
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-base);
        margin: 0;
        line-height: var(--leading-tight);

        /* Truncate to 2 lines */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .author {
        font-size: var(--text-xs);
        color: var(--text-muted);
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
