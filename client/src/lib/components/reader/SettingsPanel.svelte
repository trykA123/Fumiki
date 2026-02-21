<script lang="ts">
    import { slide } from "svelte/transition";
    import Icon from "$lib/components/Icon.svelte";

    let { view, onClose }: { view: any; onClose: () => void } = $props();

    // Settings state
    let fontFamily = $state("Georgia");
    let fontSize = $state(18);
    let lineHeight = $state(1.6);

    const fonts = [
        { label: "Georgia", value: "Georgia, serif" },
        { label: "System Sans", value: "system-ui, sans-serif" },
        { label: "System Serif", value: "ui-serif, serif" },
        { label: "Monospace", value: "ui-monospace, monospace" },
    ];

    function applyStyles() {
        if (!view || !view.renderer || !view.renderer.setStyles) return;

        // The background and foreground sync natively if foliate's iframe is transparent.
        // But if needed we can force color to inherit or currentColor via CSS inside the reader.
        const css = `
            @namespace epub "http://www.idpf.org/2007/ops";
            html {
                font-family: ${fontFamily} !important;
                font-size: ${fontSize}px !important;
                line-height: ${lineHeight} !important;
                color: var(--text-base) !important;
            }
            body { 
                background: transparent !important; 
            }
            p {
                line-height: ${lineHeight} !important;
            }
        `;
        try {
            view.renderer.setStyles(css);
        } catch (e) {
            console.error("Failed to set styles:", e);
        }
    }

    $effect(() => {
        applyStyles();
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="settings-overlay" onclick={onClose}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="settings-drawer"
        transition:slide={{ duration: 250, axis: "x" }}
        onclick={(e) => e.stopPropagation()}
    >
        <div class="header">
            <h2>Display Settings</h2>
            <button class="icon-btn" onclick={onClose} aria-label="Close">
                <Icon name="x" size={24} />
            </button>
        </div>

        <div class="content">
            <div class="setting-group">
                <label for="font-family">Typography</label>
                <div class="font-options">
                    {#each fonts as font}
                        <button
                            class="font-btn"
                            class:active={fontFamily === font.value}
                            style="font-family: {font.value}"
                            onclick={() => (fontFamily = font.value)}
                        >
                            {font.label}
                        </button>
                    {/each}
                </div>
            </div>

            <div class="setting-group">
                <label for="font-size">Font Size: {fontSize}px</label>
                <div class="range-control">
                    <span class="range-icon small">A</span>
                    <input
                        type="range"
                        id="font-size"
                        min="14"
                        max="32"
                        bind:value={fontSize}
                    />
                    <span class="range-icon large">A</span>
                </div>
            </div>

            <div class="setting-group">
                <label for="line-height">Line Height: {lineHeight}</label>
                <div class="range-control">
                    <span class="range-icon small">↕</span>
                    <input
                        type="range"
                        id="line-height"
                        min="1.0"
                        max="2.5"
                        step="0.1"
                        bind:value={lineHeight}
                    />
                    <span class="range-icon large">↕</span>
                </div>
            </div>

            <p class="theme-hint">
                Theme colors map automatically from Fumiki to the reader
                background.
            </p>
        </div>
    </div>
</div>

<style>
    .settings-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
        display: flex;
        justify-content: flex-end; /* right side */
        pointer-events: auto;
    }

    .settings-drawer {
        width: 85vw;
        max-width: 400px;
        height: 100%;
        background: var(--surface-1);
        display: flex;
        flex-direction: column;
        box-shadow: -2px 0 12px rgba(0, 0, 0, 0.2);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-4);
        border-bottom: 1px solid var(--border-subtle);
    }

    .header h2 {
        font-size: var(--text-lg);
        font-weight: 600;
        margin: 0;
    }

    .icon-btn {
        background: transparent;
        border: none;
        color: var(--text-base);
        cursor: pointer;
        padding: var(--space-1);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color var(--transition-base);
    }

    .icon-btn:hover {
        background-color: var(--surface-2);
    }

    .content {
        flex: 1;
        overflow-y: auto;
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .setting-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .setting-group label {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .font-options {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .font-btn {
        background: var(--surface-0);
        border: 1px solid var(--border-subtle);
        color: var(--text-base);
        padding: var(--space-3);
        border-radius: var(--radius-md);
        font-size: var(--text-base);
        cursor: pointer;
        text-align: left;
        transition: all var(--transition-base);
    }

    .font-btn:hover {
        border-color: var(--border-strong);
    }

    .font-btn.active {
        background: color-mix(in srgb, var(--accent) 10%, transparent);
        border-color: var(--accent);
        color: var(--accent);
        font-weight: 500;
    }

    .range-control {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        background: var(--surface-0);
        padding: var(--space-3);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-subtle);
    }

    .range-icon {
        color: var(--text-muted);
        font-weight: 500;
    }
    .range-icon.small {
        font-size: var(--text-sm);
    }
    .range-icon.large {
        font-size: var(--text-lg);
    }

    input[type="range"] {
        flex: 1;
        margin: 0;
        accent-color: var(--accent);
    }

    .theme-hint {
        font-size: var(--text-xs);
        color: var(--text-muted);
        text-align: center;
        margin-top: auto;
        padding: var(--space-4) 0;
    }
</style>
