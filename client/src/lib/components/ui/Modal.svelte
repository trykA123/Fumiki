<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        open = $bindable(false),
        title = "",
        onclose,
        class: className = "",
        children,
        actions,
    }: {
        open?: boolean;
        title?: string;
        onclose?: () => void;
        class?: string;
        children: Snippet;
        actions?: Snippet;
    } = $props();

    let dialog: HTMLDialogElement;

    $effect(() => {
        if (dialog) {
            if (open && !dialog.open) {
                dialog.showModal();
                document.body.style.overflow = "hidden";
            } else if (!open && dialog.open) {
                dialog.close();
                document.body.style.overflow = "";
            }
        }
    });

    function closeDialog() {
        open = false;
        if (onclose) onclose();
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === dialog) {
            closeDialog();
        }
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
    bind:this={dialog}
    class="modal {className}"
    onclose={closeDialog}
    onclick={handleBackdropClick}
>
    <div
        class="modal-content"
        onclick={(e) => e.stopPropagation()}
        role="document"
    >
        {#if title}
            <h2 class="modal-title">{title}</h2>
        {/if}

        <div class="modal-body">
            {@render children()}
        </div>

        {#if actions}
            <div class="modal-actions">
                {@render actions()}
            </div>
        {/if}
    </div>
</dialog>

<style>
    .modal {
        padding: 0;
        background: transparent;
        border: none;
        max-width: 480px;
        width: 100%;
        margin: auto;
    }

    .modal::backdrop {
        background: hsl(0 0% 0% / 0.5);
        z-index: var(--z-modal);
    }

    .modal-content {
        background: var(--surface-1);
        border: 1px solid var(--border-medium);
        border-radius: var(--radius-lg);
        padding: var(--space-7);
        box-shadow: 0 16px 48px var(--shadow-color);
    }

    .modal-title {
        font-family: var(--font-display);
        font-size: var(--heading-card-size);
        font-weight: var(--heading-card-weight);
        margin-bottom: var(--space-4);
        color: var(--text-primary);
    }

    .modal-body {
        margin-bottom: var(--space-6);
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .modal-body:last-child {
        margin-bottom: 0;
    }

    .modal-actions {
        display: flex;
        gap: var(--space-3);
        justify-content: flex-end;
    }

    /* Theme: Sumi Overrides */
    :global([data-theme="sumi"]) .modal-content {
        border-radius: 0;
    }

    /* Theme: Kami Overrides */
    :global([data-theme="kami"]) .modal-content {
        box-shadow: 0 20px 60px var(--shadow-color);
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    }

    /* Theme: Mori Overrides */
    :global([data-theme="mori"]) .modal-content {
        border: none;
        box-shadow:
            0 16px 48px var(--shadow-color),
            0 0 0 1px hsl(145 12% 40% / 0.04);
    }
</style>
