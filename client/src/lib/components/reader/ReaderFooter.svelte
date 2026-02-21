<script lang="ts">
    let { fraction }: { fraction: number } = $props();

    // fraction is between 0 and 1
    let percent = $derived(Math.round(fraction * 100));
</script>

<div class="reader-footer">
    <div class="progress-info">
        <span>{percent}%</span>
    </div>
</div>

<style>
    .reader-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: env(safe-area-inset-bottom);
        z-index: 40;
        pointer-events: none; /* Let clicks pass through to footer */
    }

    .progress-info {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--text-muted);
        background: color-mix(in srgb, var(--surface-0) 80%, transparent);
        padding: 2px 8px;
        border-radius: var(--radius-full);
        pointer-events: none;
    }
</style>
