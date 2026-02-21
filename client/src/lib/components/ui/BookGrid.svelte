<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        children,
        class: className = "",
    }: { children: Snippet; class?: string } = $props();
</script>

<div class="book-grid {className}">
    {@render children()}
</div>

<style>
    /* BookGrid Styles */
    .book-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: var(--space-4);
        width: 100%;
        grid-auto-rows: min-content;
    }

    /* Responsive Breakpoints */
    /* Phone Large */
    @media (min-width: 480px) {
        .book-grid {
            grid-template-columns: repeat(minmax(140px, 1fr));
        }
    }

    /* Tablet Portrait */
    @media (min-width: 640px) {
        .book-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: var(--space-5);
        }
    }

    /* Tablet Landscape / Laptop */
    @media (min-width: 900px) {
        .book-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: var(--space-6);
        }
    }

    /* Desktop Wide */
    @media (min-width: 1200px) {
        .book-grid {
            grid-template-columns: repeat(6, 1fr);
        }
    }
</style>
