<script lang="ts">
    import SectionHeader from "../ui/SectionHeader.svelte";
    import Button from "../ui/Button.svelte";

    // This will be expanded in Phase 2 for AI Summaries.
    // Currently just a structural placeholder.
</script>

<div class="summary-section">
    <SectionHeader title="AI Summaries" />

    <div class="summary-placeholder">
        <p class="text">
            Generate chapter summaries with AI. (Coming in Phase 2)
        </p>
        <Button variant="ghost" size="sm" disabled>Generate</Button>
    </div>
</div>

<style>
    .summary-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .summary-placeholder {
        padding: var(--space-4);
        background: var(--surface-1);
        border-radius: var(--radius-lg);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
        border: 1px dashed var(--surface-3);
    }

    .text {
        color: var(--text-muted);
        margin: 0;
    }
</style>
