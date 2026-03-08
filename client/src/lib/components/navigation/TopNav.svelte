<script lang="ts">
    import { page } from "$app/state";

    const items = [
        { name: "Home", href: "/" },
        { name: "Library", href: "/library" },
        { name: "Bonsai", href: "/bonsai" },
        { name: "Notes", href: "/notes" },
    ];
</script>

<nav
    class="fixed top-0 left-0 right-0 h-[56px] bg-surface-1/80 border-b border-border-subtle flex items-center justify-between px-7 pt-[env(safe-area-inset-top)] z-[var(--z-sticky,40)] backdrop-blur-md"
>
    <div
        class="flex items-baseline gap-2 font-display font-bold text-[var(--heading-card-size)] text-text-primary"
    >
        <span>Fumiki</span>
        <span class="text-accent font-normal">文木</span>
    </div>

    <div class="flex gap-6">
        {#each items as item}
            <a
                href={item.href}
                class={`text-[13px] no-underline font-semibold tracking-widest uppercase transition-colors duration-150 relative py-2 ${
                    page.url.pathname === item.href
                        ? 'text-text-primary after:content-[""] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-[2px] after:bg-accent'
                        : "text-text-muted hover:text-text-primary"
                }`}
            >
                {item.name}
            </a>
        {/each}
    </div>

    <div class="flex items-center">
        <a
            href="/settings"
            class="text-text-muted transition-colors duration-150 flex items-center justify-center hover:text-text-primary"
            aria-label="Settings"
        >
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
