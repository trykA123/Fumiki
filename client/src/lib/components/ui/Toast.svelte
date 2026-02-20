<script lang="ts">
    import { onMount } from "svelte";

    let {
        intent = "info",
        message,
        duration = 4000,
        onclose,
        class: className = "",
    }: {
        intent?: "info" | "success" | "error" | "warning";
        message: string;
        duration?: number;
        onclose?: () => void;
        class?: string;
    } = $props();

    let visible = $state(true);

    onMount(() => {
        if (duration > 0) {
            setTimeout(() => {
                visible = false;
                setTimeout(() => {
                    if (onclose) onclose();
                }, 300);
            }, duration);
        }
    });

    function dismiss() {
        visible = false;
        setTimeout(() => {
            if (onclose) onclose();
        }, 300);
    }
</script>

{#if visible}
    <div class="toast toast-{intent} {className}" role="alert">
        <span>{message}</span>
        <button onclick={dismiss} class="close-btn" aria-label="Close message"
            >×</button
        >
    </div>
{/if}

<style>
    .toast {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-5);
        background: var(--surface-2);
        border: 1px solid var(--border-medium);
        border-radius: var(--radius);
        box-shadow: 0 8px 24px var(--shadow-color);
        font-size: var(--body-sm-size);
        color: var(--text-primary);
        max-width: 380px;
        animation: slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .toast-success {
        border-left: 3px solid var(--success);
    }
    .toast-error {
        border-left: 3px solid var(--error);
    }
    .toast-warning {
        border-left: 3px solid var(--warning);
    }
    .toast-info {
        border-left: 3px solid var(--info, #3b82f6);
    }

    .close-btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 16px;
        cursor: pointer;
        line-height: 1;
        padding: 0;
    }
    .close-btn:hover {
        color: var(--text-primary);
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
