<script lang="ts">
    let {
        variant = "text",
        class: className = "",
        style = "",
    }: {
        variant?: "text" | "card" | "cover" | "row";
        class?: string;
        style?: string;
    } = $props();
</script>

<div class="skeleton skeleton-{variant} {className}" {style}></div>

<style>
    .skeleton {
        background: var(--surface-3);
        animation: pulse 2s infinite ease-in-out;
    }

    .skeleton-text {
        height: 1em;
        border-radius: 4px;
        width: 100%;
    }

    .skeleton-card {
        height: 200px;
        border-radius: var(--radius-lg);
        width: 100%;
    }

    .skeleton-cover {
        aspect-ratio: 2 / 3;
        border-radius: var(--radius);
        width: 100%;
    }

    .skeleton-row {
        height: 40px;
        border-radius: var(--radius);
        width: 100%;
    }

    @keyframes pulse {
        0% {
            opacity: 0.6;
        }
        50% {
            opacity: 0.3;
        }
        100% {
            opacity: 0.6;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .skeleton {
            animation: none;
        }
    }
</style>
