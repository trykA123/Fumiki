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

<div class="section-header {className}">
    <h2 class="section-title">{title}</h2>
    {#if href}
        <a {href} class="section-link">{linkText}</a>
    {/if}
</div>

<style>
    .section-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: var(--space-4);
    }

    .section-title {
        font-family: var(--font-display);
        font-size: var(--heading-section-size);
        font-weight: var(--heading-section-weight);
        letter-spacing: var(--heading-section-letter-spacing);
        color: var(--text-primary);
    }

    .section-link {
        font-size: var(--body-sm-size);
        color: var(--text-muted);
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        transition: color 150ms;
    }

    .section-link:hover {
        color: var(--accent);
    }

    /* Theme: Sumi - sharp horizontal line */
    :global([data-theme="sumi"]) .section-title::before {
        content: "";
        display: inline-block;
        width: 16px;
        height: 1px;
        background: var(--accent);
        margin-right: var(--space-3);
        vertical-align: middle;
        opacity: 0.5;
    }

    /* Theme: Kami - Em dash */
    :global([data-theme="kami"]) .section-title::before {
        content: "— ";
        color: var(--text-muted);
        font-weight: 300;
    }
</style>
