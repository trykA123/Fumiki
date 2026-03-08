<script lang="ts">
    import type { Snippet } from "svelte";

    type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";
    type ButtonSize = "sm" | "md" | "lg";

    let {
        variant = "primary",
        size = "md",
        href,
        disabled = false,
        type = "button",
        class: className = "",
        children,
        onclick,
    }: {
        variant?: ButtonVariant;
        size?: ButtonSize;
        href?: string;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        class?: string;
        children: Snippet;
        onclick?: (e: MouseEvent) => void;
    } = $props();

    const isLink = $derived(!!href);
    const tag = $derived(isLink ? "a" : "button");

    const baseClass =
        "font-body font-semibold border-none inline-flex items-center justify-center gap-2 transition-all duration-200 ease-in-out rounded no-underline root-sumi:text-[11px] root-sumi:font-bold root-sumi:tracking-[0.12em] root-sumi:uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none";

    // Compute size classes
    const sizeClasses = {
        sm: "px-[14px] py-[7px] text-[12px] min-h-[32px]",
        md: "px-[22px] py-[10px] text-[13px] min-h-[40px]",
        lg: "px-[28px] py-[13px] text-[15px] min-h-[46px]",
    };

    const iconSizeClasses = {
        sm: "w-[32px] h-[32px] p-0 min-h-0",
        md: "w-[40px] h-[40px] p-0 min-h-0",
        lg: "w-[46px] h-[46px] p-0 min-h-0",
    };

    // Compute variant classes
    const variantClasses = {
        primary:
            "bg-accent text-text-inverse hover:not(:disabled):bg-accent-hover hover:not(:disabled):-translate-y-[1px] hover:not(:disabled):shadow-[0_4px_16px_var(--accent-glow-strong)] active:not(:disabled):translate-y-0",
        secondary:
            "bg-surface-3 text-text-primary hover:not(:disabled):bg-surface-4",
        ghost: "bg-transparent text-text-secondary border border-border-medium hover:not(:disabled):bg-surface-2 hover:not(:disabled):text-text-primary hover:not(:disabled):border-border-strong",
        danger: "bg-error text-white hover:not(:disabled):bg-[var(--error)]",
        icon: "bg-transparent text-text-secondary hover:not(:disabled):bg-surface-2 hover:not(:disabled):text-text-primary root-sumi:normal-case root-sumi:tracking-normal root-sumi:font-semibold root-sumi:text-[length:inherit]", // Reset sumi overrides for icons
    };

    const computedClass = $derived(
        `
        ${baseClass} 
        ${variant === "icon" ? iconSizeClasses[size] : sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${className}
    `
            .replace(/\s+/g, " ")
            .trim(),
    );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<svelte:element
    this={tag}
    {href}
    {type}
    {disabled}
    {onclick}
    class={computedClass}
>
    {@render children()}
</svelte:element>
