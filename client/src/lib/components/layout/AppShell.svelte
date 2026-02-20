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
    class="app-shell"
    class:is-mobile={isMobile}
    class:theme-sumi={isSumi}
    class:theme-kami={isKami}
    class:theme-mori={isMori}
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
    <main class="main-content">
        {@render children()}
    </main>
</div>

<style>
    .app-shell {
        display: flex;
        min-height: 100vh;
        width: 100%;
        /* Apply safe areas to the absolute outer shell */
        padding-left: env(safe-area-inset-left, 0px);
        padding-right: env(safe-area-inset-right, 0px);
        box-sizing: border-box;
    }

    .main-content {
        flex: 1;
        width: 100%;
        min-width: 0;
        transition: padding 300ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Padding logic based on Matrix */

    /* Mobile: padding bottoms for BottomNav + Safe areas */
    .is-mobile .main-content {
        padding-bottom: calc(
            56px + env(safe-area-inset-bottom, 0px) + var(--space-6)
        );
        padding-top: env(safe-area-inset-top, 0px);
    }

    /* Tablet/Desktop: Sumi pad top */
    .app-shell:not(.is-mobile).theme-sumi .main-content {
        padding-top: calc(56px + env(safe-area-inset-top, 0px));
        padding-bottom: env(safe-area-inset-bottom, 0px);
    }

    /* Tablet/Desktop: Kami pad left */
    .app-shell:not(.is-mobile).theme-kami .main-content {
        padding-left: 260px; /* Width of SideNav */
        padding-top: env(safe-area-inset-top, 0px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
    }

    /* Tablet/Desktop: Mori pad bottom for FloatingNav */
    .app-shell:not(.is-mobile).theme-mori .main-content {
        padding-bottom: calc(
            72px + env(safe-area-inset-bottom, 0px) + var(--space-6)
        );
        padding-top: env(safe-area-inset-top, 0px);
    }
</style>
