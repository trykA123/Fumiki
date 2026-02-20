<script lang="ts">
  import { themeId, theme } from "$stores/theme";
  import Button from "$lib/components/ui/Button.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
  import Tag from "$lib/components/ui/Tag.svelte";
  import Toast from "$lib/components/ui/Toast.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
  import Divider from "$lib/components/ui/Divider.svelte";
  import Skeleton from "$lib/components/ui/Skeleton.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";

  let modalOpen = $state(false);
  let showToast = $state(false);
</script>

<main class="page-container">
  <h1>Core Components Test</h1>
  <p class="subtitle">
    Theme: <strong>{$theme?.nameKanji} {$theme?.name}</strong>
  </p>

  <div class="actions">
    <Button
      variant={$themeId === "sumi" ? "primary" : "secondary"}
      onclick={() => themeId.setTheme("sumi")}>Sumi</Button
    >
    <Button
      variant={$themeId === "kami" ? "primary" : "secondary"}
      onclick={() => themeId.setTheme("kami")}>Kami</Button
    >
    <Button
      variant={$themeId === "mori" ? "primary" : "secondary"}
      onclick={() => themeId.setTheme("mori")}>Mori</Button
    >
  </div>

  <Divider />

  <SectionHeader title="Buttons" href="#" linkText="View All" />
  <div class="component-grid">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
    <Button variant="icon">X</Button>
  </div>

  <Divider />

  <SectionHeader title="Badges / Tags" />
  <div class="component-grid">
    <Tag intent="accent">Accent</Tag>
    <Tag intent="success">Success</Tag>
    <Tag intent="info">Info</Tag>
    <Tag intent="muted">Muted</Tag>
  </div>

  <Divider />

  <SectionHeader title="Inputs" />
  <div class="component-col">
    <Input type="text" placeholder="Standard input..." />
    <Input type="search" placeholder="Search library..." />
    <Input type="textarea" placeholder="A long note about a book..." />
  </div>

  <Divider />

  <SectionHeader title="Cards & Structure" />
  <div class="component-grid">
    <Card variant="default"
      >Base Card<br /><span style="color:var(--text-muted)">Un-clickable</span
      ></Card
    >
    <Card variant="interactive"
      >Interactive Card<br /><span style="color:var(--text-muted)"
        >Hover me</span
      ></Card
    >
    <Card variant="elevated"
      >Elevated Card<br /><span style="color:var(--text-muted)"
        >Stronger shadow</span
      ></Card
    >
    <Card variant="hero"
      >Hero Card<br /><span style="color:var(--text-muted)">Has ornaments</span
      ></Card
    >
  </div>

  <Divider />

  <SectionHeader title="Progress & Skeletons" />
  <div class="component-col">
    <ProgressBar value={45} max={100} intent="accent" />
    <ProgressBar value={100} max={100} intent="success" />

    <div style="display:flex; gap:16px; margin-top:20px;">
      <div style="width: 80px;"><Skeleton variant="cover" /></div>
      <div style="flex:1;">
        <Skeleton variant="text" /><br /><Skeleton
          variant="text"
          style="width: 60%"
        />
      </div>
    </div>
  </div>

  <Divider />

  <SectionHeader title="Overlays & Fallbacks" />
  <div class="component-grid">
    <Button variant="secondary" onclick={() => (modalOpen = true)}
      >Open Modal</Button
    >
    <Button variant="secondary" onclick={() => (showToast = true)}
      >Trigger Toast</Button
    >
  </div>

  <div style="margin-top: 2rem;">
    <EmptyState
      title="Start your library"
      message="Looks like you haven't connected ABS yet."
    >
      {#snippet action()}
        <Button variant="primary">Connect API</Button>
      {/snippet}
    </EmptyState>
  </div>

  <Modal bind:open={modalOpen} title="Information">
    <p>
      This is a native HTML5 dialog element styled to perfection. It supports
      accessibility natively and handles its own backdrop via CSS.
    </p>
    {#snippet actions()}
      <Button variant="ghost" onclick={() => (modalOpen = false)}>Close</Button>
      <Button variant="primary">Accept</Button>
    {/snippet}
  </Modal>

  {#if showToast}
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
      <Toast
        intent="success"
        message="File saved successfully!"
        onclose={() => (showToast = false)}
      />
    </div>
  {/if}
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

  /* The original .test-card and h2 styles are removed as they are not used in the new content */

  .actions {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-8); /* Changed from margin-top */
  }

  button {
    /* Original button styles, but now applied to the new Button component */
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

  .component-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  .component-col {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
</style>
