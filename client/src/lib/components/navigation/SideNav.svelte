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

<aside
    class="fixed top-0 left-0 w-[260px] h-screen bg-surface-1 border-r border-border-subtle py-6 flex flex-col z-[var(--z-sticky,40)] overflow-y-auto pt-[calc(env(safe-area-inset-top)+theme(spacing.6))] pb-[env(safe-area-inset-bottom))]"
>
    <div class="px-6 pb-6 mb-4">
        <div
            class="flex items-baseline gap-2 font-display font-bold text-[var(--heading-section-size)] text-text-primary"
        >
            <span>Fumiki</span>
            <span class="text-accent font-normal">文木</span>
        </div>
        <div class="mt-2 text-[var(--body-sm-size)] text-text-muted italic">
            A tree that grows from literature.
        </div>
    </div>

    <nav class="flex flex-col gap-2 px-4 flex-1">
        {#each items as item}
            <a
                href={item.href}
                class={`flex items-center gap-4 p-3 rounded-md no-underline transition-all duration-150 group ${
                    page.url.pathname === item.href
                        ? "bg-surface-2 text-text-primary root-kami:bg-surface-0 root-kami:border root-kami:border-border-subtle root-kami:shadow-[inset_0_2px_4px_var(--shadow-color)]"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                }`}
            >
                <div
                    class={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        page.url.pathname === item.href
                            ? "bg-surface-1 border border-accent text-accent shadow-[0_2px_8px_var(--shadow-color)]"
                            : "bg-surface-0 border border-border-subtle text-text-muted"
                    }`}
                >
                    <Icon name={item.icon} size={18} />
                </div>
                <div class="flex flex-col">
                    <div class="font-semibold text-[var(--body-size)]">
                        {item.name}
                    </div>
                    <div class="text-xs text-text-muted mt-[2px]">
                        {item.label}
                    </div>
                </div>
            </a>
        {/each}
    </nav>

    <div class="p-6 mt-auto">
        <div class="h-px bg-border-subtle w-full"></div>
    </div>
</aside>
