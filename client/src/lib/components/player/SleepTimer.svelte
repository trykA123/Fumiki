<script lang="ts">
    import { player } from "$lib/stores/player";
    import Icon from "$lib/components/Icon.svelte";

    // Sleep options in minutes. 0 means off. -1 means end of chapter.
    const options = [0, 15, 30, 45, 60, -1];

    let currentIndex = $state(0);

    function cycleSleepTimer() {
        currentIndex = (currentIndex + 1) % options.length;
        const next = options[currentIndex];

        if (next === 0) {
            player.setSleepTimer(0);
        } else if (next === -1) {
            player.setSleepTimerEndOfChapter();
        } else {
            player.setSleepTimer(next);
        }
    }

    // Format remaining time nicely
    function getDisplayLabel() {
        if ($player.sleepTimerRemaining === null) {
            if (options[currentIndex] === -1) return "Ch end";
            if (options[currentIndex] === 0) return "";
            return `${options[currentIndex]}m`;
        }

        const remaining = $player.sleepTimerRemaining;
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    }
</script>

<button
    class="sleep-btn"
    class:active={$player.sleepTimerRemaining !== null ||
        options[currentIndex] !== 0}
    onclick={cycleSleepTimer}
    aria-label="Sleep timer"
>
    <Icon name="moon" size={20} />
    {#if $player.sleepTimerRemaining !== null || options[currentIndex] !== 0}
        <span class="label">{getDisplayLabel()}</span>
    {/if}
</button>

<style>
    .sleep-btn {
        background: transparent;
        border: 1px solid var(--border-subtle);
        color: var(--text-base);
        cursor: pointer;
        height: 36px;
        padding: 0 var(--space-3);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        transition: all var(--transition-base);
    }

    .sleep-btn:hover {
        background-color: var(--surface-2);
        border-color: var(--border-strong);
    }

    .sleep-btn.active {
        color: var(--accent);
        background-color: color-mix(in srgb, var(--accent) 10%, transparent);
        border-color: var(--accent);
    }

    .sleep-btn:active {
        transform: scale(0.95);
    }

    .label {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        white-space: nowrap;
    }
</style>
