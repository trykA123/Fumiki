<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "$lib/components/Icon.svelte";

    let {
        value = $bindable(""),
        placeholder = "Search...",
        class: className = "",
        onsearch,
    }: {
        value?: string;
        placeholder?: string;
        class?: string;
        onsearch?: (val: string) => void;
    } = $props();

    let timeout: ReturnType<typeof setTimeout>;

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        value = target.value;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (onsearch) onsearch(value);
        }, 300);
    }
</script>

<div class="search-container {className}">
    <Icon name="search" size={18} class="search-icon" />
    <input
        type="search"
        {value}
        oninput={handleInput}
        {placeholder}
        class="search-input"
    />
</div>

<style>
    .search-container {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 480px;
    }

    .search-icon {
        position: absolute;
        left: 12px;
        color: var(--text-muted);
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        height: 40px;
        padding: 0 16px 0 40px;
        border-radius: 100px;
        border: 1px solid var(--border-medium);
        background: var(--surface-1);
        color: var(--text-primary);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        transition: all 0.2s ease;
    }

    .search-input:hover {
        background: var(--surface-2);
        border-color: var(--border-strong);
    }

    .search-input:focus {
        outline: none;
        background: var(--surface-0);
        border-color: var(--accent);
        box-shadow: 0 0 0 1px var(--accent);
    }

    .search-input::placeholder {
        color: var(--text-muted);
    }

    /* Cancel Search Icon (WebKit) */
    .search-input::-webkit-search-cancel-button {
        -webkit-appearance: none;
        appearance: none;
        height: 16px;
        width: 16px;
        background-color: var(--text-muted);
        mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>");
        -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>");
        cursor: pointer;
    }
</style>
