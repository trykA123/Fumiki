<script lang="ts">
    import { toast } from "$lib/stores/toast";
    import Toast from "$lib/components/ui/Toast.svelte";
    import { flip } from "svelte/animate";
    import { fly, fade } from "svelte/transition";
</script>

<div
    class="fixed right-4 z-[9999] flex flex-col gap-2 pointer-events-none bottom-[calc(env(safe-area-inset-bottom,0px)+var(--space-4))] items-end max-md:left-4 max-md:items-center max-md:bottom-[calc(56px+env(safe-area-inset-bottom,0px)+var(--space-4))]"
>
    {#each $toast as t (t.id)}
        <div
            in:fly={{ y: 20, duration: 400, opacity: 0 }}
            out:fade={{ duration: 200 }}
            animate:flip={{ duration: 300 }}
            class="pointer-events-auto"
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
