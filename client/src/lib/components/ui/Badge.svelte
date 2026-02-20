<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        variant = "default",
        class: className = "",
        children,
    }: {
        variant?: "default" | "accent" | "success";
        class?: string;
        children: Snippet;
    } = $props();
</script>

<span class="badge badge-{variant} {className}">
    {@render children()}
</span>

<style>
    .badge {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        font-family: var(--font-body);
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: 0.02em;
        border-radius: 100px; /* default pill */
        line-height: 1;
    }

    .badge-default {
        background: var(--surface-2);
        color: var(--text-secondary);
        border: 1px solid var(--border-subtle);
    }

    .badge-accent {
        background: var(--accent);
        color: var(--text-inverse);
    }

    .badge-success {
        background: var(--success);
        color: var(--text-inverse);
    }

    /* Themes */
    :global([data-theme="sumi"]) .badge {
        border-radius: 2px;
    }
</style>
