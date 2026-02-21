<script lang="ts">
    import { toast } from "$lib/stores/toast";
    import Toast from "$lib/components/ui/Toast.svelte";
    import { flip } from "svelte/animate";
    import { fly, fade } from "svelte/transition";
</script>

<div class="toast-container">
    {#each $toast as t (t.id)}
        <div
            in:fly={{ y: 20, duration: 400, opacity: 0 }}
            out:fade={{ duration: 200 }}
            animate:flip={{ duration: 300 }}
            class="toast-wrapper"
        >
            <Toast
                id={t.id}
                message={t.message}
                intent={t.intent}
                duration={t.duration}
            />
        </div>
    {/each}
</div>

<style>
    .toast-container {
        position: fixed;
        bottom: calc(env(safe-area-inset-bottom, 0px) + var(--space-4));
        right: var(--space-4);
        /* Mobile: Keep above the bottom nav */
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: var(--space-2);
        pointer-events: none; /* Let clicks pass through container */
    }

    @media (max-width: 767px) {
        .toast-container {
            bottom: calc(
                56px + env(safe-area-inset-bottom, 0px) + var(--space-4)
            );
            left: var(--space-4); /* Full width on mobile to center them */
            align-items: center;
        }
    }

    .toast-wrapper {
        pointer-events: auto; /* Re-enable clicks on the actual toast */
    }
</style>
