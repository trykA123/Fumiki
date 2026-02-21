<script lang="ts">
    import { player } from "$lib/stores/player";

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

    function cycleSpeed() {
        const current = $player.playbackRate;
        const idx = speeds.indexOf(current);
        const next = speeds[(idx + 1) % speeds.length];
        player.setSpeed(next);
    }
</script>

<button
    class="speed-btn"
    onclick={cycleSpeed}
    aria-label="Playback speed: {$player.playbackRate}x"
>
    <span class="value">{$player.playbackRate}x</span>
</button>

<style>
    .speed-btn {
        background: transparent;
        border: 1px solid var(--border-subtle);
        color: var(--text-base);
        cursor: pointer;
        height: 36px;
        min-width: 54px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        font-weight: 500;
        transition:
            background-color var(--transition-base),
            color var(--transition-base),
            border-color var(--transition-base);
    }

    .speed-btn:hover {
        background-color: var(--surface-2);
        border-color: var(--border-strong);
    }

    .speed-btn:active {
        transform: scale(0.95);
    }
</style>
