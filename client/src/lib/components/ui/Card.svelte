<script lang="ts">
    import type { Snippet } from "svelte";
    import { theme } from "$stores/theme";

    let {
        variant = "default",
        class: className = "",
        children,
        onclick,
    }: {
        variant?: "default" | "interactive" | "elevated" | "hero";
        class?: string;
        children: Snippet;
        onclick?: (e: MouseEvent) => void;
    } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="card card-{variant} {className}"
    {onclick}
    class:interactive={variant === "interactive"}
>
    {#if variant === "hero" && $theme?.decorations?.heroTopOrnament}
        <div class="vertical-line"></div>
    {/if}

    {@render children()}

    {#if variant === "hero" && $theme?.decorations?.heroBottomOrnament}
        <div class="vertical-line"></div>
    {/if}
</div>

<style>
    .card {
        background: var(--surface-1);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: var(--card-padding);
        box-shadow: 0 2px 8px var(--shadow-color);
        position: relative;
    }

    /* Interactive Variant */
    .card-interactive,
    .interactive {
        cursor: pointer;
        transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card-interactive:hover,
    .interactive:hover {
        background: var(--surface-2);
        border-color: var(--border-medium);
    }

    /* Elevated Variant */
    .card-elevated {
        box-shadow: 0 8px 32px var(--shadow-color);
    }

    /* Hero Variant */
    .card-hero {
        position: relative;
        overflow: hidden;
    }

    /* Theme: Sumi Overrides */
    :global([data-theme="sumi"]) .interactive:hover {
        border-left: 2px solid var(--accent);
    }

    .vertical-line {
        width: 1px;
        height: 40px;
        background: linear-gradient(180deg, transparent, var(--accent));
        margin: 0 auto;
        opacity: 0.4;
    }

    /* Theme: Kami Overrides */
    :global([data-theme="kami"]) .interactive:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px var(--shadow-color);
    }

    /* Theme: Mori Overrides */
    :global([data-theme="mori"]) .interactive:hover {
        transform: scale(1.01);
        box-shadow: 0 8px 24px var(--shadow-color);
    }
    :global([data-theme="mori"]) .card {
        border: none;
        box-shadow: 0 2px 12px var(--shadow-color);
    }

    :global([data-theme="mori"]) .card-elevated {
        box-shadow: 0 8px 32px var(--shadow-color);
    }

    /* Mori Wood Grain Texture */
    :global([data-theme="mori"]) .card::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.2' numOctaves='3' seed='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23w)' opacity='0.015'/%3E%3C/svg%3E");
        z-index: 0;
    }

    /* Mori Organic Glow */
    :global([data-theme="mori"]) .card {
        box-shadow:
            0 2px 16px var(--shadow-color),
            0 0 0 1px hsl(145 12% 40% / 0.04);
    }
    :global([data-theme="mori"]) .interactive:hover {
        box-shadow:
            0 4px 24px var(--shadow-color),
            0 0 0 1px var(--accent-border);
    }
</style>
