<script lang="ts">
    import { player } from "$lib/stores/player";
    import Icon from "$lib/components/Icon.svelte";
    import { slide } from "svelte/transition";
    import { goto } from "$app/navigation";
</script>

{#if $player.activeBook}
    <div class="mini-player" transition:slide={{ duration: 300, axis: "y" }}>
        <!-- Click background to go to full player -->
        <button
            class="content"
            onclick={() => goto(`/player/${$player.activeBook?.id}`)}
            aria-label="Open full player"
        >
            <img
                src={`/api/abs/items/${$player.activeBook.id}/cover`}
                alt="Cover"
                class="cover"
            />
            <div class="info">
                <span class="title">{$player.activeBook.title}</span>
                <span class="author">{$player.activeBook.author}</span>
            </div>
        </button>

        <div class="actions">
            <button
                class="action-btn"
                onclick={() =>
                    $player.isPlaying ? player.pause() : player.play()}
                aria-label={$player.isPlaying ? "Pause" : "Play"}
            >
                <Icon name={$player.isPlaying ? "pause" : "play"} size={24} />
            </button>
            <button
                class="action-btn close-btn"
                onclick={() => player.closePlayer()}
                aria-label="Close player"
            >
                <Icon name="x" size={24} />
            </button>
        </div>

        <!-- Tiny progress bar at Absolute bottom -->
        <div class="mini-progress">
            <div
                class="fill"
                style="width: {$player.duration
                    ? ($player.currentTime / $player.duration) * 100
                    : 0}%"
            ></div>
        </div>
    </div>
{/if}

<style>
    .mini-player {
        position: fixed;
        bottom: 64px; /* Default bottom nav height */
        left: 0;
        right: 0;
        height: 64px;
        background: var(--surface-1);
        border-top: 1px solid var(--border-subtle);
        border-bottom: 1px solid var(--border-subtle);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--space-4) 0 0;
        z-index: 40; /* Just below bottom nav (50) */
        box-shadow: 0 -4px 12px var(--shadow-color);
    }

    /* Adjust for tablet side-nav */
    @media (min-width: 768px) {
        .mini-player {
            bottom: 0;
            left: 240px; /* Side nav width */
            border-bottom: none;
        }
    }

    .content {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        background: transparent;
        border: none;
        padding: 0;
        height: 100%;
        flex: 1;
        cursor: pointer;
        text-align: left;
    }

    .cover {
        height: 100%;
        width: 48px;
        object-fit: cover;
    }

    .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
    }

    .title {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-base);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
        margin-bottom: 2px;
    }

    .author {
        font-size: var(--text-xs);
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: var(--space-2);
    }

    .action-btn {
        background: transparent;
        border: none;
        color: var(--text-base);
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color var(--transition-base);
    }

    .action-btn:hover {
        background-color: var(--surface-2);
    }

    .close-btn {
        color: var(--text-muted);
    }

    .mini-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: transparent;
    }

    .mini-progress .fill {
        height: 100%;
        background: var(--accent);
        transition: width 0.2s linear;
    }

    :global([data-theme="mori"]) .mini-player {
        background: color-mix(in srgb, var(--surface-1) 95%, var(--accent));
    }
</style>
