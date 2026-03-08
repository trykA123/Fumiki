<script lang="ts">
    let {
        value = 0,
        max = 100,
        size = "md",
        intent = "accent",
        class: className = "",
    }: {
        value?: number;
        max?: number;
        size?: "xs" | "sm" | "md" | "lg";
        intent?: "accent" | "success";
        class?: string;
    } = $props();

    const percentage = $derived(
        Math.min(Math.max((value / max) * 100, 0), 100),
    );

    const sizeClasses = {
        xs: "h-[2px]",
        sm: "h-[3px]",
        md: "h-[5px]",
        lg: "h-[8px]",
    };

    const intentClasses = {
        accent: "bg-accent root-mori:shadow-[0_0_8px_var(--accent-glow)]",
        success: "bg-success root-mori:shadow-[0_0_8px_var(--success)]",
    };
</script>

<div
    class={`bg-surface-3 rounded-full overflow-hidden w-full root-sumi:rounded-none ${sizeClasses[size] || sizeClasses.md} ${className}`}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin="0"
    aria-valuemax={max}
>
    <div
        class={`h-full rounded-inherit transition-[width] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] root-sumi:rounded-none ${intentClasses[intent]}`}
        style="width: {percentage}%;"
    ></div>
</div>
