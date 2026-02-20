<script lang="ts">
    import type {
        HTMLInputAttributes,
        HTMLTextareaAttributes,
    } from "svelte/elements";

    let {
        value = $bindable(""),
        type = "text",
        size = "md",
        placeholder = "",
        disabled = false,
        class: className = "",
        ...rest
    }: {
        value?: string;
        type?: "text" | "search" | "password" | "textarea";
        size?: "sm" | "md" | "lg" | undefined;
        placeholder?: string;
        disabled?: boolean;
        class?: string;
    } & Omit<HTMLInputAttributes, "size" | "type"> &
        Omit<HTMLTextareaAttributes, "size" | "type"> = $props();
</script>

{#if type === "textarea"}
    <textarea
        bind:value
        {placeholder}
        {disabled}
        class="input textarea input-{size} {className}"
        {...rest}
    ></textarea>
{:else}
    <input
        bind:value
        {type}
        {placeholder}
        {disabled}
        class="input input-{type} input-{size} {className}"
        {...rest}
    />
{/if}

<style>
    .input {
        width: 100%;
        background: var(--surface-2);
        border: 1px solid var(--border-medium);
        border-radius: var(--radius);
        color: var(--text-primary);
        font-family: var(--font-body);
        font-size: var(--body-size);
        outline: none;
        transition: all 200ms ease;
    }

    /* Sizes */
    .input-sm {
        padding: 8px 12px;
        height: 34px;
    }
    .input-md {
        padding: 10px 14px;
        height: 40px;
    }
    .input-lg {
        padding: 13px 16px;
        height: 46px;
    }

    .textarea {
        min-height: 100px;
        height: auto;
        resize: vertical;
        line-height: 1.6;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .input::placeholder {
        color: var(--text-muted);
    }

    .input:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--accent-glow-strong);
    }

    .input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Kami Override */
    :global([data-theme="kami"]) .input {
        background: var(--surface-0);
        border-color: var(--border-strong);
    }

    /* Mori Override */
    :global([data-theme="mori"]) .input {
        border: none;
        box-shadow: inset 0 1px 3px var(--shadow-color);
    }
    :global([data-theme="mori"]) .input:focus {
        box-shadow:
            inset 0 1px 3px var(--shadow-color),
            0 0 0 3px var(--accent-glow-strong);
    }

    /* Search Icon Variant */
    .input-search {
        padding-left: 38px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 12px center;
        background-size: 16px;
    }
</style>
