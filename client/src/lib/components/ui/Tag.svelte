<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        intent = "muted",
        class: className = "",
        children,
    }: {
        intent?: "accent" | "success" | "info" | "muted";
        class?: string;
        children: Snippet;
    } = $props();
</script>

<span class="tag tag-{intent} {className}">
    {@render children()}
</span>

<style>
    .tag {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: 0.02em;
        border-radius: 100px;
    }

    /* Theme: Sumi sharp corners */
    :global([data-theme="sumi"]) .tag {
        border-radius: 2px;
    }

    /* Variants */
    .tag-accent {
        background: var(--accent-glow-strong);
        color: var(--accent-text, #fff);
        border: 1px solid var(--accent-border);
    }

    .tag-success {
        background: hsl(155 45% 42% / 0.12);
        color: var(--success);
        border: 1px solid hsl(155 45% 42% / 0.2);
    }

    .tag-info {
        background: hsl(210 100% 50% / 0.12);
        color: var(--info, hsl(210 100% 50%));
        border: 1px solid hsl(210 100% 50% / 0.2);
    }

    .tag-muted {
        background: var(--surface-3);
        color: var(--text-secondary);
        border: 1px solid var(--border-subtle);
    }
</style>
