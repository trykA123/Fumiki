<script lang="ts">
    import { player } from "$lib/stores/player";
    import Icon from "$lib/components/Icon.svelte";
</script>

<div class="flex items-center justify-center gap-8 py-4">
    <button
        class="bg-transparent border-none text-text-base cursor-pointer p-2 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-surface-2 hover:text-accent"
        onclick={() => player.skipBackward()}
        aria-label="Skip Backward 30s"
    >
        <Icon name="skip-back" size={32} />
    </button>
    <button
        class="bg-surface-2 border-none text-accent cursor-pointer p-4 rounded-full flex items-center justify-center shadow-[0_4px_12px_var(--shadow-color)] transition-all duration-200 hover:scale-[1.05] hover:bg-surface-3 active:scale-[0.95] root-kami:shadow-[4px_4px_12px_var(--shadow-color)] root-kami:border-solid root-kami:border root-kami:border-border-subtle"
        onclick={() => ($player.isPlaying ? player.pause() : player.play())}
        aria-label={$player.isPlaying ? "Pause" : "Play"}
    >
        <Icon name={$player.isPlaying ? "pause" : "play"} size={48} />
    </button>
    <button
        class="bg-transparent border-none text-text-base cursor-pointer p-2 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-surface-2 hover:text-accent"
        onclick={() => player.skipForward()}
        aria-label="Skip Forward 30s"
    >
        <Icon name="skip-forward" size={32} />
    </button>
</div>
