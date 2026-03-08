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
<div
    class="fixed inset-0 bg-black/50 z-[100] flex pointer-events-auto"
    onclick={onClose}
>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="w-[85vw] max-w-[400px] h-full bg-surface-1 flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.2)]"
        transition:slide={{ duration: 250, axis: "x" }}
        onclick={(e) => e.stopPropagation()}
    >
        <div
            class="flex items-center justify-between p-4 border-b border-border-subtle"
        >
            <h2 class="text-lg font-semibold m-0">Table of Contents</h2>
            <button
                class="bg-transparent border-none text-text-base cursor-pointer p-1 flex items-center justify-center rounded-md hover:bg-surface-2"
                onclick={onClose}
                aria-label="Close"
            >
                <Icon name="x" size={24} />
            </button>
        </div>

        <div class="flex-1 overflow-y-auto py-2 px-0">
            {#if toc && toc.length > 0}
                <ul class="list-none m-0 p-0">
                    {#each toc as item}
                        <li>
                            <button
                                class="w-full text-left bg-transparent border-t-0 border-x-0 border-b border-border-subtle px-4 py-3 text-base text-text-base cursor-pointer transition-colors duration-200 hover:bg-surface-2"
                                onclick={(e) => handleNav(item, e)}
                            >
                                {item.label || "Unknown Chapter"}
                            </button>
                            {#if item.subitems && item.subitems.length > 0}
                                <ul class="list-none m-0 p-0">
                                    {#each item.subitems as subitem}
                                        <li>
                                            <button
                                                class="w-full text-left bg-transparent border-t-0 border-x-0 border-b border-border-subtle py-3 pr-4 pl-8 text-sm text-text-muted cursor-pointer transition-colors duration-200 hover:bg-surface-2"
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
                <div class="p-8 text-center text-text-muted">
                    <p>No chapters found.</p>
                </div>
            {/if}
        </div>
    </div>
</div>
