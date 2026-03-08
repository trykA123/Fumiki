<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        message,
        icon,
        class: className = "",
        action,
    }: {
        title: string;
        message?: string;
        icon?: string;
        class?: string;
        action?: Snippet;
    } = $props();
</script>

<div
    class={`flex flex-col items-center justify-center text-center py-8 px-4 bg-surface-1 border border-dashed border-border-medium rounded-lg root-kami:bg-transparent root-mori:border-solid root-mori:border-surface-2 ${className}`}
>
    {#if icon}
        <div class={`text-[32px] text-text-muted mb-3 ${icon}`}></div>
    {/if}
    <h3
        class="text-[var(--heading-card-size)] font-[var(--heading-card-weight)] text-text-primary mb-2"
    >
        {title}
    </h3>
    {#if message}
        <p
            class="text-text-secondary text-[var(--body-size)] max-w-[400px] mb-4"
        >
            {message}
        </p>
    {/if}
    {#if action}
        <div class="flex justify-center">
            {@render action()}
        </div>
    {/if}
</div>
