<script lang="ts">
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";

    let inputValue = $state("");
</script>

<div class="dev-container">
    <div class="header">
        <h1>Component Gallery</h1>
        <p>Visual testing ground for the Fumiki design system.</p>
    </div>

    <section>
        <SectionHeader title="Typography & Headers" />
        <div class="grid">
            <Card>
                <div class="space-y">
                    <h1>Heading L1 (H1)</h1>
                    <h2>Heading L2 (H2)</h2>
                    <h3>Heading L3 (H3)</h3>
                    <p>
                        Body text. The quick brown fox jumps over the lazy dog.
                        A tree that grows from literature.
                    </p>
                    <p class="text-sm">
                        Small body text for secondary information.
                    </p>
                    <p class="text-xs">
                        Extra small text for badges and microcopy.
                    </p>
                </div>
            </Card>
        </div>
    </section>

    <section>
        <SectionHeader title="Buttons" />
        <div class="grid">
            <Card class="flex-wrap">
                <h3 class="w-full mb-2">Variants</h3>
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button disabled>Disabled</Button>
            </Card>

            <Card class="flex-wrap items-center">
                <h3 class="w-full mb-2">Sizes</h3>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
            </Card>
        </div>
    </section>

    <section>
        <SectionHeader title="Cards" />
        <div class="grid-cols-2">
            <Card>
                <h3 class="font-medium mb-2">Default Card</h3>
                <p class="text-sm text-muted">
                    Standard surface for grouping content.
                </p>
            </Card>

            <Card variant="interactive" onclick={() => alert("Clicked!")}>
                <h3 class="font-medium mb-2">Interactive Card</h3>
                <p class="text-sm text-muted">
                    Hover me to see the theme-specific interaction.
                </p>
            </Card>

            <Card variant="elevated">
                <h3 class="font-medium mb-2">Elevated Card</h3>
                <p class="text-sm text-muted">
                    Floats higher for modals or dropdowns.
                </p>
            </Card>

            <Card variant="hero">
                <h3 class="font-medium mb-2 text-center">Hero Card</h3>
                <p class="text-sm text-muted text-center">
                    Used for empty states or major calls to action.
                </p>
            </Card>
        </div>
    </section>

    <section>
        <SectionHeader title="Inputs" />
        <div class="grid max-w-md">
            <Card>
                <div class="space-y">
                    <Input
                        bind:value={inputValue}
                        placeholder="Default Text Input"
                    />
                    <Input type="password" placeholder="Password Input" />
                    <Input type="search" placeholder="Search Library..." />
                    <Input size="sm" placeholder="Small Input" />
                    <Input size="lg" placeholder="Large Input" />
                    <Input
                        type="textarea"
                        placeholder="Multi-line reflection text..."
                    />
                    <Input disabled placeholder="Disabled Input" />
                </div>
            </Card>
        </div>
    </section>

    <section>
        <SectionHeader title="Progress & Status" />
        <div class="grid">
            <Card class="space-y-lg">
                <div>
                    <p class="text-sm mb-2 flex justify-between">
                        <span>Level 5</span>
                        <span class="text-muted">0 / 1000 KP</span>
                    </p>
                    <ProgressBar value={0} />
                </div>

                <div>
                    <p class="text-sm mb-2 flex justify-between">
                        <span>Level 5</span>
                        <span class="text-muted">450 / 1000 KP</span>
                    </p>
                    <ProgressBar value={45} />
                </div>

                <div>
                    <p class="text-sm mb-2 flex justify-between">
                        <span>Level 5</span>
                        <span class="text-muted">1000 / 1000 KP</span>
                    </p>
                    <ProgressBar value={100} intent="success" />
                </div>
            </Card>
        </div>
    </section>
</div>

<style>
    .dev-container {
        padding: var(--space-8);
        max-width: 1000px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-8);
        padding-bottom: 120px; /* Space for nav */
    }

    .header h1 {
        font-size: 32px;
        margin-bottom: var(--space-2);
    }

    .header p {
        color: var(--text-muted);
    }

    section {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .grid {
        display: grid;
        gap: var(--space-4);
    }

    .grid-cols-2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--space-4);
    }

    .flex-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-4);
    }

    .items-center {
        align-items: center;
    }

    .items-end {
        align-items: flex-end;
    }

    .space-y {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .space-y > * {
        margin: 0;
    }

    .space-y-lg {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .max-w-md {
        max-width: 400px;
    }

    .flex {
        display: flex;
    }

    .justify-between {
        justify-content: space-between;
    }

    .mb-2 {
        margin-bottom: var(--space-2);
    }

    .mt-4 {
        margin-top: var(--space-4);
    }

    .text-sm {
        font-size: var(--text-sm);
    }

    .text-xs {
        font-size: 12px;
    }

    .text-muted {
        color: var(--text-muted);
    }

    .text-center {
        text-align: center;
    }

    .font-medium {
        font-weight: 500;
    }
</style>
