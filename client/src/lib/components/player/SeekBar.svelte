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
</script>

<div class="seek-container">
    <div class="time-labels">
        <span class="time"
            >{$player.currentTime
                ? formatTime($player.currentTime)
                : "0:00"}</span
        >
        <span class="time remaining"
            >-{formatTime(
                ($player.duration || 0) - ($player.currentTime || 0),
            )}</span
        >
    </div>

    <div class="slider-wrapper">
        <input
            type="range"
            min="0"
            step="0.1"
            max={$player.duration || 100}
            value={$player.currentTime || 0}
            oninput={handleSeek}
            class="seek-bar"
            aria-label="Seek time"
        />
        <!-- Custom progress fill overlay -->
        <div
            class="progress-fill"
            style="width: {$player.duration
                ? ($player.currentTime / $player.duration) * 100
                : 0}%"
        ></div>
    </div>
</div>

<style>
    .seek-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: var(--space-4) 0;
    }

    .time-labels {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 var(--space-1);
    }

    .time {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--text-base);
    }

    .time.remaining {
        color: var(--text-muted);
    }

    .slider-wrapper {
        position: relative;
        height: 24px;
        display: flex;
        align-items: center;
        width: 100%;
    }

    .seek-bar {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 6px;
        background: var(--surface-2);
        border-radius: var(--radius-full);
        outline: none;
        margin: 0;
        z-index: 2;
        position: absolute;
    }

    /* We make the thumb visible and track transparent */
    .seek-bar::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--accent);
        cursor: pointer;
        border: 2px solid var(--surface-0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: transform 0.1s;
    }

    .seek-bar::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--accent);
        cursor: pointer;
        border: 2px solid var(--surface-0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: transform 0.1s;
    }

    .seek-bar:active::-webkit-slider-thumb {
        transform: scale(1.2);
    }

    .seek-bar:active::-moz-range-thumb {
        transform: scale(1.2);
    }

    /* Transparent track so custom fill shows underneath */
    .seek-bar::-webkit-slider-runnable-track {
        background: transparent;
    }
    .seek-bar::-moz-range-track {
        background: transparent;
    }

    .progress-fill {
        position: absolute;
        left: 0;
        height: 6px;
        background: var(--accent);
        border-radius: var(--radius-full);
        pointer-events: none;
        z-index: 1;
    }
</style>
