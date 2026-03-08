<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { notesStore } from "$lib/stores/notes";
    import SearchInput from "$lib/components/ui/SearchInput.svelte";
    import FilterPills from "$lib/components/ui/FilterPills.svelte";
    import NoteItem from "$lib/components/ui/NoteItem.svelte";
    import Icon from "$lib/components/Icon.svelte";

    let searchQuery = $state("");
    let currentFilter = $state("all");

    // Pagination state
    let currentPage = $state(0);
    const limit = 50;

    // Observer for infinite scrolling
    let loadMoreRef: HTMLDivElement | undefined = $state();
    let observer: IntersectionObserver | null = null;

    const filterOptions = [
        { id: "all", label: "All Notes" },
        { id: "note", label: "My Notes" },
        { id: "highlight", label: "Highlights" },
        { id: "bookmark", label: "Bookmarks" },
    ];

    onMount(() => {
        // Initial load
        notesStore.loadAllNotes(0, limit, {
            type: currentFilter,
            search: searchQuery,
        });

        // Setup infinite scroll observer
        observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    !$notesStore.loading &&
                    $notesStore.allNotes.length < $notesStore.totalNotes
                ) {
                    loadMore();
                }
            },
            { rootMargin: "200px" },
        );

        if (loadMoreRef) observer.observe(loadMoreRef);
    });

    $effect(() => {
        if (loadMoreRef && observer) {
            observer.disconnect();
            observer.observe(loadMoreRef);
        }
    });

    onDestroy(() => {
        if (observer) observer.disconnect();
    });

    function loadMore() {
        currentPage += 1;
        notesStore.loadAllNotes(currentPage, limit, {
            type: currentFilter,
            search: searchQuery,
        });
    }

    function handleSearch(val: string) {
        searchQuery = val;
        currentPage = 0;
        notesStore.loadAllNotes(0, limit, {
            type: currentFilter,
            search: searchQuery,
        });
    }

    function handleFilter(val: string) {
        currentFilter = val;
        currentPage = 0;
        notesStore.loadAllNotes(0, limit, {
            type: currentFilter,
            search: searchQuery,
        });
    }
</script>

<svelte:head>
    <title>Notes - Fumiki</title>
</svelte:head>

<div
    class="max-w-[var(--page-max-width,1400px)] mx-auto min-h-screen flex flex-col gap-6 md:pt-8 md:px-[var(--page-padding-tablet)] md:pb-[120px]"
>
    <!-- Header Area -->
    <div
        class="flex flex-col gap-4 sticky top-0 z-40 p-4 -mt-4 pb-2 md:pt-8 md:-mt-8 md:pb-4 backdrop-blur-md bg-background/90"
    >
        <h1
            class="font-serif text-3xl font-bold text-text-primary hidden md:block"
        >
            Knowledge
        </h1>

        <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full"
        >
            <SearchInput
                placeholder="Search your notes..."
                onsearch={handleSearch}
                class="w-full max-w-full md:max-w-[400px] md:mr-auto"
            />
            <FilterPills
                value={currentFilter}
                options={filterOptions}
                onchange={handleFilter}
            />
        </div>
    </div>

    <!-- Error State -->
    {#if $notesStore.error}
        <div
            class="flex flex-col items-center justify-center text-center py-12 px-4 flex-grow"
        >
            <Icon name="x" size={48} class="text-error mb-4" />
            <h3 class="font-serif text-2xl mb-2 text-text-primary">
                Failed to load notes
            </h3>
            <p class="text-text-muted text-sm max-w-[300px]">
                {$notesStore.error}
            </p>
            <button
                class="mt-4 bg-surface-2 border border-border-medium text-text-primary px-4 py-2 rounded font-body font-medium transition-colors hover:bg-surface-3 cursor-pointer"
                onclick={() => handleSearch(searchQuery)}
            >
                Retry
            </button>
        </div>

        <!-- Empty State -->
    {:else if !$notesStore.loading && $notesStore.allNotes.length === 0}
        <div
            class="flex flex-col items-center justify-center text-center py-12 px-4 flex-grow"
        >
            <Icon name="edit" size={48} class="text-surface-3 mb-4" />
            {#if searchQuery || currentFilter !== "all"}
                <h3 class="font-serif text-2xl mb-2 text-text-primary">
                    No matching notes
                </h3>
                <p class="text-text-muted text-sm max-w-[300px]">
                    Try adjusting your search or filters.
                </p>
            {:else}
                <h3 class="font-serif text-2xl mb-2 text-text-primary">
                    Your mind palace is empty
                </h3>
                <p class="text-text-muted text-sm max-w-[300px]">
                    Read books and highlight passages to start building
                    knowledge.
                </p>
            {/if}
        </div>

        <!-- Grid Layout (Masonry approach using CSS multi-column) -->
    {:else}
        <div class="px-4 md:px-0 pb-20">
            <!-- Tablet Master-Detail ready grid -->
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start"
            >
                {#each $notesStore.allNotes as note}
                    <NoteItem {note} />
                {/each}
            </div>

            <!-- Infinite Scroll Trigger -->
            <div
                bind:this={loadMoreRef}
                class="h-12 w-full flex items-center justify-center mt-6"
            >
                {#if $notesStore.loading}
                    <div
                        class="w-6 h-6 border-2 border-surface-2 border-t-accent rounded-full animate-spin"
                    ></div>
                {/if}
            </div>
        </div>
    {/if}
</div>
