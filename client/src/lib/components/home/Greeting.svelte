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

<div class="greeting-container" class:visible={mounted}>
    {#if mounted}
        <div class="greeting-content" transition:fade={{ duration: 400 }}>
            <h1 class="greeting-text">
                {greeting}{userName ? `, ${userName}` : ""}
            </h1>

            <div class="status-row">
                {#if currentTitle}
                    <span class="current-title">{currentTitle}</span>
                {/if}

                {#if kp !== undefined}
                    <div class="kp-badge">
                        <span class="kp-value">{kp}</span>
                        <span class="kp-label">KP</span>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .greeting-container {
        padding: var(--space-6) 0 var(--space-8);
        min-height: 80px; /* Prevent layout shift while calculating time */
    }

    .greeting-container:not(.visible) {
        visibility: hidden;
    }

    /* Base styles */
    .greeting-wrapper {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-top: calc(var(--space-8) + env(safe-area-inset-top, 0px));
        margin-bottom: var(--space-4);
    }

    .greeting-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .greeting-text {
        font-family: var(--font-serif);
        font-size: var(--text-2xl);
        font-weight: 400;
        color: var(--text-base);
        margin: 0;
        letter-spacing: -0.02em;
    }

    .status-row {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        flex-wrap: wrap;
    }

    .current-title {
        font-size: var(--text-sm);
        color: var(--text-muted);
    }

    .kp-badge {
        display: inline-flex;
        align-items: baseline;
        gap: 2px;
        background: var(--surface-2);
        padding: 2px 8px;
        border-radius: var(--radius-full);
    }

    .kp-value {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--accent);
    }

    .kp-label {
        font-size: 10px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
</style>
