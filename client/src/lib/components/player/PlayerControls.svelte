<script lang="ts">
    import { player } from "$lib/stores/player";
    import Icon from "$lib/components/Icon.svelte";
</script>

<div class="controls-container">
    <button
        class="icon-btn"
        onclick={() => player.skipBackward()}
        aria-label="Skip Backward 30s"
    >
        <Icon name="skip-back" size={32} />
    </button>
    <button
        class="play-btn"
        onclick={() => ($player.isPlaying ? player.pause() : player.play())}
        aria-label={$player.isPlaying ? "Pause" : "Play"}
    >
        <Icon name={$player.isPlaying ? "pause" : "play"} size={48} />
    </button>
    <button
        class="icon-btn"
        onclick={() => player.skipForward()}
        aria-label="Skip Forward 30s"
    >
        <Icon name="skip-forward" size={32} />
    </button>
</div>

<style>
    .controls-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-8);
        padding: var(--space-4) 0;
    }

    .icon-btn {
        background: transparent;
        border: none;
        color: var(--text-base);
        cursor: pointer;
        padding: var(--space-2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--transition-base),
            color var(--transition-base);
    }

    .icon-btn:hover {
        background-color: var(--surface-2);
        color: var(--accent);
    }

    .play-btn {
        background: var(--surface-2);
        border: none;
        color: var(--accent);
        cursor: pointer;
        padding: var(--space-4);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px var(--shadow-color);
        transition:
            transform var(--transition-base),
            box-shadow var(--transition-base),
            background-color var(--transition-base);
    }

    .play-btn:hover {
        transform: scale(1.05);
        background-color: var(--surface-3);
    }

    .play-btn:active {
        transform: scale(0.95);
    }

    :global([data-theme="kami"]) .play-btn {
        box-shadow: 4px 4px 12px var(--shadow-color);
        border: 1px solid var(--border-subtle);
    }
</style>
