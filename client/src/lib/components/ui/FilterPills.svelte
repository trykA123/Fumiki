<script lang="ts">
    import { createEventDispatcher } from "svelte";

    type FilterOption = "all" | "ebook" | "audiobook";

    let {
        value = $bindable("all"),
        class: className = "",
        onchange,
    }: {
        value?: FilterOption;
        class?: string;
        onchange?: (id: FilterOption) => void;
    } = $props();

    const options: { id: FilterOption; label: string }[] = [
        { id: "all", label: "All" },
        { id: "ebook", label: "Ebooks" },
        { id: "audiobook", label: "Audiobooks" },
    ];

    function select(id: FilterOption) {
        value = id;
        if (onchange) onchange(id);
    }
</script>

<div class="filter-pills {className}">
    {#each options as option}
        <button
            type="button"
            class="pill"
            class:active={value === option.id}
            onclick={() => select(option.id)}
        >
            {option.label}
        </button>
    {/each}
</div>

<style>
    .filter-pills {
        display: flex;
        gap: var(--space-2);
        overflow-x: auto;
        padding-bottom: 2px; /* For scrollbar breathing room if needed */
        scrollbar-width: none; /* Firefox */
    }
    .filter-pills::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }

    .pill {
        background: var(--surface-1);
        color: var(--text-secondary);
        border: 1px solid var(--border-subtle);
        border-radius: 100px;
        padding: 6px 16px;
        font-family: var(--font-body);
        font-size: var(--text-sm);
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .pill:hover:not(.active) {
        background: var(--surface-2);
        color: var(--text-primary);
        border-color: var(--border-medium);
    }

    .pill.active {
        background: var(--surface-0);
        color: var(--text-base);
        border-color: var(--accent-border);
        font-weight: 500;
        box-shadow: 0 2px 8px var(--shadow-color);
    }

    /* Sumi specific override for pills (squarer) */
    :global([data-theme="sumi"]) .pill {
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 11px;
        font-weight: 600;
    }
</style>
