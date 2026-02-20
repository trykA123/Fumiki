<script lang="ts">
  import { themeId, theme } from "$stores/theme";
</script>

<main class="page-container">
  <h1>Fumiki 文木</h1>
  <p class="subtitle">A tree that grows from literature.</p>

  <div class="test-card">
    <h2>Theme System Test</h2>
    <p>Current Theme: <strong>{$theme?.nameKanji} {$theme?.name}</strong></p>

    <div class="actions">
      <button
        onclick={() => themeId.setTheme("sumi")}
        class:active={$themeId === "sumi"}
      >
        Sumi 墨
      </button>
      <button
        onclick={() => themeId.setTheme("kami")}
        class:active={$themeId === "kami"}
      >
        Kami 紙
      </button>
      <button
        onclick={() => themeId.setTheme("mori")}
        class:active={$themeId === "mori"}
      >
        Mori 森
      </button>
    </div>
  </div>
</main>

<style>
  .page-container {
    max-width: var(--content-max-width, 800px);
    margin: 0 auto;
    padding: var(--page-padding-desktop);
  }

  h1 {
    font-family: var(--font-display);
    font-size: var(--heading-hero-size);
    font-weight: var(--heading-hero-weight);
    margin-bottom: var(--space-2);
  }

  .subtitle {
    color: var(--text-secondary);
    margin-bottom: var(--space-8);
  }

  .test-card {
    background-color: var(--surface-1);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: var(--card-padding);
    box-shadow: var(--shadow-sm);
  }

  h2 {
    font-size: var(--heading-section-size);
    font-weight: var(--heading-section-weight);
    margin-bottom: var(--space-4);
  }

  .actions {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-5);
  }

  button {
    background-color: var(--surface-2);
    color: var(--text-primary);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-sm);
    padding: var(--space-3) var(--space-5);
    font-size: var(--data-size);
    cursor: pointer;
    transition: all var(--animate-duration-fast);
  }

  button:hover {
    background-color: var(--surface-3);
  }

  button.active {
    background-color: var(--accent);
    color: var(--accent-text, #fff);
    border-color: var(--accent);
  }
</style>
