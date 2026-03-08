<script lang="ts">
    import type { Snippet } from "svelte";
    import { theme } from "$stores/theme";

    let {
        variant = "default",
        class: className = "",
        children,
        onclick,
    }: {
        variant?: "default" | "interactive" | "elevated" | "hero";
        class?: string;
        children: Snippet;
        onclick?: (e: MouseEvent) => void;
    } = $props();
    const baseClass =
        "bg-surface-1 border border-border-subtle rounded-lg p-[var(--card-padding)] shadow-[0_2px_8px_var(--shadow-color)] relative root-mori:border-none root-mori:shadow-[0_2px_12px_var(--shadow-color),0_0_0_1px_hsl(145_12%_40%/0.04)]";

    const variantClasses = {
        default: "",
        interactive:
            "cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-surface-2 hover:border-border-medium root-sumi:hover:border-l-2 root-sumi:hover:border-l-accent root-kami:hover:-translate-y-[2px] root-kami:hover:shadow-[0_6px_20px_var(--shadow-color)] root-mori:hover:scale-[1.01] root-mori:hover:shadow-[0_8px_24px_var(--shadow-color),0_0_0_1px_var(--accent-border)]",
        elevated:
            "shadow-[0_8px_32px_var(--shadow-color)] root-mori:shadow-[0_8px_32px_var(--shadow-color)]", // Force elevated box shadow to stay for mori
        hero: "relative overflow-hidden",
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={computedClass} {onclick}>
    <!-- Organic Mori texture inside the card layout -->
    <div
        class="absolute inset-0 pointer-events-none rounded-inherit mix-blend-overlay z-0 hidden root-mori:block"
        style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.2' numOctaves='3' seed='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23w)' opacity='0.015'/%3E%3C/svg%3E&quot;);"
    ></div>
    {#if variant === "hero" && $theme?.decorations?.heroTopOrnament}
        <div
            class="w-px h10 bg-gradient-to-b from-transparent to-accent mx-auto opacity-40"
        ></div>
    {/if}

    <div class="relative z-10">
        {@render children()}
    </div>

    {#if variant === "hero" && $theme?.decorations?.heroBottomOrnament}
        <div
            class="w-px h10 bg-gradient-to-b from-transparent to-accent mx-auto opacity-40"
        ></div>
    {/if}
</div>
