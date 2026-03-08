<script lang="ts">
    let {
        title,
        href,
        linkText = "See all",
        class: className = "",
    }: {
        title: string;
        href?: string;
        linkText?: string;
        class?: string;
    } = $props();
</script>

<div
    class={`flex items-baseline justify-between pb-2 border-b border-dashed border-border-medium ${className}`}
>
    <h2
        class="font-display text-[var(--heading-section-size)] font-[var(--heading-section-weight)] tracking-[var(--heading-section-letter-spacing)] text-text-primary root-sumi:before:content-[''] root-sumi:before:inline-block root-sumi:before:w-4 root-sumi:before:h-px root-sumi:before:bg-accent root-sumi:before:mr-3 root-sumi:before:align-middle root-sumi:before:opacity-50 root-kami:before:content-['—_'] root-kami:before:text-text-muted root-kami:before:font-light"
    >
        {title}
    </h2>
    {#if href}
        <a
            {href}
            class="text-[var(--body-sm-size)] text-text-muted no-underline font-medium cursor-pointer transition-colors duration-150 hover:text-accent"
            >{linkText}</a
        >
    {/if}
</div>
