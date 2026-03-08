<script lang="ts">
    let {
        title,
        points,
        timeAgo,
    }: {
        title: string;
        points: number;
        timeAgo: string;
    } = $props();
</script>

<div
    class="flex items-center gap-4 p-3 rounded-md bg-surface-1 transition-colors duration-200 hover:bg-surface-2"
>
    <div
        class="flex items-baseline gap-[1px] text-accent bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] py-1 px-2 rounded-sm min-w-[60px] justify-center"
    >
        <span class="font-mono text-xs font-semibold">+</span>
        <span class="font-mono text-sm font-bold tracking-tight">{points}</span>
        <span class="text-[9px] font-bold ml-[2px]">KP</span>
    </div>

    <div class="flex flex-col flex-1 overflow-hidden">
        <span
            class="text-sm font-medium text-text-base whitespace-nowrap overflow-hidden text-ellipsis"
            >{title}</span
        >
        <span class="text-xs text-text-muted">{timeAgo}</span>
    </div>
</div>
