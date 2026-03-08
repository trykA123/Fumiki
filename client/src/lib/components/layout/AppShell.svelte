<script lang="ts">
    import type { Snippet } from "svelte";
    import { themeId } from "$stores/theme";
    import BottomNav from "$lib/components/navigation/BottomNav.svelte";
    import TopNav from "$lib/components/navigation/TopNav.svelte";
    import SideNav from "$lib/components/navigation/SideNav.svelte";
    import FloatingNav from "$lib/components/navigation/FloatingNav.svelte";

    let { children }: { children: Snippet } = $props();

    let innerWidth = $state(
        typeof window !== "undefined" ? window.innerWidth : 1024,
    );
    const isMobile = $derived(innerWidth < 768);
    const isSumi = $derived($themeId === "sumi");
    const isKami = $derived($themeId === "kami");
    const isMori = $derived($themeId === "mori");
</script>

<svelte:window bind:innerWidth />

<div
    class="flex min-h-screen w-full box-border pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]"
>
    <!-- Navigation Layer -->
    {#if isMobile}
        <BottomNav />
    {:else if isSumi}
        <TopNav />
    {:else if isKami}
        <SideNav />
    {:else if isMori}
        <FloatingNav />
    {/if}

    <!-- Main Content Layer -->
    <main
        class={`flex-1 w-full min-w-0 transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobile
                ? "pb-[calc(56px+env(safe-area-inset-bottom,0px)+var(--space-6))] pt-[env(safe-area-inset-top,0px)]"
                : isSumi
                  ? "pt-[calc(56px+env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)]"
                  : isKami
                    ? "pl-[260px] pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
                    : isMori
                      ? "pb-[calc(72px+env(safe-area-inset-bottom,0px)+var(--space-6))] pt-[env(safe-area-inset-top,0px)]"
                      : ""
        }`}
    >
        {@render children()}
    </main>
</div>
