<script lang="ts">
    import { createEventDispatcher } from "svelte";

    let {
        options = [
            { id: "all", label: "All" },
            { id: "ebook", label: "Ebooks" },
            { id: "audiobook", label: "Audiobooks" },
        ],
        value = $bindable("all"),
        class: className = "",
        onchange,
    }: {
        options?: { id: string; label: string }[];
        value?: string;
        class?: string;
        onchange?: (id: string) => void;
    } = $props();

    function select(id: string) {
        value = id;
        if (onchange) onchange(id);
    }
</script>

<div
    class={`flex gap-2 overflow-x-auto pb-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
>
    {#each options as option}
        <button
            type="button"
            class={`bg-surface-1 text-text-secondary border border-border-subtle rounded-full px-4 py-[6px] font-body text-sm whitespace-nowrap cursor-pointer transition-all duration-200 root-sumi:rounded-[4px] root-sumi:uppercase root-sumi:tracking-[0.05em] root-sumi:text-[11px] root-sumi:font-semibold ${
                value === option.id
                    ? "bg-surface-0 !text-text-base !border-accent-border font-medium shadow-[0_2px_8px_var(--shadow-color)]"
                    : "hover:bg-surface-2 hover:text-text-primary hover:border-border-medium"
            }`}
            onclick={() => select(option.id)}
        >
            {option.label}
        </button>
    {/each}
</div>
