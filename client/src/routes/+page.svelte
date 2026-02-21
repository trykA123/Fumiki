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

<main class="home-page">
  <Greeting
    userName={$auth.username || undefined}
    currentTitle={$progress.title}
    kp={$progress.kp}
  />

  {#if $library.loading && $library.books.length === 0}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Syncing library...</p>
    </div>
  {:else}
    {#if continueReading.length > 0}
      <section class="home-section scroll-section">
        <SectionHeader title="Continue Reading" icon="play" />
        <div class="horizontal-scroll">
          <div class="scroll-track">
            {#each continueReading as book (book.id)}
              <div class="scroll-item">
                <BookCoverCard {book} />
              </div>
            {/each}
          </div>
        </div>
      </section>
    {/if}

    <div class="split-layout">
      <section class="home-section master-section">
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
          <p class="empty-text">No books found in your library.</p>
        {/if}
      </section>

      <section class="home-section detail-section">
        <SectionHeader title="Activity" icon="list" />

        <div class="activity-list">
          {#if $progress.loading}
            <div class="skeleton-activity"></div>
            <div class="skeleton-activity"></div>
            <div class="skeleton-activity"></div>
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

<style>
  .home-page {
    padding: 0 var(--page-padding-mobile)
      calc(var(--bottom-nav-height) + var(--space-8));
    max-width: var(--page-max-width, 1400px);
    margin: 0 var(--space-3);
  }

  /* Tablet and Desktop padding adjustments container query */
  @media (min-width: 768px) {
    .home-page {
      padding: 0 var(--page-padding-tablet) var(--space-12);
    }
  }

  .home-section {
    margin-bottom: var(--space-10);
  }

  .horizontal-scroll {
    margin: 0 calc(var(--page-padding-mobile) * -1); /* Full bleed on mobile */
    padding: 0 var(--page-padding-mobile);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none; /* Firefox */
  }

  .horizontal-scroll::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  .scroll-track {
    display: flex;
    gap: var(--space-4);
    padding-bottom: var(--space-4);
  }

  .scroll-item {
    flex: 0 0 140px; /* Fixed width for horizontal scrolling cards */
  }

  @media (min-width: 640px) {
    .scroll-item {
      flex: 0 0 160px;
    }
  }

  .split-layout {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  @media (min-width: 1024px) {
    .split-layout {
      flex-direction: row;
      align-items: flex-start;
    }

    .master-section {
      flex: 1;
      min-width: 0; /* Prevent flex overflow */
      margin-bottom: 0;
    }

    .detail-section {
      width: 320px;
      flex-shrink: 0;
      position: sticky;
      top: calc(var(--top-nav-height) + var(--space-8));
      margin-bottom: 0;
    }
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-16) 0;
    color: var(--text-muted);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 2px solid var(--surface-2);
    border-top-color: var(--accent);
    border-radius: var(--radius-full);
    animation: spin 1s linear infinite;
    margin-bottom: var(--space-4);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .skeleton-activity {
    height: 64px;
    background: var(--surface-2);
    border-radius: var(--radius-md);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .empty-text {
    color: var(--text-muted);
    text-align: center;
    padding: var(--space-12) 0;
    background: var(--surface-1);
    border-radius: var(--radius-lg);
    font-size: var(--text-sm);
  }
</style>
