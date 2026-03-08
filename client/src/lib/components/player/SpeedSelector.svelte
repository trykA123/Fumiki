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
    class="bg-transparent border border-border-subtle text-text-base cursor-pointer h-9 min-w-[54px] rounded-md flex items-center justify-center font-mono text-sm font-medium transition-all duration-200 hover:bg-surface-2 hover:border-border-strong active:scale-95"
    onclick={cycleSpeed}
    aria-label="Playback speed: {$player.playbackRate}x"
>
    <span>{$player.playbackRate}x</span>
</button>
