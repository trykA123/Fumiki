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

<div class="floating-nav-wrapper">
    <nav class="floating-nav">
        {#each items as item}
            <a
                href={item.href}
                class="nav-item"
                class:active={page.url.pathname === item.href}
                aria-label={item.name}
            >
                <span class="icon-wrap">
                    <Icon name={item.icon} size={20} />
                </span>
                <span class="nav-text">{item.name}</span>
            </a>
        {/each}
    </nav>
</div>

<style>
    .floating-nav-wrapper {
        position: fixed;
        bottom: calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        z-index: var(--z-sticky);
        pointer-events: none;
    }

    .floating-nav {
        display: flex;
        align-items: center;
        padding: var(--space-2);
        background: var(--surface-1);
        border-radius: 100px; /* Pill shape */
        box-shadow:
            0 8px 32px var(--shadow-color),
            0 0 0 1px hsl(145 12% 40% / 0.04);
        pointer-events: auto;
        backdrop-filter: blur(12px);
    }

    /* Add subtle texture for Mori */
    :global([data-theme="mori"]) .floating-nav::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.2' numOctaves='3' seed='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23w)' opacity='0.015'/%3E%3C/svg%3E");
        z-index: 0;
    }

    .nav-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-2) var(--space-4);
        border-radius: 100px;
        color: var(--text-muted);
        text-decoration: none;
        transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 1;
    }

    .nav-item:hover {
        color: var(--text-primary);
    }

    .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
    }

    .nav-text {
        font-size: var(--body-sm-size);
        font-weight: 600;
        letter-spacing: 0.02em;
        max-width: 0;
        overflow: hidden;
        white-space: nowrap;
        opacity: 0;
        transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Active state expands to show text */
    .nav-item.active {
        background: var(--accent-glow);
        color: var(--accent-text);
        box-shadow:
            inset 0 1px 3px var(--shadow-color),
            0 0 0 1px var(--accent-border);
    }

    .nav-item.active .nav-text {
        max-width: 100px; /* Arbitrary large max-width for animation */
        opacity: 1;
        margin-left: -4px;
    }

    .nav-item.active .icon-wrap {
        color: var(--accent);
    }
</style>
