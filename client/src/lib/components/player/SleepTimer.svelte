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
    class={`bg-transparent border border-border-subtle text-text-base cursor-pointer h-9 px-3 rounded-md flex items-center justify-center gap-2 transition-all duration-200 hover:bg-surface-2 hover:border-border-strong active:scale-95 ${
        $player.sleepTimerRemaining !== null || options[currentIndex] !== 0
            ? "!text-accent bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] !border-accent"
            : ""
    }`}
    onclick={cycleSleepTimer}
    aria-label="Sleep timer"
>
    <Icon name="moon" size={20} />
    {#if $player.sleepTimerRemaining !== null || options[currentIndex] !== 0}
        <span class="font-mono text-sm whitespace-nowrap"
            >{getDisplayLabel()}</span
        >
    {/if}
</button>
