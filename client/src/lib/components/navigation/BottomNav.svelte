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

<nav
    class="fixed bottom-0 left-0 right-0 h-[56px] bg-surface-1 border-t border-border-subtle flex items-center justify-around pb-[env(safe-area-inset-bottom)] z-[var(--z-sticky,40)] root-mori:border-t-0 root-mori:shadow-[0_-4px_16px_var(--shadow-color)]"
>
    {#each items as item}
        <a
            href={item.href}
            class={`flex flex-col items-center gap-[2px] px-3 py-[6px] text-[10px] font-semibold no-underline transition-colors duration-150 ${
                page.url.pathname === item.href
                    ? "text-accent"
                    : "text-text-muted"
            }`}
        >
            <Icon name={item.icon} class="text-[20px]" />
            <span>{item.name}</span>
        </a>
    {/each}
</nav>
