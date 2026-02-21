<script lang="ts">
    import { slide } from "svelte/transition";
    import Icon from "$lib/components/Icon.svelte";

    let {
        toc,
        onNavigate,
        onClose,
    }: { toc: any[]; onNavigate: (href: string) => void; onClose: () => void } =
        $props();

    function handleNav(item: any, e: Event) {
        e.stopPropagation();
        if (item.href) {
            onNavigate(item.href);
        }
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="toc-overlay" onclick={onClose}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="toc-drawer"
        transition:slide={{ duration: 250, axis: "x" }}
        onclick={(e) => e.stopPropagation()}
    >
        <div class="header">
            <h2>Table of Contents</h2>
            <button class="icon-btn" onclick={onClose} aria-label="Close">
                <Icon name="x" size={24} />
            </button>
        </div>

        <div class="content">
            {#if toc && toc.length > 0}
                <ul class="toc-list">
                    {#each toc as item}
                        <li>
                            <button
                                class="toc-item"
                                onclick={(e) => handleNav(item, e)}
                            >
                                {item.label || "Unknown Chapter"}
                            </button>
                            {#if item.subitems && item.subitems.length > 0}
                                <ul class="toc-sublist">
                                    {#each item.subitems as subitem}
                                        <li>
                                            <button
                                                class="toc-item sub"
                                                onclick={(e) =>
                                                    handleNav(subitem, e)}
                                            >
                                                {subitem.label}
                                            </button>
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </li>
                    {/each}
                </ul>
            {:else}
                <div class="empty-state">
                    <p>No chapters found.</p>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .toc-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
        display: flex;
        pointer-events: auto;
    }

    .toc-drawer {
        width: 85vw;
        max-width: 400px;
        height: 100%;
        background: var(--surface-1);
        display: flex;
        flex-direction: column;
        box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-4);
        border-bottom: 1px solid var(--border-subtle);
    }

    .header h2 {
        font-size: var(--text-lg);
        font-weight: 600;
        margin: 0;
    }

    .icon-btn {
        background: transparent;
        border: none;
        color: var(--text-base);
        cursor: pointer;
        padding: var(--space-1);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
    }

    .icon-btn:hover {
        background-color: var(--surface-2);
    }

    .content {
        flex: 1;
        overflow-y: auto;
        padding: var(--space-2) 0;
    }

    .toc-list,
    .toc-sublist {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .toc-item {
        width: 100%;
        text-align: left;
        background: transparent;
        border: none;
        padding: var(--space-3) var(--space-4);
        font-size: var(--text-base);
        color: var(--text-base);
        cursor: pointer;
        transition: background-color var(--transition-base);
        border-bottom: 1px solid var(--border-subtle);
    }

    .toc-item:hover {
        background-color: var(--surface-2);
    }

    .toc-item.sub {
        padding-left: var(--space-8);
        font-size: var(--text-sm);
        color: var(--text-muted);
    }

    .empty-state {
        padding: var(--space-8);
        text-align: center;
        color: var(--text-muted);
    }
</style>
