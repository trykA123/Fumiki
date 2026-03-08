<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        variant = "default",
        class: className = "",
        children,
    }: {
        variant?: "default" | "accent" | "success";
        class?: string;
        children: Snippet;
    } = $props();
    const baseClass =
        "inline-flex items-center px-[12px] py-[5px] font-body text-[var(--text-xs)] font-semibold tracking-[0.02em] rounded-full leading-none root-sumi:rounded-[2px]";

    const variantClasses = {
        default: "bg-surface-2 text-text-secondary border border-border-subtle",
        accent: "bg-accent text-text-inverse",
        success: "bg-success text-text-inverse",
    };

    const computedClass = $derived(
        `
        ${baseClass}
        ${variantClasses[variant]}
        ${className}
    `
            .replace(/\s+/g, " ")
            .trim(),
    );
</script>

<span class={computedClass}>
    {@render children()}
</span>
