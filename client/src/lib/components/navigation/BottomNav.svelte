<script lang="ts">
    import { page } from "$app/state";
    import Icon from "./Icon.svelte";

    const items = [
        { name: "Home", href: "/", icon: "home" as const },
        { name: "Library", href: "/library", icon: "library" as const },
        { name: "Bonsai", href: "/bonsai", icon: "bonsai" as const },
        { name: "Notes", href: "/notes", icon: "notes" as const },
        { name: "Settings", href: "/settings", icon: "settings" as const },
    ];
</script>

<nav class="bottom-nav">
    {#each items as item}
        <a
            href={item.href}
            class="bottom-nav-item"
            class:active={page.url.pathname === item.href}
        >
            <Icon name={item.icon} class="bottom-nav-icon" />
            <span>{item.name}</span>
        </a>
    {/each}
</nav>

<style>
    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 56px;
        background: var(--surface-1);
        border-top: 1px solid var(--border-subtle);
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding-bottom: env(safe-area-inset-bottom);
        z-index: var(--z-sticky);
    }

    .bottom-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 6px 12px;
        color: var(--text-muted);
        font-size: 10px;
        font-weight: 600;
        text-decoration: none;
        transition: color 150ms;
    }

    .bottom-nav-item.active {
        color: var(--accent);
    }

    :global(.bottom-nav-icon) {
        font-size: 20px;
    }

    /* Mori: No hard top border, use soft shadow */
    :global([data-theme="mori"]) .bottom-nav {
        border-top: none;
        box-shadow: 0 -4px 16px var(--shadow-color);
    }
</style>
