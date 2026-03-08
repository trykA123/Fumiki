<script lang="ts">
    import { slide } from "svelte/transition";
    import Icon from "$lib/components/Icon.svelte";

    let {
        title,
        onToggleToc,
        onToggleNotes,
        onToggleSettings,
    }: {
        title: string;
        onToggleToc: () => void;
        onToggleNotes: () => void;
        onToggleSettings: () => void;
    } = $props();

    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "/library";
        }
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="fixed top-0 inset-x-0 h-14 bg-surface-0 text-text-base flex items-center justify-between px-2 pt-[env(safe-area-inset-top)] pb-0 shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-50 pointer-events-auto"
    transition:slide={{ duration: 250, axis: "y" }}
    onclick={(e) => e.stopPropagation()}
>
    <button
        class="bg-transparent border-none text-text-base w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-surface-2"
        onclick={goBack}
        aria-label="Go Back"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
        >
    </button>

    <div class="flex-1 overflow-hidden mx-4 text-center">
        <h1
            class="font-serif text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis m-0"
        >
            {title}
        </h1>
    </div>

    <div class="flex gap-2">
        <button
            class="bg-transparent border-none text-text-base w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-surface-2"
            onclick={onToggleToc}
            aria-label="Table of Contents"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><line x1="8" y1="6" x2="21" y2="6"></line><line
                    x1="8"
                    y1="12"
                    x2="21"
                    y2="12"
                ></line><line x1="8" y1="18" x2="21" y2="18"></line><line
                    x1="3"
                    y1="6"
                    x2="3.01"
                    y2="6"
                ></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line
                    x1="3"
                    y1="18"
                    x2="3.01"
                    y2="18"
                ></line></svg
            >
        </button>
        <button
            class="bg-transparent border-none text-text-base w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-surface-2"
            onclick={onToggleNotes}
            aria-label="Notes & Highlights"
        >
            <Icon name="edit" size={20} />
        </button>
        <button
            class="bg-transparent border-none text-text-base w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-surface-2"
            onclick={onToggleSettings}
            aria-label="Settings"
        >
            <Icon name="settings" size={20} />
        </button>
    </div>
</div>
