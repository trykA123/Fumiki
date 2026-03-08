<script lang="ts">
    let { fraction }: { fraction: number } = $props();

    // fraction is between 0 and 1
    let percent = $derived(Math.round(fraction * 100));
</script>

<div
    class="fixed bottom-0 inset-x-0 h-8 flex items-center justify-center pb-[env(safe-area-inset-bottom)] z-40 pointer-events-none"
>
    <div
        class="font-mono text-xs text-text-muted bg-[color-mix(in_srgb,var(--surface-0)_80%,transparent)] px-2 py-[2px] rounded-full pointer-events-none"
    >
        <span>{percent}%</span>
    </div>
</div>
