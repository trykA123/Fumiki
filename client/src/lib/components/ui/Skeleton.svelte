<script lang="ts">
    let {
        variant = "text",
        class: className = "",
        style = "",
    }: {
        variant?: "text" | "card" | "cover" | "row";
        class?: string;
        style?: string;
    } = $props();
    const baseClass = "bg-surface-3 animate-pulse motion-reduce:animate-none";

    const variantClasses = {
        text: "h-[1em] rounded-[4px] w-full",
        card: "h-[200px] rounded-lg w-full",
        cover: "aspect-[2/3] rounded w-full",
        row: "h-[40px] rounded w-full",
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

<div class={computedClass} {style}></div>
