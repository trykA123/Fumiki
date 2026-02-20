<script lang="ts">
    import { theme } from "$stores/theme";

    let {
        class: className = "",
    }: {
        class?: string;
    } = $props();
</script>

{#if $theme?.decorations?.dividerStyle === "dots"}
    <div class="divider dots {className}" role="separator">
        <span class="dot"></span>
    </div>
{:else if $theme?.decorations?.dividerStyle === "space"}
    <div class="divider space {className}" role="separator"></div>
{:else}
    <div class="divider line {className}" role="separator"></div>
{/if}

<style>
    .divider {
        margin: var(--space-6) 0;
    }

    /* Pattern/Line */
    .divider.line {
        height: 2px;
        background: linear-gradient(
            90deg,
            transparent,
            var(--accent),
            transparent
        );
        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='4'%3E%3Cpath d='M0 2 Q25 0 50 2 Q75 4 100 2 Q125 0 150 2 Q175 4 200 2' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E")
            repeat-x;
        mask-size: 200px 4px;
        -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='4'%3E%3Cpath d='M0 2 Q25 0 50 2 Q75 4 100 2 Q125 0 150 2 Q175 4 200 2' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E")
            repeat-x;
        -webkit-mask-size: 200px 4px;
    }

    /* Kami overrides line with solid rule */
    :global([data-theme="kami"]) .divider.line {
        height: 1px;
        background: var(--border-subtle);
        mask: none;
        -webkit-mask: none;
    }

    /* Dots */
    .divider.dots {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }
    .divider.dots::before,
    .divider.dots::after,
    .divider.dots .dot {
        content: "";
        display: block;
        width: 4px;
        height: 4px;
        background: var(--text-muted);
        border-radius: 50%;
        opacity: 0.3;
    }

    /* Space (Mori can use space just by existing) */
    .divider.space {
        height: 0;
        border: none;
    }
</style>
