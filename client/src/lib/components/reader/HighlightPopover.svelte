<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import Icon from "$lib/components/Icon.svelte";

    let {
        visible = false,
        activeColor = null,
        onHighlight,
        onNote,
        onCopy,
        onDelete,
        onClose,
    }: {
        visible: boolean;
        activeColor?: string | null;
        onHighlight: (color: string) => void;
        onNote: () => void;
        onCopy: () => void;
        onDelete: () => void;
        onClose: () => void;
    } = $props();

    const colors = [
        { id: "yellow", hint: "bg-[#fef08a] dark:bg-[#ca8a04]/60" },
        { id: "blue", hint: "bg-[#bfdbfe] dark:bg-[#2563eb]/60" },
        { id: "green", hint: "bg-[#bbf7d0] dark:bg-[#16a34a]/60" },
        { id: "pink", hint: "bg-[#fbcfe8] dark:bg-[#db2777]/60" },
    ];

    function handleAction(e: Event, action: () => void) {
        e.preventDefault();
        e.stopPropagation();
        action();
    }
</script>

{#if visible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-[9900] pointer-events-none flex items-end justify-center pb-8 px-4"
    >
        <div
            class="pointer-events-auto bg-surface-1 rounded-full border border-border-subtle shadow-[0_8px_32px_var(--shadow-color)] flex items-center p-2 gap-2"
            in:fly={{ y: 20, duration: 200 }}
            out:fade={{ duration: 150 }}
            onclick={(e) => e.stopPropagation()}
        >
            <!-- Highlight Colors -->
            <div
                class="flex items-center gap-[6px] px-2 py-1 pr-4 border-r border-border-subtle"
            >
                {#each colors as color}
                    <button
                        class={`w-6 h-6 rounded-full cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 ${color.hint} ${activeColor === color.id ? "ring-2 ring-accent border-surface-0" : "border border-border-subtle"}`}
                        onclick={(e) =>
                            handleAction(e, () => onHighlight(color.id))}
                        type="button"
                        aria-label={`Highlight ${color.id}`}
                    ></button>
                {/each}
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-1 pl-1 pr-2">
                <button
                    class="flex items-center justify-center p-[8px] rounded-full bg-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors cursor-pointer"
                    onclick={(e) => handleAction(e, onNote)}
                    title="Add Note"
                >
                    <Icon name="edit" size={18} />
                </button>
                <button
                    class="flex items-center justify-center p-[8px] rounded-full bg-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors cursor-pointer"
                    onclick={(e) => handleAction(e, onCopy)}
                    title="Copy Text"
                >
                    <Icon name="device-floppy" size={18} />
                </button>

                {#if activeColor}
                    <button
                        class="flex items-center justify-center p-[8px] rounded-full bg-transparent text-ui-danger hover:bg-ui-danger/10 transition-colors cursor-pointer"
                        onclick={(e) => handleAction(e, onDelete)}
                        title="Remove Highlight"
                    >
                        <Icon name="trash" size={18} />
                    </button>
                {/if}

                <button
                    class="flex items-center justify-center p-[8px] rounded-full bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-primary transition-colors cursor-pointer ml-1"
                    onclick={(e) => handleAction(e, onClose)}
                    title="Close"
                >
                    <Icon name="x" size={18} />
                </button>
            </div>
        </div>
    </div>
{/if}
