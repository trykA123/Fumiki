<script lang="ts">
    import { fade } from "svelte/transition";

    let {
        src,
        alt = "Book Cover",
        size = "md",
        class: className = "",
    }: {
        src: string;
        alt?: string;
        size?: "sm" | "md" | "lg";
        class?: string;
    } = $props();

    let imageLoaded = $state(false);
    let imageError = $state(false);

    function handleLoad() {
        imageLoaded = true;
    }

    function handleError() {
        imageError = true;
    }
</script>

<div class="book-cover size-{size} {className}">
    {#if !imageLoaded && !imageError}
        <!-- Loading Skeleton -->
        <div class="skeleton"></div>
    {/if}

    {#if imageError}
        <!-- Fallback / Placeholder -->
        <div class="fallback-cover">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="fallback-icon"
                ><path
                    d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
                ></path></svg
            >
        </div>
    {:else}
        <!-- Image with Spine Shadow Overlay -->
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <img
            {src}
            {alt}
            loading="lazy"
            onload={handleLoad}
            onerror={handleError}
            class:loaded={imageLoaded}
            style="visibility: {imageLoaded ? 'visible' : 'hidden'}"
        />
        <div class="spine-shadow"></div>
    {/if}
</div>

<style>
    .book-cover {
        aspect-ratio: 2 / 3;
        border-radius: var(--radius);
        background: var(--surface-3);
        overflow: hidden;
        position: relative;
        flex-shrink: 0;
    }

    /* Size variants based on architecture doc */
    .size-sm {
        width: 40px;
    }
    .size-md {
        width: 100%;
        max-width: 140px;
    }
    .size-lg {
        width: 180px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    img.loaded {
        opacity: 1;
    }

    .spine-shadow {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 6px;
        background: linear-gradient(90deg, hsl(0 0% 0% / 0.15), transparent);
        z-index: 1;
        pointer-events: none;
    }

    .skeleton {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            var(--surface-2) 25%,
            var(--surface-3) 50%,
            var(--surface-2) 75%
        );
        background-size: 200% 100%;
        animation: pulse 1.5s infinite linear;
    }

    @keyframes pulse {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    .fallback-cover {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface-2);
        color: var(--text-muted);
    }

    /* Theme specifics */
    :global([data-theme="sumi"]) .book-cover {
        border-radius: 1px;
        box-shadow: 2px 2px 8px var(--shadow-color);
    }

    :global([data-theme="kami"]) .book-cover {
        border-radius: 4px;
        box-shadow: 3px 4px 12px var(--shadow-color);
    }

    :global([data-theme="mori"]) .book-cover {
        border-radius: 8px;
        box-shadow: 2px 4px 16px var(--shadow-color);
    }
</style>
