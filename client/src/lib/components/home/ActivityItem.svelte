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

<div class="activity-item">
    <div class="kp-block">
        <span class="plus">+</span>
        <span class="points">{points}</span>
        <span class="label">KP</span>
    </div>

    <div class="meta-block">
        <span class="title">{title}</span>
        <span class="time">{timeAgo}</span>
    </div>
</div>

<style>
    .activity-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3);
        border-radius: var(--radius-md);
        background: var(--surface-1);
        transition: background-color var(--transition-base);
    }

    .activity-item:hover {
        background: var(--surface-2);
    }

    .kp-block {
        display: flex;
        align-items: baseline;
        gap: 1px;
        color: var(--accent);
        background: color-mix(in srgb, var(--accent) 10%, transparent);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        min-width: 60px;
        justify-content: center;
    }

    .plus {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 600;
    }

    .points {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        font-weight: 700;
        letter-spacing: -0.05em;
    }

    .label {
        font-size: 9px;
        font-weight: 700;
        margin-left: 2px;
    }

    .meta-block {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .title {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-base);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .time {
        font-size: var(--text-xs);
        color: var(--text-muted);
    }
</style>
