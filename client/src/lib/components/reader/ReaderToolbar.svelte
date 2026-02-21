<script lang="ts">
    import { slide } from "svelte/transition";
    import Icon from "$lib/components/Icon.svelte";

    let {
        title,
        onToggleToc,
        onToggleSettings,
    }: {
        title: string;
        onToggleToc: () => void;
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
    class="reader-toolbar"
    transition:slide={{ duration: 250, axis: "y" }}
    onclick={(e) => e.stopPropagation()}
>
    <button class="icon-btn" onclick={goBack} aria-label="Go Back">
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

    <div class="title-container">
        <h1 class="title">{title}</h1>
    </div>

    <div class="actions">
        <button
            class="icon-btn"
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
            class="icon-btn"
            onclick={onToggleSettings}
            aria-label="Settings"
        >
            <Icon name="settings" size={20} />
        </button>
    </div>
</div>

<style>
    .reader-toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 56px;
        background: var(--surface-0);
        color: var(--text-base);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--space-2) env(safe-area-inset-top) var(--space-2);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 50;
        pointer-events: auto;
    }

    .title-container {
        flex: 1;
        overflow: hidden;
        margin: 0 var(--space-4);
        text-align: center;
    }

    .title {
        font-family: var(--font-serif);
        font-size: var(--text-base);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
    }

    .actions {
        display: flex;
        gap: var(--space-2);
    }

    .icon-btn {
        background: transparent;
        border: none;
        color: var(--text-base);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color var(--transition-base);
    }

    .icon-btn:hover {
        background-color: var(--surface-2);
    }
</style>
