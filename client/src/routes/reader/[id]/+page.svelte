<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { book as bookStore } from "$lib/stores/book";
    import { api } from "$lib/api/client";
    import ReaderToolbar from "$lib/components/reader/ReaderToolbar.svelte";
    import ReaderFooter from "$lib/components/reader/ReaderFooter.svelte";
    import TocDrawer from "$lib/components/reader/TocDrawer.svelte";
    import SettingsPanel from "$lib/components/reader/SettingsPanel.svelte";

    let { data } = $props();

    let container: HTMLDivElement | undefined = $state();
    let view: any = $state();

    // UI state
    let uiVisible = $state(false);
    let tocVisible = $state(false);
    let settingsVisible = $state(false);
    let loading = $state(true);
    let error = $state<string | null>(null);

    // Book Progress Sync
    let currentFraction = $state(0);
    let currentLoc = $state<any>(null);
    let currentIndex = $state(0);
    let lastSyncedFraction = 0;

    // Extracted book data
    let tocList: Array<any> = $state([]);

    onMount(async () => {
        try {
            // Import foliate-js view
            // @ts-ignore
            await import(/* @vite-ignore */ "/vendor/foliate-js/view.js");

            view = document.createElement("foliate-view") as any;
            container?.appendChild(view);

            // Relocate event listener (emitted on every page turn)
            view.addEventListener("relocate", (e: CustomEvent) => {
                const { fraction, index, location } = e.detail;
                currentFraction = fraction;
                currentIndex = index;
                currentLoc = location;

                // Sync progress if changed significantly or just periodically
                if (Math.abs(fraction - lastSyncedFraction) > 0.05) {
                    syncProgress(fraction);
                }
            });

            // Open the book stream
            const bookUrl = `/api/abs/items/${data.id}/ebook`;
            const openedBook = await view.open(bookUrl);

            // Load table of contents
            if (openedBook.toc) {
                tocList = openedBook.toc;
            }

            // Restore progress if the user was reading before
            if ($bookStore.data && $bookStore.data.progress > 0) {
                // Approximate relocation based on fraction or index (foliate uses cfis ideally, but we have global progress)
                // Foliate allows view.goTo({ fraction: number }) or equivalent if we compute it.
                // Wait, foliate-js relocate returns fraction. For setting it, foliate-js view.goTo() isn't fractional globally, it's per section.
                // Since ABS progress is global fraction between 0 and 1, we might need a workaround.
                // For now, if no CFI is stored locally, we'll just start.
            }

            loading = false;
        } catch (e: any) {
            console.error("Failed to load reader:", e);
            error = e.message || "Failed to load ebook";
            loading = false;
        }
    });

    onDestroy(() => {
        syncProgress(currentFraction); // Final sync
        if (view) {
            // Foliate does not have a strict teardown, but removing it helps
            view.remove();
        }
    });

    async function syncProgress(fraction: number) {
        if (!data.id || fraction === lastSyncedFraction) return;
        lastSyncedFraction = fraction;
        try {
            await api.patch(`/abs/items/${data.id}/progress`, {
                progress: fraction,
                isFinished: fraction >= 0.99,
            });
        } catch (e) {
            // silent fail on sync
        }
    }

    function handleScreenClick(e: MouseEvent) {
        // We divide the screen into 3 vertical zones: Prev, Menu, Next
        const x = e.clientX;
        const width = window.innerWidth;

        // If clicking on UI elements, ignore
        if ((e.target as HTMLElement).closest(".reader-ui-overlay")) return;

        if (x < width * 0.25) {
            // Left 25% -> Prev
            view?.prev();
        } else if (x > width * 0.75) {
            // Right 25% -> Next
            view?.next();
        } else {
            // Center 50% -> Toggle UI
            uiVisible = !uiVisible;
            if (!uiVisible) {
                tocVisible = false;
                settingsVisible = false;
            }
        }
    }

    function navigateToc(href: string) {
        view?.goTo(href);
        tocVisible = false;
        uiVisible = false;
    }
</script>

<svelte:head>
    <title>{$bookStore.data?.title || "Reader"} - Fumiki</title>
</svelte:head>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="reader-container" onclick={handleScreenClick}>
    <div
        bind:this={container}
        class="foliate-wrapper"
        style="--foliate-height: 100vh;"
    >
        <!-- Foliate View dynamically injected here -->
    </div>

    {#if loading}
        <div class="loader-overlay">
            <div class="spinner"></div>
            <p>Loading book structure...</p>
        </div>
    {/if}

    {#if error}
        <div class="error-overlay">
            <p>Error: {error}</p>
            <button onclick={() => window.history.back()}>Go Back</button>
        </div>
    {/if}

    <!-- UI Overlay container ensures click catching for inner tools -->
    <div
        class="reader-ui-overlay"
        class:visible={uiVisible}
        onclick={(e) => e.stopPropagation()}
    >
        {#if uiVisible}
            <ReaderToolbar
                title={$bookStore.data?.title || "Unknown Title"}
                onToggleToc={() => {
                    tocVisible = !tocVisible;
                    settingsVisible = false;
                }}
                onToggleSettings={() => {
                    settingsVisible = !settingsVisible;
                    tocVisible = false;
                }}
            />

            <ReaderFooter fraction={currentFraction} />

            {#if tocVisible}
                <TocDrawer
                    toc={tocList}
                    onNavigate={navigateToc}
                    onClose={() => (tocVisible = false)}
                />
            {/if}

            {#if settingsVisible}
                <SettingsPanel
                    {view}
                    onClose={() => (settingsVisible = false)}
                />
            {/if}
        {/if}
    </div>
</div>

<style>
    /* Fullscreen layout bypassing App Shell */
    :global(body:has(.reader-container)) {
        overflow: hidden;
        margin: 0;
        padding: 0;
    }

    .reader-container {
        position: fixed;
        inset: 0;
        z-index: 9999;
        /* Readers usually match the current theme base, foliate handles text rendering inside */
        background: var(--surface-0);
    }

    .foliate-wrapper {
        width: 100%;
        height: 100%;
    }

    /* Foliate-view part styling targeting the custom element */
    .foliate-wrapper :global(foliate-view) {
        display: block;
        width: 100%;
        height: 100%;
    }

    .loader-overlay,
    .error-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--surface-0);
        color: var(--text-base);
        z-index: 10;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--surface-2);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: var(--space-4);
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .reader-ui-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none; /* Let touches fall through to reader until an active UI is hit */
        z-index: 20;
    }

    .reader-ui-overlay.visible {
        pointer-events: auto; /* Catch taps to close things inside the overlay if needed, although mostly we bind carefully */
    }
</style>
