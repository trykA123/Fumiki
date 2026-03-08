<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { onMount } from "svelte";

    let {
        visible = false,
        initialContent = "",
        onSave,
        onClose,
    }: {
        visible: boolean;
        initialContent?: string;
        onSave: (content: string) => void;
        onClose: () => void;
    } = $props();

    let content = $state("");
    let textareaEl: HTMLTextAreaElement | undefined = $state();

    // Reset content when modal opens
    $effect(() => {
        if (visible) {
            content = initialContent || "";
            // Small delay to let DOM render before focus
            setTimeout(() => textareaEl?.focus(), 50);
        }
    });

    function handleSave() {
        onSave(content.trim());
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") onClose();
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSave();
        }
    }
</script>

{#if visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
        in:fade={{ duration: 150 }}
        out:fade={{ duration: 150 }}
        onclick={onClose}
    >
        <div
            class="bg-surface-0 w-full max-w-lg rounded-[12px] shadow-xl border border-border-subtle flex flex-col overflow-hidden"
            in:scale={{ start: 0.95, duration: 200, opacity: 0 }}
            onclick={(e) => e.stopPropagation()}
            onkeydown={handleKeyDown}
        >
            <div
                class="px-4 py-3 border-b border-border-subtle flex justify-between items-center bg-surface-1"
            >
                <h3 class="text-text-primary font-medium">Add Note</h3>
            </div>

            <div class="p-4">
                <textarea
                    bind:this={textareaEl}
                    bind:value={content}
                    class="w-full h-32 bg-transparent text-text-primary placeholder:text-text-muted outline-none resize-none border-none text-[15px] leading-relaxed"
                    placeholder="Write your thoughts here..."
                ></textarea>
            </div>

            <div
                class="px-4 py-3 bg-surface-1 border-t border-border-subtle flex justify-end gap-2"
            >
                <button
                    class="px-4 py-2 rounded-[6px] text-text-secondary hover:bg-surface-2 transition-colors font-medium text-sm cursor-pointer"
                    onclick={onClose}
                >
                    Cancel
                </button>
                <button
                    class="px-4 py-2 rounded-[6px] bg-accent text-surface-0 hover:brightness-110 active:brightness-95 transition-all font-medium text-sm cursor-pointer"
                    onclick={handleSave}
                >
                    Save Note
                </button>
            </div>
        </div>
    </div>
{/if}
