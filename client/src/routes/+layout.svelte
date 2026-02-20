<script lang="ts">
  import { onMount } from "svelte";
  import { themeId } from "$stores/theme";
  import "../app.css";

  let { children } = $props();

  onMount(() => {
    themeId.init();
  });
</script>

<div class="app">
  {@render children()}
</div>
