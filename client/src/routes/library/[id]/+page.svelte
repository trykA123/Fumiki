<script lang="ts">
    import { onDestroy } from "svelte";
    import { book as bookStore } from "$lib/stores/book";
    import BookCover from "$lib/components/ui/BookCover.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Tag from "$lib/components/ui/Tag.svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
    import ChapterList from "$lib/components/library/ChapterList.svelte";
    import SummaryCard from "$lib/components/library/SummaryCard.svelte";
    import Skeleton from "$lib/components/ui/Skeleton.svelte";
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";

    let { data } = $props();

    $effect(() => {
        if (data && data.id) {
            bookStore.load(data.id);
        }
    });

    onDestroy(() => {
        bookStore.clear();
    });

    function formatTimeLeft(progress: number, duration: number | null): string {
        if (!duration || duration === 0) return "";
        const timeLeft = duration * (1 - progress);
        const h = Math.floor(timeLeft / 3600);
        const m = Math.floor((timeLeft % 3600) / 60);
        if (h > 0) return `${h}h ${m}m left`;
        return `${m}m left`;
    }
</script>

<div class="book-detail-page">
    <header class="top-bar">
        <Button variant="ghost" size="sm" href="/library">← Back</Button>
    </header>

    {#if $bookStore.loading && !$bookStore.data}
        <div class="skeleton-layout">
            <div class="skeleton-cover">
                <Skeleton variant="cover" />
            </div>
            <div class="skeleton-meta">
                <Skeleton variant="text" style="width: 80%; height: 2rem;" />
                <Skeleton variant="text" style="width: 60%; height: 1.5rem;" />
                <Skeleton variant="text" style="width: 40%; height: 1.25rem;" />
            </div>
        </div>
    {:else if $bookStore.error}
        <div class="error-state">
            <p>{$bookStore.error}</p>
            <Button variant="ghost" onclick={() => bookStore.load(data.id)}
                >Retry</Button
            >
        </div>
    {:else if $bookStore.data}
        {@const book = $bookStore.data}
        <div class="two-column-layout">
            <div class="left-column">
                <div class="cover-wrapper">
                    <BookCover src={book.coverUrl} size="lg" alt={book.title} />
                </div>

                <div class="tablet-only-meta">
                    <div class="categories">
                        {#if book.primaryCategory}
                            <Tag intent="accent">{book.primaryCategory}</Tag>
                        {/if}
                        {#if book.secondaryCategory}
                            <Tag>{book.secondaryCategory}</Tag>
                        {/if}
                    </div>
                </div>
            </div>

            <div class="right-column">
                <div class="book-header">
                    <h1 class="title">{book.title}</h1>
                    {#if book.subtitle}
                        <h2 class="subtitle">{book.subtitle}</h2>
                    {/if}
                    <div class="authors">
                        <span class="author">{book.author}</span>
                        {#if book.narrator}
                            <span class="narrator"
                                >narrated by {book.narrator}</span
                            >
                        {/if}
                    </div>
                    <div class="duration-pages">
                        {#if book.duration}
                            <span
                                >{Math.floor(book.duration / 3600)}h {Math.floor(
                                    (book.duration % 3600) / 60,
                                )}m</span
                            >
                        {/if}
                        {#if book.duration && book.pages}
                            <span class="separator">·</span>
                        {/if}
                        {#if book.pages}
                            <span>{book.pages} pages</span>
                        {/if}
                    </div>
                </div>

                <div class="actions">
                    {#if book.mediaType === "audiobook" || book.mediaType === "both"}
                        <Button
                            variant="primary"
                            size="lg"
                            href={`/player/${book.id}`}>▶ Play</Button
                        >
                    {/if}
                    {#if book.mediaType === "ebook" || book.mediaType === "both"}
                        <Button
                            variant="secondary"
                            size="lg"
                            href={`/reader/${book.id}`}>📖 Read</Button
                        >
                    {/if}
                    <Button variant="ghost" size="lg" href={`/notes/${book.id}`}
                        >📝 Notes</Button
                    >
                </div>

                {#if book.progress > 0}
                    <div class="progress-section">
                        <div class="progress-labels">
                            <span>{Math.round(book.progress * 100)}%</span>
                            <span class="time-left"
                                >{formatTimeLeft(
                                    book.progress,
                                    book.duration,
                                )}</span
                            >
                        </div>
                        <ProgressBar
                            value={Math.round(book.progress * 100)}
                            max={100}
                            size="md"
                        />
                    </div>
                {/if}

                <div class="mobile-only-categories">
                    <div class="categories">
                        {#if book.primaryCategory}
                            <Tag intent="accent">{book.primaryCategory}</Tag>
                        {/if}
                        {#if book.secondaryCategory}
                            <Tag>{book.secondaryCategory}</Tag>
                        {/if}
                    </div>
                </div>

                {#if book.description}
                    <div class="description">
                        <SectionHeader title="Description" />
                        <p class="description-text">{book.description}</p>
                    </div>
                {/if}

                {#if book.chapters && book.chapters.length > 0}
                    <ChapterList
                        chapters={book.chapters}
                        currentTime={book.currentTime || 0}
                        isAudiobook={book.mediaType === "audiobook" ||
                            book.mediaType === "both"}
                    />
                {/if}

                <SummaryCard />

                <div class="notes-preview">
                    <SectionHeader title={`Notes (${book.noteCount || 0})`} />
                    <p class="text-muted">Notes will appear here.</p>
                </div>

                <div class="metadata">
                    <SectionHeader title="Metadata" />
                    <ul class="meta-list">
                        {#if book.publisher}<li>
                                <strong>Publisher:</strong>
                                {book.publisher}
                            </li>{/if}
                        {#if book.publishedYear}<li>
                                <strong>Year:</strong>
                                {book.publishedYear}
                            </li>{/if}
                        {#if book.isbn}<li>
                                <strong>ISBN:</strong>
                                {book.isbn}
                            </li>{/if}
                        {#if book.genres && book.genres.length > 0}<li>
                                <strong>Genres:</strong>
                                {book.genres.join(", ")}
                            </li>{/if}
                    </ul>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .book-detail-page {
        padding: var(--space-4) var(--page-padding-x);
        max-width: var(--page-max-width, 1000px);
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .top-bar {
        display: flex;
        align-items: center;
        padding: var(--space-3);
    }

    /* Two Column Layout */
    .two-column-layout {
        display: flex;
        flex-direction: column;
        margin: 0 var(--space-3);
        gap: var(--space-6);
    }

    @media (min-width: 768px) {
        .two-column-layout {
            flex-direction: row;
            gap: var(--space-8);
            align-items: flex-start;
        }

        .left-column {
            flex: 0 0 180px;
            position: sticky;
            top: calc(env(safe-area-inset-top) + var(--space-6));
            display: flex;
            flex-direction: column;
            gap: var(--space-6);
        }

        .right-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--space-8);
            min-width: 0;
        }

        .mobile-only-categories {
            display: none;
        }
    }

    @media (max-width: 767px) {
        .cover-wrapper {
            display: flex;
            justify-content: center;
            margin-bottom: var(--space-2);
            /* Force constraint on mobile */
            max-width: 200px;
            margin-inline: auto;
        }

        .tablet-only-meta {
            display: none;
        }
    }

    /* Content */
    .book-header {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .title {
        font-family: var(--font-heading);
        font-size: var(--text-2xl);
        font-weight: 700;
        line-height: 1.2;
        margin: 0;
        color: var(--text-primary);
    }

    .subtitle {
        font-size: var(--text-lg);
        font-weight: 400;
        color: var(--text-secondary);
        margin: 0;
    }

    .authors {
        font-size: var(--text-lg);
        color: var(--text-primary);
    }

    .narrator {
        color: var(--text-secondary);
        font-size: var(--text-base);
    }

    .duration-pages {
        font-size: var(--text-sm);
        color: var(--text-muted);
        display: flex;
        gap: var(--space-2);
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
    }

    @media (max-width: 767px) {
        .actions {
            justify-content: center;
        }
    }

    .progress-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .progress-labels {
        display: flex;
        justify-content: space-between;
        font-size: var(--text-sm);
        color: var(--text-secondary);
        font-variant-numeric: tabular-nums;
    }

    .categories {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
    }

    .description-text {
        line-height: var(--line-height-relaxed);
        color: var(--text-secondary);
        white-space: pre-line;
        margin: 0;
    }

    .meta-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        font-size: var(--text-sm);
        color: var(--text-secondary);
    }

    .meta-list strong {
        color: var(--text-primary);
        font-weight: 500;
    }

    .text-muted {
        color: var(--text-muted);
        font-size: var(--text-sm);
    }

    /* Skeletons */
    .skeleton-layout {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    @media (min-width: 768px) {
        .skeleton-layout {
            flex-direction: row;
            gap: var(--space-8);
        }
    }

    .skeleton-cover {
        width: 140px;
        height: 210px;
        margin: 0 auto;
    }

    @media (min-width: 768px) {
        .skeleton-cover {
            width: 180px;
            height: 270px;
            margin: 0;
        }
    }

    .skeleton-meta {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .error-state {
        padding: var(--space-8);
        background: var(--surface-1);
        border-radius: var(--radius-lg);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-4);
        text-align: center;
        color: var(--text-secondary);
    }
</style>
