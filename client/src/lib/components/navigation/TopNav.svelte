<script lang="ts">
    import { page } from "$app/state";

    const items = [
        { name: "Home", href: "/" },
        { name: "Library", href: "/library" },
        { name: "Bonsai", href: "/bonsai" },
        { name: "Notes", href: "/notes" },
    ];
</script>

<nav class="top-nav">
    <div class="logo">
        <span>Fumiki</span>
        <span class="logo-kanji">文木</span>
    </div>

    <div class="nav-links">
        {#each items as item}
            <a
                href={item.href}
                class="nav-link"
                class:active={page.url.pathname === item.href}
            >
                {item.name}
            </a>
        {/each}
    </div>

    <div class="actions">
        <a href="/settings" class="settings-link" aria-label="Settings">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path
                    d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                />
                <circle cx="12" cy="12" r="3" />
            </svg>
        </a>
    </div>
</nav>

<style>
    .top-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 56px;
        background: var(--surface-1);
        border-bottom: 1px solid var(--border-subtle);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--space-7);
        padding-top: env(safe-area-inset-top);
        z-index: var(--z-sticky);
        backdrop-filter: blur(12px);
    }

    .logo {
        display: flex;
        align-items: baseline;
        gap: var(--space-2);
        font-family: var(--font-display);
        font-weight: 700;
        font-size: var(--heading-card-size);
        color: var(--text-primary);
    }

    .logo-kanji {
        color: var(--accent);
        font-weight: 400;
    }

    .nav-links {
        display: flex;
        gap: var(--space-6);
    }

    .nav-link {
        color: var(--text-muted);
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        transition: color 150ms;
        position: relative;
        padding: var(--space-2) 0;
    }

    .nav-link:hover {
        color: var(--text-primary);
    }

    .nav-link.active {
        color: var(--text-primary);
    }

    /* Sumi line under active link */
    .nav-link.active::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--accent);
    }

    .actions {
        display: flex;
        align-items: center;
    }

    .settings-link {
        color: var(--text-muted);
        transition: color 150ms;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .settings-link:hover {
        color: var(--text-primary);
    }
</style>
