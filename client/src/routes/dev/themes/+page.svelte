<script lang="ts">
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
</script>

<div class="dev-container">
    <div class="header">
        <h1>Theme Dashboard</h1>
        <p>Side-by-side comparison of the three visual systems.</p>
    </div>

    <div class="theme-grid">
        <!-- SUMI -->
        <div class="theme-column" data-theme="sumi">
            <div class="theme-header">
                <h2>Sumi <span class="badge sumi-badge">Ink</span></h2>
                <p>High contrast, stark, brutalist.</p>
            </div>

            <div class="theme-content">
                <SectionHeader title="Progression" />
                <Card>
                    <div class="mb-4 flex justify-between">
                        <span>Mind</span>
                        <span class="text-muted">Level 4</span>
                    </div>
                    <ProgressBar value={80} />
                </Card>

                <SectionHeader title="Actions" />
                <div class="flex gap">
                    <Button>Primary</Button>
                    <Button variant="ghost">Secondary</Button>
                </div>

                <SectionHeader title="Content" />
                <Card variant="interactive">
                    <h3 class="mb-2">The Art of War</h3>
                    <p class="text-sm text-muted">Sun Tzu</p>
                </Card>
            </div>
        </div>

        <!-- KAMI -->
        <div class="theme-column" data-theme="kami">
            <div class="theme-header">
                <h2>Kami <span class="badge kami-badge">Paper</span></h2>
                <p>Warm, tactile, traditional.</p>
            </div>

            <div class="theme-content">
                <SectionHeader title="Progression" />
                <Card>
                    <div class="mb-4 flex justify-between">
                        <span>Mind</span>
                        <span class="text-muted">Level 4</span>
                    </div>
                    <ProgressBar value={80} />
                </Card>

                <SectionHeader title="Actions" />
                <div class="flex gap">
                    <Button>Primary</Button>
                    <Button variant="ghost">Secondary</Button>
                </div>

                <SectionHeader title="Content" />
                <Card variant="interactive">
                    <h3 class="mb-2">The Art of War</h3>
                    <p class="text-sm text-muted">Sun Tzu</p>
                </Card>
            </div>
        </div>

        <!-- MORI -->
        <div class="theme-column" data-theme="mori">
            <div class="theme-header">
                <h2>Mori <span class="badge mori-badge">Forest</span></h2>
                <p>Organic, deep, glowing.</p>
            </div>

            <div class="theme-content">
                <SectionHeader title="Progression" />
                <Card>
                    <div class="mb-4 flex justify-between">
                        <span>Mind</span>
                        <span class="text-muted">Level 4</span>
                    </div>
                    <ProgressBar value={80} />
                </Card>

                <SectionHeader title="Actions" />
                <div class="flex gap">
                    <Button>Primary</Button>
                    <Button variant="ghost">Secondary</Button>
                </div>

                <SectionHeader title="Content" />
                <Card variant="interactive">
                    <h3 class="mb-2">The Art of War</h3>
                    <p class="text-sm text-muted">Sun Tzu</p>
                </Card>
            </div>
        </div>
    </div>
</div>

<style>
    .dev-container {
        padding: var(--space-8);
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-8);
        padding-bottom: 120px;
    }

    .header h1 {
        font-size: 32px;
        margin-bottom: var(--space-2);
    }

    .header p {
        color: var(--text-muted);
    }

    .theme-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-8);
    }

    .theme-column {
        /* Critical: Set identical CSS properties dynamically based on the applied data-theme attribute */
        background: var(--surface-0);
        color: var(--text-base);
        font-family: var(--font-body);

        border-radius: var(--radius-xl);
        border: 1px solid var(--border-medium);
        overflow: hidden;

        /* Ensure child components read variables down the DOM tree */
        isolation: isolate;
    }

    .theme-header {
        padding: var(--space-6);
        border-bottom: 1px solid var(--border-subtle);
        background: var(--surface-1);
    }

    .theme-header h2 {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-family: var(--font-serif);
        font-size: 24px;
        margin-bottom: var(--space-2);
    }

    .theme-header p {
        font-size: var(--text-sm);
        color: var(--text-muted);
    }

    .theme-content {
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .badge {
        font-family: var(--font-sans);
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 100px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 600;
    }

    .sumi-badge {
        background: #000;
        color: #fff;
    }
    .kami-badge {
        background: #faf9f6;
        color: #333;
        border: 1px solid #e5e5e5;
    }
    .mori-badge {
        background: #2a312b;
        color: #bee3c6;
    }

    .flex {
        display: flex;
    }
    .justify-between {
        justify-content: space-between;
    }
    .gap {
        gap: var(--space-3);
    }
    .mb-2 {
        margin-bottom: var(--space-2);
    }
    .mb-4 {
        margin-bottom: var(--space-4);
    }

    .text-sm {
        font-size: var(--text-sm);
    }
    .text-muted {
        color: var(--text-muted);
    }

    /* Responsive fallback */
    @media (max-width: 1024px) {
        .theme-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
