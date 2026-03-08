<script lang="ts">
    import { player } from "$lib/stores/player";

    // Format seconds to H:mm:ss or mm:ss
    function formatTime(seconds: number): string {
        if (!seconds || isNaN(seconds)) return "0:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        }
        return `${m}:${s.toString().padStart(2, "0")}`;
    }

    function handleSeek(e: Event) {
        const target = e.target as HTMLInputElement;
        player.seek(parseFloat(target.value));
    }

    const sliderClass =
        `appearance-none w-full h-[6px] bg-surface-2 rounded-full outline-none m-0 z-10 absolute ` +
        `[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full ` +
        `[&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface-0 ` +
        `[&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-100 ` +
        `active:[&::-webkit-slider-thumb]:scale-120 ` +
        `[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent ` +
        `[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface-0 ` +
        `[&::-moz-range-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-100 ` +
        `active:[&::-moz-range-thumb]:scale-120 ` +
        `[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent`;
</script>

<div class="w-full flex flex-col gap-2 py-4">
    <div class="flex justify-between items-center px-1">
        <span class="font-mono text-xs text-text-base"
            >{$player.currentTime
                ? formatTime($player.currentTime)
                : "0:00"}</span
        >
        <span class="font-mono text-xs text-text-muted"
            >-{formatTime(
                ($player.duration || 0) - ($player.currentTime || 0),
            )}</span
        >
    </div>

    <div class="relative h-[24px] flex items-center w-full">
        <input
            type="range"
            min="0"
            step="0.1"
            max={$player.duration || 100}
            value={$player.currentTime || 0}
            oninput={handleSeek}
            class={sliderClass}
            aria-label="Seek time"
        />
        <!-- Custom progress fill overlay -->
        <div
            class="absolute left-0 h-[6px] bg-accent rounded-full pointer-events-none z-[1]"
            style="width: {$player.duration
                ? ($player.currentTime / $player.duration) * 100
                : 0}%"
        ></div>
    </div>
</div>
