<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";

    let {
        title,
        icon,
        actionText,
        onAction,
    }: {
        title: string;
        icon?: "library" | "play" | "settings" | "search" | "x" | "list" | null;
        actionText?: string;
        onAction?: () => void;
    } = $props();
</script>

<div class="section-header">
    <div class="title-wrap">
        {#if icon}
            <span class="icon-span"><Icon name={icon} size={18} /></span>
        {/if}
        <h2>{title}</h2>
    </div>

    {#if actionText && onAction}
        <button class="action-btn" onclick={onAction}>
            {actionText}
        </button>
    {/if}
</div>

<style>
    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-4);
        border-bottom: 2px solid var(--surface-2);
        padding-bottom: var(--space-2);
    }

    .title-wrap {
        display: flex;
        align-items: center;
        gap: var(--space-2);
    }

    .icon-span {
        color: var(--accent);
        display: flex;
        align-items: center;
    }

    h2 {
        font-size: var(--text-sm);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        margin: 0;
    }

    .action-btn {
        background: transparent;
        border: none;
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--accent);
        cursor: pointer;
        padding: 0;
    }

    .action-btn:hover {
        text-decoration: underline;
    }
</style>
