<script lang="ts">
    import { player } from "$lib/stores/player";
    import Icon from "$lib/components/Icon.svelte";
    import { slide } from "svelte/transition";
    import { goto } from "$app/navigation";
</script>

{#if $player.activeBook}
    <div
        class="fixed bottom-[64px] left-0 right-0 h-[64px] bg-surface-1 border-y border-border-subtle flex items-center justify-between pr-4 z-40 shadow-[0_-4px_12px_var(--shadow-color)] md:bottom-0 md:left-[240px] md:border-b-0"
        transition:slide={{ duration: 300, axis: "y" }}
    >
        <!-- Click background to go to full player -->
        <button
            class="flex items-center gap-3 bg-transparent border-none p-0 h-full flex-1 cursor-pointer text-left"
            onclick={() => goto(`/player/${$player.activeBook?.id}`)}
            aria-label="Open full player"
        >
            <img
                src={`/api/abs/items/${$player.activeBook.id}/cover`}
                alt="Cover"
                class="h-full w-[48px] object-cover"
            />
            <div class="flex flex-col justify-center overflow-hidden">
                <span
                    class="text-sm font-medium text-text-base whitespace-nowrap overflow-hidden text-ellipsis leading-[1.2] mb-[2px]"
                    >{$player.activeBook.title}</span
                >
                <span
                    class="text-xs text-text-muted whitespace-nowrap overflow-hidden text-ellipsis"
                    >{$player.activeBook.author}</span
                >
            </div>
        </button>

        <div class="flex items-center gap-2">
            <button
                class="bg-transparent border-none text-text-base cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-surface-2"
                onclick={() =>
                    $player.isPlaying ? player.pause() : player.play()}
                aria-label={$player.isPlaying ? "Pause" : "Play"}
            >
                <Icon name={$player.isPlaying ? "pause" : "play"} size={24} />
            </button>
            <button
                class="bg-transparent border-none text-text-muted cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-surface-2"
                onclick={() => player.closePlayer()}
                aria-label="Close player"
            >
                <Icon name="x" size={24} />
            </button>
        </div>

        <!-- Tiny progress bar at Absolute bottom -->
        <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent">
            <div
                class="h-full bg-accent transition-[width] duration-200"
                style="width: {$player.duration
                    ? ($player.currentTime / $player.duration) * 100
                    : 0}%"
            ></div>
        </div>
    </div>
{/if}
