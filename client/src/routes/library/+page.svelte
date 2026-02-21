<script lang="ts">
    import { onMount } from "svelte";
    import { library } from "$lib/stores/library";
    import SearchInput from "$lib/components/ui/SearchInput.svelte";
    import FilterPills from "$lib/components/ui/FilterPills.svelte";
    import BookGrid from "$lib/components/ui/BookGrid.svelte";
    import BookCard from "$lib/components/ui/BookCard.svelte";
    import Icon from "$lib/components/Icon.svelte";

    onMount(() => {
        // Only fetch if Empty, avoid refetching on every single navigation initially
        if ($library.libraries.length === 0) {
            library.loadLibraries();
        }
    });

    function handleSearch(val: string) {
        library.setSearch(val);
        library.loadBooks(0);
    }

    function handleFilter(val: "all" | "ebook" | "audiobook") {
        library.setFilter(val);
    }

    let isDragging = $state(false);
</script>

<svelte:head>
    <title>Library - Fumiki</title>
</svelte:head>

<div class="library-page">
    <div class="header-area">
        <div class="controls-row">
            <SearchInput
                placeholder="Search by title or author..."
                onsearch={handleSearch}
                class="search-bar"
            />
            <FilterPills value={$library.filter} onchange={handleFilter} />
        </div>
    </div>

    <!-- Error State -->
    {#if $library.error}
        <div class="empty-state">
            <Icon name="library" size={48} class="empty-icon text-error mb-4" />
            <h3>Failed to load library</h3>
            <p class="text-muted">{$library.error}</p>
            <button
                class="retry-btn mt-4"
                onclick={() => library.loadLibraries()}
            >
                Retry
            </button>
        </div>

        <!-- Empty State / No Results -->
    {:else if !$library.loading && $library.books.length === 0}
        <div class="empty-state">
            <Icon name="library" size={48} class="empty-icon mb-4" />
            {#if $library.searchQuery || $library.filter !== "all"}
                <h3>No magic found</h3>
                <p class="text-muted">Try adjusting your search or filters.</p>
            {:else}
                <h3>Your library is empty</h3>
                <p class="text-muted">
                    Connect to AudioBookShelf to see your books.
                </p>
            {/if}
        </div>

        <!-- Grid -->
    {:else}
        <div
            class="grid-container"
            class:loading={$library.loading && $library.books.length === 0}
        >
            <BookGrid>
                {#each $library.books as book (book.id)}
                    <BookCard {book} />
                {/each}
            </BookGrid>

            <!-- Loading overlay or skeleton for initial load -->
            {#if $library.loading && $library.books.length === 0}
                <div class="loading-overlay">
                    <p>Loading library...</p>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .library-page {
        max-width: var(--page-max-width, 1400px);
        margin: 0 auto;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .header-area {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        position: sticky;
        top: 0;
        z-index: 40;
        background: var(--background);
        padding: var(--space-4);
        margin-top: calc(var(--space-4) * -1);
        padding-bottom: var(--space-2);

        /* Subtle blur effect when scrolling */
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        background: color-mix(in srgb, var(--background) 90%, transparent);
    }

    .controls-row {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        width: 100%;
    }

    :global(.search-bar) {
        width: 100%;
        max-width: 100%;
    }

    .grid-container {
        position: relative;
        flex-grow: 1;
        transition: opacity 0.2s ease;
        padding: var(--space-4) var(--page-padding-mobile);
    }

    .grid-container.loading {
        opacity: 0.5;
        pointer-events: none;
    }

    .loading-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        font-family: var(--font-body);
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--space-12) var(--space-4);
        flex-grow: 1;
    }

    .empty-icon {
        color: var(--surface-3);
    }

    .empty-state h3 {
        font-family: var(--font-serif);
        font-size: 24px;
        margin-bottom: var(--space-2);
        color: var(--text-primary);
    }

    .empty-state p {
        font-size: var(--text-sm);
        max-width: 300px;
    }

    .mb-4 {
        margin-bottom: var(--space-4);
    }
    .mt-4 {
        margin-top: var(--space-4);
    }
    .text-muted {
        color: var(--text-muted);
    }
    .text-error {
        color: var(--error);
    }

    .retry-btn {
        background: var(--surface-2);
        border: 1px solid var(--border-medium);
        color: var(--text-primary);
        padding: 8px 16px;
        border-radius: var(--radius);
        font-family: var(--font-body);
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
    }

    .retry-btn:hover {
        background: var(--surface-3);
    }

    /* Tablet and Desktop Layout adjustments */
    @media (min-width: 768px) {
        .library-page {
            padding: var(--space-8) var(--page-padding-tablet) 120px;
        }

        .header-area {
            padding-top: var(--space-8);
            margin-top: calc(var(--space-8) * -1);
            padding-bottom: var(--space-4);
        }

        .controls-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

        :global(.search-bar) {
            max-width: 400px;
            margin-right: auto;
        }
    }
</style>
