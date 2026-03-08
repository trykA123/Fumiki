<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let {
        userName,
        currentTitle,
        kp,
    }: { userName?: string; currentTitle?: string; kp?: number } = $props();

    let greeting = $state("Hello");
    let mounted = $state(false);

    onMount(() => {
        mounted = true;
        const hour = new Date().getHours();
        if (hour < 12) greeting = "Good morning";
        else if (hour < 18) greeting = "Good afternoon";
        else greeting = "Good evening";
    });
</script>

<div class={`py-6 px-0 pb-8 min-h-[80px] ${mounted ? "" : "invisible"}`}>
    {#if mounted}
        <div
            class="flex flex-col gap-2 mt-[calc(var(--space-8)+env(safe-area-inset-top,0px))] mb-4"
            transition:fade={{ duration: 400 }}
        >
            <h1
                class="font-serif text-2xl font-normal text-text-base m-0 tracking-tight"
            >
                {greeting}{userName ? `, ${userName}` : ""}
            </h1>

            <div class="flex items-center gap-4 flex-wrap">
                {#if currentTitle}
                    <span class="text-sm text-text-muted">{currentTitle}</span>
                {/if}

                {#if kp !== undefined}
                    <div
                        class="inline-flex items-baseline gap-[2px] bg-surface-2 px-2 py-[2px] rounded-full"
                    >
                        <span
                            class="font-mono text-sm font-semibold text-accent"
                            >{kp}</span
                        >
                        <span
                            class="text-[10px] font-bold text-text-muted uppercase tracking-[0.05em]"
                            >KP</span
                        >
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
