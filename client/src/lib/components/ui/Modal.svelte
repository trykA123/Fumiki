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
    class={`p-0 bg-transparent border-none max-w-[480px] w-full m-auto backdrop:bg-black/50 backdrop:z-[var(--z-modal)] ${className}`}
    onclose={closeDialog}
    onclick={handleBackdropClick}
>
    <div
        class="bg-surface-1 border border-border-medium rounded-lg p-7 shadow-[0_16px_48px_var(--shadow-color)] relative root-sumi:rounded-none root-kami:shadow-[0_20px_60px_var(--shadow-color)] root-kami:bg-transparent root-mori:border-none root-mori:shadow-[0_16px_48px_var(--shadow-color),0_0_0_1px_var(--shadow-color)]"
        onclick={(e) => e.stopPropagation()}
        role="document"
    >
        <!-- Kami noise texture -->
        <div
            class="absolute inset-0 pointer-events-none rounded-inherit z-[-1] hidden root-kami:block bg-surface-1"
            style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E&quot;);"
        ></div>

        {#if title}
            <h2
                class="font-display text-[var(--heading-card-size)] font-[var(--heading-card-weight)] mb-4 text-text-primary"
            >
                {title}
            </h2>
        {/if}

        <div class="mb-6 text-text-secondary leading-[1.6] last:mb-0">
            {@render children()}
        </div>

        {#if actions}
            <div class="flex gap-3 justify-end relative z-10">
                {@render actions()}
            </div>
        {/if}
    </div>
</dialog>
