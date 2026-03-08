<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        intent = "muted",
        class: className = "",
        children,
    }: {
        intent?: "accent" | "success" | "info" | "muted";
        class?: string;
        children: Snippet;
    } = $props();
    const baseClass =
        "inline-flex items-center px-[12px] py-[5px] text-[var(--text-xs)] font-semibold tracking-[0.02em] rounded-full root-sumi:rounded-[2px]";

    const intentClasses = {
        accent: "bg-accent-glow-strong text-[var(--accent-text,#fff)] border border-accent-border",
        success:
            "bg-[hsl(155_45%_42%/0.12)] text-success border border-[hsl(155_45%_42%/0.2)]",
        info: "bg-[hsl(210_100%_50%/0.12)] text-[var(--info,hsl(210_100%_50%))] border border-[hsl(210_100%_50%/0.2)]",
        muted: "bg-surface-3 text-text-secondary border border-border-subtle",
    };

    const computedClass = $derived(
        `
        ${baseClass}
        ${intentClasses[intent]}
        ${className}
    `
            .replace(/\s+/g, " ")
            .trim(),
    );
</script>

<span class={computedClass}>
    {@render children()}
</span>
