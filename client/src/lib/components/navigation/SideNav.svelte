<script lang="ts">
    import { page } from "$app/state";
    import Icon from "./Icon.svelte";

    const items = [
        { name: "Home", href: "/", icon: "home" as const, label: "Dashboard" },
        {
            name: "Library",
            href: "/library",
            icon: "library" as const,
            label: "Collection",
        },
        {
            name: "Bonsai",
            href: "/bonsai",
            icon: "bonsai" as const,
            label: "Growth",
        },
        {
            name: "Notes",
            href: "/notes",
            icon: "notes" as const,
            label: "Reflections",
        },
        {
            name: "Settings",
            href: "/settings",
            icon: "settings" as const,
            label: "Preferences",
        },
    ];
</script>

<aside class="side-nav">
    <div class="header">
        <div class="logo">
            <span>Fumiki</span>
            <span class="logo-kanji">文木</span>
        </div>
        <div class="subtitle">A tree that grows from literature.</div>
    </div>

    <nav class="nav-links">
        {#each items as item}
            <a
                href={item.href}
                class="nav-link"
                class:active={page.url.pathname === item.href}
            >
                <div class="nav-icon-container">
                    <Icon name={item.icon} size={18} />
                </div>
                <div class="nav-text">
                    <div class="nav-name">{item.name}</div>
                    <div class="nav-label">{item.label}</div>
                </div>
            </a>
        {/each}
    </nav>

    <div class="footer">
        <div class="divider"></div>
    </div>
</aside>

<style>
    .side-nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 260px;
        height: 100vh;
        background: var(--surface-1);
        border-right: 1px solid var(--border-subtle);
        padding: var(--space-6) 0;
        display: flex;
        flex-direction: column;
        z-index: var(--z-sticky);
        overflow-y: auto;
        padding-top: calc(env(safe-area-inset-top) + var(--space-6));
        padding-bottom: env(safe-area-inset-bottom);
    }

    .header {
        padding: 0 var(--space-6) var(--space-6);
        margin-bottom: var(--space-4);
    }

    .logo {
        display: flex;
        align-items: baseline;
        gap: var(--space-2);
        font-family: var(--font-display);
        font-weight: 700;
        font-size: var(--heading-section-size);
        color: var(--text-primary);
    }

    .logo-kanji {
        color: var(--accent);
        font-weight: 400;
    }

    .subtitle {
        margin-top: var(--space-2);
        font-size: var(--body-sm-size);
        color: var(--text-muted);
        font-style: italic;
    }

    .nav-links {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: 0 var(--space-4);
        flex: 1;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3);
        border-radius: var(--radius);
        color: var(--text-secondary);
        text-decoration: none;
        transition: all 150ms;
    }

    .nav-link:hover {
        background: var(--surface-2);
        color: var(--text-primary);
    }

    .nav-link.active {
        background: var(--surface-2);
        color: var(--text-primary);
    }

    .nav-icon-container {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--surface-0);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border-subtle);
        color: var(--text-muted);
    }

    .nav-link.active .nav-icon-container {
        border-color: var(--accent);
        color: var(--accent);
        background: var(--surface-1);
        box-shadow: 0 2px 8px var(--shadow-color);
    }

    .nav-text {
        display: flex;
        flex-direction: column;
    }

    .nav-name {
        font-weight: 600;
        font-size: var(--body-size);
    }

    .nav-label {
        font-size: var(--text-xs);
        color: var(--text-muted);
        margin-top: 2px;
    }

    .footer {
        padding: var(--space-6);
        margin-top: auto;
    }

    .divider {
        height: 1px;
        background: var(--border-subtle);
        width: 100%;
    }

    /* Kami specific - warm highlight active state */
    :global([data-theme="kami"]) .nav-link.active {
        background: var(--surface-0);
        border: 1px solid var(--border-subtle);
        box-shadow: inset 0 2px 4px var(--shadow-color);
    }
</style>
