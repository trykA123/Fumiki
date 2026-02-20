<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        message,
        icon,
        class: className = "",
        action,
    }: {
        title: string;
        message?: string;
        icon?: string;
        class?: string;
        action?: Snippet;
    } = $props();
</script>

<div class="empty-state {className}">
    {#if icon}
        <div class="empty-icon {icon}"></div>
    {/if}
    <h3 class="empty-title">{title}</h3>
    {#if message}
        <p class="empty-message">{message}</p>
    {/if}
    {#if action}
        <div class="empty-action">
            {@render action()}
        </div>
    {/if}
</div>

<style>
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--space-8) var(--space-4);
        background: var(--surface-1);
        border: 1px dashed var(--border-medium);
        border-radius: var(--radius-lg);
    }

    /* Kami paper theme dashed override */
    :global([data-theme="kami"]) .empty-state {
        background: transparent;
    }

    /* Mori subtle gap override */
    :global([data-theme="mori"]) .empty-state {
        border-style: solid;
        border-color: var(--surface-2);
    }

    .empty-icon {
        font-size: 32px;
        color: var(--text-muted);
        margin-bottom: var(--space-3);
    }

    .empty-title {
        font-size: var(--heading-card-size);
        font-weight: var(--heading-card-weight);
        color: var(--text-primary);
        margin-bottom: var(--space-2);
    }

    .empty-message {
        color: var(--text-secondary);
        font-size: var(--body-size);
        max-width: 400px;
        margin-bottom: var(--space-4);
    }

    .empty-action {
        display: flex;
        justify-content: center;
    }
</style>
