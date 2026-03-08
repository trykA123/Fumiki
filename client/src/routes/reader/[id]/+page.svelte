<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { book as bookStore } from "$lib/stores/book";
    import { api } from "$lib/api/client";
    import ReaderToolbar from "$lib/components/reader/ReaderToolbar.svelte";
    import ReaderFooter from "$lib/components/reader/ReaderFooter.svelte";
    import TocDrawer from "$lib/components/reader/TocDrawer.svelte";
    import SettingsPanel from "$lib/components/reader/SettingsPanel.svelte";
    import HighlightPopover from "$lib/components/reader/HighlightPopover.svelte";
    import NoteEditorModal from "$lib/components/reader/NoteEditorModal.svelte";
    import NotesDrawer from "$lib/components/reader/NotesDrawer.svelte";

    // Notes system
    import { notesStore } from "$lib/stores/notes";
    import { toast } from "$lib/stores/toast";

    let { data } = $props();

    let container: HTMLDivElement | undefined = $state();
    let view: any = $state();

    // UI state
    let uiVisible = $state(false);
    let tocVisible = $state(false);
    let settingsVisible = $state(false);
    let notesVisible = $state(false);
    let loading = $state(true);
    let error = $state<string | null>(null);

    // Book Progress Sync
    let currentFraction = $state(0);
    let currentLoc = $state<any>(null);
    let currentIndex = $state(0);
    let lastSyncedFraction = 0;

    // Extracted book data
    let tocList: Array<any> = $state([]);

    // Highlight State
    let popoverVisible = $state(false);
    let activeHighlightId = $state<string | null>(null);
    let activeColor = $state<string | null>(null);
    let selectedText = $state("");
    let selectedCFI = $state("");
    let selectedIndex = $state(0);

    let noteEditorVisible = $state(false);
    let editNoteContent = $state("");

    // Initial note load
    onMount(() => {
        notesStore.loadBookNotes(data.id);
    });

    onMount(async () => {
        try {
            // Import foliate-js view
            // @ts-ignore
            await import(/* @vite-ignore */ "$lib/vendor/foliate-js/view.js");

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
            await view.open(bookUrl);
            await view.init({ lastLocation: null }); // Render first page

            // Force the reader to inherit the initial tailwind theme colors
            try {
                const computed = window.getComputedStyle(document.body);
                const textColor =
                    computed.getPropertyValue("--text-primary").trim() ||
                    "inherit";
                const accentColor =
                    computed.getPropertyValue("--accent").trim() || "inherit";

                const initCss = `
                    @namespace epub "http://www.idpf.org/2007/ops";
                    html { color: ${textColor} !important; }
                    body { background: transparent !important; }
                    a { color: ${accentColor} !important; }
                    
                    ::selection { background: rgba(125, 125, 125, 0.3); }
                `;
                view.renderer.setStyles(initCss);
            } catch (ignore) {}

            // Hook into text selection within the embedded document
            view.addEventListener("load", (e: any) => {
                const { doc, index } = e.detail;

                doc.addEventListener("selectionchange", () => {
                    const sel = doc.defaultView?.getSelection();
                    if (
                        sel &&
                        !sel.isCollapsed &&
                        sel.toString().trim().length > 0
                    ) {
                        try {
                            const range = sel.getRangeAt(0);
                            selectedCFI = view.getCFI(index, range);
                            selectedText = sel.toString().trim();
                            selectedIndex = index;

                            activeHighlightId = null;
                            activeColor = null;
                            popoverVisible = true;
                            uiVisible = false; // Hide reader UI when highlighting
                        } catch (err) {
                            // CFI generation failure is non-critical
                        }
                    } else if (
                        sel &&
                        sel.isCollapsed &&
                        popoverVisible &&
                        !activeHighlightId
                    ) {
                        // Immediately close if unselected
                        popoverVisible = false;
                    }
                });
            });

            // Load table of contents
            if (view.book && view.book.toc) {
                tocList = view.book.toc;
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
                notesVisible = false;
            }
        }
    }

    function navigateToc(href: string) {
        view?.goTo(href);
        tocVisible = false;
        notesVisible = false;
        uiVisible = false;
    }

    // --- Highlight Handlers ---

    async function handleAddHighlight(color: string) {
        if (!selectedCFI || !data.id) return;

        try {
            await notesStore.createNote(
                data.id,
                "highlight",
                "ebook",
                { cfi: selectedCFI, excerpt: selectedText },
                null, // No text content yet
                color,
            );

            // Draw visually in foliate
            view.addAnnotation({ value: selectedCFI });

            view.deselect();
            popoverVisible = false;
            toast.add("Highlight saved", "success");
        } catch (e) {
            /* error handled in store */
        }
    }

    function handleCopyText() {
        if (selectedText) {
            navigator.clipboard.writeText(selectedText);
            toast.add("Copied to clipboard", "success");
            view.deselect();
            popoverVisible = false;
        }
    }

    function handleOpenNote() {
        view?.deselect();
        popoverVisible = false;
        editNoteContent = "";
        activeHighlightId = null;
        noteEditorVisible = true;
    }

    async function handleSaveNote(content: string) {
        if (!selectedCFI || !data.id) return;

        try {
            await notesStore.createNote(
                data.id,
                "note", // Mark as note rather than highlight
                "ebook",
                { cfi: selectedCFI, excerpt: selectedText },
                content,
                activeColor || "yellow",
            );

            view.addAnnotation({ value: selectedCFI });
            noteEditorVisible = false;
            toast.add("Note saved", "success");
        } catch (e) {
            /* error handled in store */
        }
    }

    async function handleDeleteHighlight() {
        if (!activeHighlightId || !data.id) return;
        try {
            await notesStore.deleteNote(activeHighlightId, data.id);
            view.deleteAnnotation({ value: selectedCFI });
            popoverVisible = false;
        } catch (e) {
            /* error handled in store */
        }
    }
</script>

<svelte:head>
    <title>{$bookStore.data?.title || "Reader"} - Fumiki</title>
</svelte:head>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="fixed inset-0 z-[9999] bg-surface-0 global-reader-override"
    onclick={handleScreenClick}
>
    <div
        bind:this={container}
        class="w-full h-full [&>foliate-view]:block [&>foliate-view]:w-full [&>foliate-view]:h-full"
    >
        <!-- Foliate View dynamically injected here -->
    </div>

    {#if loading}
        <div
            class="absolute inset-0 flex flex-col items-center justify-center bg-surface-0 text-text-primary z-10"
        >
            <div
                class="w-10 h-10 border-4 border-surface-2 border-t-accent rounded-full animate-spin mb-4"
            ></div>
            <p>Loading book structure...</p>
        </div>
    {/if}

    {#if error}
        <div
            class="absolute inset-0 flex flex-col items-center justify-center bg-surface-0 text-text-primary z-10"
        >
            <p>Error: {error}</p>
            <button onclick={() => window.history.back()}>Go Back</button>
        </div>
    {/if}

    <!-- UI Overlay container ensures click catching for inner tools -->
    <div
        class={`absolute inset-0 z-20 ${uiVisible ? "pointer-events-auto" : "pointer-events-none"}`}
        onclick={(e) => e.stopPropagation()}
    >
        {#if uiVisible}
            <ReaderToolbar
                title={$bookStore.data?.title || "Unknown Title"}
                onToggleToc={() => {
                    tocVisible = !tocVisible;
                    settingsVisible = false;
                    notesVisible = false;
                }}
                onToggleNotes={() => {
                    notesVisible = !notesVisible;
                    tocVisible = false;
                    settingsVisible = false;
                }}
                onToggleSettings={() => {
                    settingsVisible = !settingsVisible;
                    tocVisible = false;
                    notesVisible = false;
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

            {#if notesVisible}
                <NotesDrawer
                    bookId={data.id}
                    onNavigate={navigateToc}
                    onClose={() => (notesVisible = false)}
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

    <HighlightPopover
        visible={popoverVisible}
        {activeColor}
        onHighlight={handleAddHighlight}
        onNote={handleOpenNote}
        onCopy={handleCopyText}
        onDelete={handleDeleteHighlight}
        onClose={() => {
            popoverVisible = false;
            view?.deselect();
        }}
    />

    <NoteEditorModal
        visible={noteEditorVisible}
        initialContent={editNoteContent}
        onSave={handleSaveNote}
        onClose={() => (noteEditorVisible = false)}
    />
</div>
