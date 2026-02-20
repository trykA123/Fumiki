<script lang="ts">
    let {
        value = 0,
        max = 100,
        size = "md",
        intent = "accent",
        class: className = "",
    }: {
        value?: number;
        max?: number;
        size?: "xs" | "sm" | "md" | "lg";
        intent?: "accent" | "success";
        class?: string;
    } = $props();

    const percentage = $derived(
        Math.min(Math.max((value / max) * 100, 0), 100),
    );
</script>

<div
    class="progress-track progress-{size} {className}"
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin="0"
    aria-valuemax={max}
>
    <div
        class="progress-fill progress-fill-{intent}"
        style="width: {percentage}%;"
    ></div>
</div>

<style>
    .progress-track {
        background: var(--surface-3);
        border-radius: 100px;
        overflow: hidden;
        width: 100%;
    }

    .progress-xs {
        height: 2px;
    }
    .progress-sm {
        height: 3px;
    }
    .progress-md {
        height: 5px;
    }
    .progress-lg {
        height: 8px;
    }

    .progress-fill {
        height: 100%;
        border-radius: inherit;
        transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .progress-fill-accent {
        background: var(--accent);
    }
    .progress-fill-success {
        background: var(--success);
    }

    /* Sumi: flat, thin */
    :global([data-theme="sumi"]) .progress-track,
    :global([data-theme="sumi"]) .progress-fill {
        border-radius: 0;
    }

    /* Mori: subtle glow */
    :global([data-theme="mori"]) .progress-fill {
        box-shadow: 0 0 8px var(--accent-glow);
    }
</style>
