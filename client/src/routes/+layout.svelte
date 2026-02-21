<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { themeId } from "$stores/theme";
  import { auth } from "$stores/auth";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PlayerMini from "$lib/components/player/PlayerMini.svelte";
  import ToastContainer from "$lib/components/ui/ToastContainer.svelte";
  import "../app.css";

  let { children } = $props();

  onMount(async () => {
    themeId.init();

    // Check session on start if needed
    if (!$auth.initialized) {
      await auth.checkStatus();
    }

    // Route guarding
    if (!$auth.isAuthenticated && $page.url.pathname !== "/auth") {
      goto("/auth", { replaceState: true });
    }
  });

  // Reactive redirect for when auth state drops during usage
  $effect(() => {
    if (
      $auth.initialized &&
      !$auth.isAuthenticated &&
      $page.url.pathname !== "/auth"
    ) {
      goto("/auth", { replaceState: true });
    }
  });
</script>

<AppShell>
  {@render children()}
</AppShell>

<ToastContainer />

{#if $page.url.pathname.indexOf("/player/") === -1}
  <PlayerMini />
{/if}
