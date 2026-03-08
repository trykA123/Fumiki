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

<div
    class="max-w-[var(--page-max-width,1400px)] mx-auto min-h-screen flex flex-col gap-6 md:pt-8 md:px-[var(--page-padding-tablet)] md:pb-[120px]"
>
    <div
        class="flex flex-col gap-4 sticky top-0 z-40 p-4 -mt-4 pb-2 md:pt-8 md:-mt-8 md:pb-4 backdrop-blur-md bg-background/90"
    >
        <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full"
        >
            <SearchInput
                placeholder="Search by title or author..."
                onsearch={handleSearch}
                class="w-full max-w-full md:max-w-[400px] md:mr-auto"
            />
            <FilterPills value={$library.filter} onchange={handleFilter} />
        </div>
    </div>

    <!-- Error State -->
    {#if $library.error}
        <div
            class="flex flex-col items-center justify-center text-center py-12 px-4 flex-grow"
        >
            <Icon name="library" size={48} class="text-error mb-4" />
            <h3 class="font-serif text-2xl mb-2 text-text-primary">
                Failed to load library
            </h3>
            <p class="text-text-muted text-sm max-w-[300px]">
                {$library.error}
            </p>
            <button
                class="mt-4 bg-surface-2 border border-border-medium text-text-primary px-4 py-2 rounded font-body font-medium cursor-pointer transition-colors duration-200 hover:bg-surface-3"
                onclick={() => library.loadLibraries()}
            >
                Retry
            </button>
        </div>

        <!-- Empty State / No Results -->
    {:else if !$library.loading && $library.books.length === 0}
        <div
            class="flex flex-col items-center justify-center text-center py-12 px-4 flex-grow"
        >
            <Icon name="library" size={48} class="text-surface-3 mb-4" />
            {#if $library.searchQuery || $library.filter !== "all"}
                <h3 class="font-serif text-2xl mb-2 text-text-primary">
                    No magic found
                </h3>
                <p class="text-text-muted text-sm max-w-[300px]">
                    Try adjusting your search or filters.
                </p>
            {:else}
                <h3 class="font-serif text-2xl mb-2 text-text-primary">
                    Your library is empty
                </h3>
                <p class="text-text-muted text-sm max-w-[300px]">
                    Connect to AudioBookShelf to see your books.
                </p>
            {/if}
        </div>

        <!-- Grid -->
    {:else}
        <div
            class={`relative flex-grow transition-opacity duration-200 py-4 px-4 md:px-0 ${$library.loading && $library.books.length === 0 ? "opacity-50 pointer-events-none" : ""}`}
        >
            <BookGrid>
                {#each $library.books as book (book.id)}
                    <BookCard {book} />
                {/each}
            </BookGrid>

            <!-- Loading overlay or skeleton for initial load -->
            {#if $library.loading && $library.books.length === 0}
                <div
                    class="absolute inset-0 flex items-center justify-center text-text-muted font-body"
                >
                    <p>Loading library...</p>
                </div>
            {/if}
        </div>
    {/if}
</div>
