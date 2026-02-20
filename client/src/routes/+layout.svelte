<script lang="ts">
  import { onMount } from "svelte";
  import { themeId } from "$stores/theme";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import "../app.css";

  let { children } = $props();

  onMount(() => {
    themeId.init();
  });
</script>

<AppShell>
  {@render children()}
</AppShell>
