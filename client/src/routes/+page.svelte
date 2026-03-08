<script lang="ts">
  import { onMount } from "svelte";
  import { library } from "$lib/stores/library";
  import { progress } from "$lib/stores/progress";
  import { auth } from "$lib/stores/auth";

  import Greeting from "$lib/components/home/Greeting.svelte";
  import SectionHeader from "$lib/components/home/SectionHeader.svelte";
  import ActivityItem from "$lib/components/home/ActivityItem.svelte";
  import BookCoverCard from "$lib/components/library/BookCoverCard.svelte";
  import BookGrid from "$lib/components/ui/BookGrid.svelte";

  // Derived states
  let continueReading = $derived(
    $library.books.filter((b) => b.progress > 0 && b.progress < 1).slice(0, 5),
  );
  let recentBooks = $derived(
    [...$library.books].sort((a, b) => b.addedAt - a.addedAt).slice(0, 5),
  );

  onMount(async () => {
    // Only fetch if empty to prevent unnecessary network calls on back navigation
    if ($library.books.length === 0) {
      library.loadLibraries();
    }
    progress.load();
  });
</script>

<svelte:head>
  <title>Home - Fumiki</title>
</svelte:head>

<main
  class="px-[var(--page-padding-mobile)] pb-[calc(var(--bottom-nav-height)+theme(spacing.8))] md:px-[var(--page-padding-tablet)] md:pb-12 max-w-[var(--page-max-width,1400px)] mx-3"
>
  <Greeting
    userName={$auth.username || undefined}
    currentTitle={$progress.title}
    kp={$progress.kp}
  />

  {#if $library.loading && $library.books.length === 0}
    <div
      class="flex flex-col items-center justify-center py-16 text-text-muted"
    >
      <div
        class="w-8 h-8 border-2 border-surface-2 border-t-accent rounded-full animate-spin mb-4"
      ></div>
      <p>Syncing library...</p>
    </div>
  {:else}
    {#if continueReading.length > 0}
      <section class="mb-10">
        <SectionHeader title="Continue Reading" icon="play" />
        <div
          class="mx-[calc(var(--page-padding-mobile)*-1)] px-[var(--page-padding-mobile)] overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div class="flex gap-4 pb-4">
            {#each continueReading as book (book.id)}
              <div class="flex-none w-[140px] sm:w-[160px]">
                <BookCoverCard {book} />
              </div>
            {/each}
          </div>
        </div>
      </section>
    {/if}

    <div class="flex flex-col lg:flex-row lg:items-start gap-8">
      <section class="mb-10 lg:mb-0 flex-1 min-w-0">
        <SectionHeader
          title="Recent Library"
          icon="library"
          actionText="View All"
          onAction={() => (window.location.href = "/library")}
        />

        {#if recentBooks.length > 0}
          <BookGrid>
            {#each recentBooks as book (book.id)}
              <BookCoverCard {book} />
            {/each}
          </BookGrid>
        {:else}
          <p
            class="text-text-muted text-center py-12 bg-surface-1 rounded-lg text-sm"
          >
            No books found in your library.
          </p>
        {/if}
      </section>

      <section
        class="mb-10 lg:mb-0 w-full lg:w-[320px] shrink-0 lg:sticky lg:top-[calc(var(--top-nav-height)+theme(spacing.8))]"
      >
        <SectionHeader title="Activity" icon="list" />

        <div class="flex flex-col gap-2">
          {#if $progress.loading}
            <div class="h-16 bg-surface-2 rounded-md animate-pulse"></div>
            <div class="h-16 bg-surface-2 rounded-md animate-pulse"></div>
            <div class="h-16 bg-surface-2 rounded-md animate-pulse"></div>
          {:else}
            <!-- Hardcoded placeholders for Phase 3: Knowledge Layer -->
            <ActivityItem
              points={42}
              title="Dune - Chapter 4"
              timeAgo="15m ago"
            />
            <ActivityItem
              points={89}
              title="Atomic Habits - Chapter 1"
              timeAgo="2h ago"
            />
            <ActivityItem
              points={15}
              title="Project Hail Mary"
              timeAgo="Yesterday"
            />
            <ActivityItem
              points={120}
              title="The Psychology of Money"
              timeAgo="2 days ago"
            />
          {/if}
        </div>
      </section>
    </div>
  {/if}
</main>
