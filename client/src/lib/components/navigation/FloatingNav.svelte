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

<div
    class="fixed bottom-[calc(var(--space-6)+env(safe-area-inset-bottom,0px))] left-0 right-0 flex justify-center z-[var(--z-sticky,40)] pointer-events-none"
>
    <nav
        class="flex items-center p-2 bg-surface-1 rounded-full shadow-[0_8px_32px_var(--shadow-color),0_0_0_1px_var(--shadow-color)] pointer-events-auto backdrop-blur-md relative overflow-hidden"
    >
        <div
            class="absolute inset-0 pointer-events-none rounded-inherit mix-blend-overlay z-0 hidden root-mori:block"
            style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.2' numOctaves='3' seed='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23w)' opacity='0.015'/%3E%3C/svg%3E&quot;);"
        ></div>

        {#each items as item}
            <a
                href={item.href}
                class={`relative flex items-center gap-3 py-2 px-4 rounded-full no-underline transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10 group ${
                    page.url.pathname === item.href
                        ? "bg-accent-glow text-accent-text shadow-[inset_0_1px_3px_var(--shadow-color),0_0_0_1px_var(--accent-border)]"
                        : "text-text-muted hover:text-text-primary"
                }`}
                aria-label={item.name}
            >
                <span
                    class={`flex items-center justify-center z-20 ${page.url.pathname === item.href ? "text-accent" : ""}`}
                >
                    <Icon name={item.icon} size={20} />
                </span>
                <span
                    class={`font-semibold tracking-[0.02em] whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-[var(--body-sm-size)] ${
                        page.url.pathname === item.href
                            ? "max-w-[100px] opacity-100 -ml-1"
                            : "max-w-0 opacity-0 overflow-hidden"
                    }`}>{item.name}</span
                >
            </a>
        {/each}
    </nav>
</div>
