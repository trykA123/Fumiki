<script lang="ts">
    import type { Snippet } from "svelte";

    type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";
    type ButtonSize = "sm" | "md" | "lg";

    let {
        variant = "primary",
        size = "md",
        href,
        disabled = false,
        type = "button",
        class: className = "",
        children,
        onclick,
    }: {
        variant?: ButtonVariant;
        size?: ButtonSize;
        href?: string;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        class?: string;
        children: Snippet;
        onclick?: (e: MouseEvent) => void;
    } = $props();

    const isLink = $derived(!!href);
    const tag = $derived(isLink ? "a" : "button");
</script>

<svelte:element
    this={tag}
    {href}
    {type}
    {disabled}
    {onclick}
    class="btn btn-{variant} btn-{size} {className}"
>
    {@render children()}
</svelte:element>

<style>
    .btn {
        font-family: var(--font-body);
        font-weight: 600;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        transition: all 200ms ease;
        border-radius: var(--radius);
        text-decoration: none;
    }

    /* Sizes */
    .btn-sm {
        padding: 7px 14px;
        font-size: 12px;
        min-height: 32px;
    }
    .btn-md {
        padding: 10px 22px;
        font-size: 13px;
        min-height: 40px;
    }
    .btn-lg {
        padding: 13px 28px;
        font-size: 15px;
        min-height: 46px;
    }

    /* Icon size override */
    .btn-icon {
        width: 40px;
        height: 40px;
        padding: 0;
        min-height: auto;
    }
    .btn.btn-icon.btn-sm {
        width: 32px;
        height: 32px;
    }
    .btn.btn-icon.btn-lg {
        width: 46px;
        height: 46px;
    }

    /* Primary */
    .btn-primary {
        background: var(--accent);
        color: var(--text-inverse);
    }
    .btn-primary:hover:not(:disabled) {
        background: var(--accent-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 16px var(--accent-glow-strong);
    }
    .btn-primary:active:not(:disabled) {
        transform: translateY(0);
    }
    .btn-primary:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    /* Secondary */
    .btn-secondary {
        background: var(--surface-3);
        color: var(--text-primary);
    }
    .btn-secondary:hover:not(:disabled) {
        background: var(--surface-4);
    }

    /* Ghost */
    .btn-ghost {
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-medium);
    }
    .btn-ghost:hover:not(:disabled) {
        background: var(--surface-2);
        color: var(--text-primary);
        border-color: var(--border-strong);
    }

    /* Danger */
    .btn-danger {
        background: var(--error);
        color: #fff;
    }
    .btn-danger:hover:not(:disabled) {
        background: hsl(0 84% 50%); /* slightly darker red */
    }

    /* Icon */
    .btn-icon {
        background: transparent;
        color: var(--text-secondary);
    }
    .btn-icon:hover:not(:disabled) {
        background: var(--surface-2);
        color: var(--text-primary);
    }

    /* Theme: Sumi Overrides */
    :global([data-theme="sumi"]) .btn:not(.btn-icon) {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
</style>
