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

        // Get dynamic theme colors from the document body to pass to the iframe
        const computedStyles = window.getComputedStyle(document.body);
        const textColor =
            computedStyles.getPropertyValue("--text-primary").trim() ||
            "inherit";
        const accentColor =
            computedStyles.getPropertyValue("--accent").trim() || "inherit";

        // The background and foreground sync natively if foliate's iframe is transparent.
        // But if needed we can force color to inherit or currentColor via CSS inside the reader.
        const css = `
            @namespace epub "http://www.idpf.org/2007/ops";
            html {
                font-family: ${fontFamily} !important;
                font-size: ${fontSize}px !important;
                line-height: ${lineHeight} !important;
                color: ${textColor} !important;
            }
            body { 
                background: transparent !important; 
            }
            p {
                line-height: ${lineHeight} !important;
            }
            a {
                color: ${accentColor} !important;
            }
        `;
        try {
            view.renderer.setStyles(css);
        } catch (e) {
            // non-critical UI setting failure
        }
    }

    $effect(() => {
        applyStyles();
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="fixed inset-0 bg-black/50 z-[100] flex justify-end pointer-events-auto"
    onclick={onClose}
>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="w-[85vw] max-w-[400px] h-full bg-surface-1 flex flex-col shadow-[-2px_0_12px_rgba(0,0,0,0.2)]"
        transition:slide={{ duration: 250, axis: "x" }}
        onclick={(e) => e.stopPropagation()}
    >
        <div
            class="flex items-center justify-between p-4 border-b border-border-subtle"
        >
            <h2 class="text-lg font-semibold m-0">Display Settings</h2>
            <button
                class="bg-transparent border-none text-text-base cursor-pointer p-1 rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-surface-2"
                onclick={onClose}
                aria-label="Close"
            >
                <Icon name="x" size={24} />
            </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <label
                    class="text-sm font-semibold text-text-muted uppercase tracking-[0.05em]"
                    for="font-family">Typography</label
                >
                <div class="flex flex-col gap-2">
                    {#each fonts as font}
                        <button
                            class={`bg-surface-0 border border-border-subtle text-text-base p-3 rounded-md text-base cursor-pointer text-left transition-all duration-200 hover:border-border-strong ${fontFamily === font.value ? "!bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] !border-accent !text-accent font-medium" : ""}`}
                            style="font-family: {font.value}"
                            onclick={() => (fontFamily = font.value)}
                        >
                            {font.label}
                        </button>
                    {/each}
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label
                    class="text-sm font-semibold text-text-muted uppercase tracking-[0.05em]"
                    for="font-size">Font Size: {fontSize}px</label
                >
                <div
                    class="flex items-center gap-3 bg-surface-0 p-3 rounded-md border border-border-subtle"
                >
                    <span class="text-text-muted font-medium text-sm">A</span>
                    <input
                        class="flex-1 m-0 accent-[var(--accent)]"
                        type="range"
                        id="font-size"
                        min="14"
                        max="32"
                        bind:value={fontSize}
                    />
                    <span class="text-text-muted font-medium text-lg">A</span>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label
                    class="text-sm font-semibold text-text-muted uppercase tracking-[0.05em]"
                    for="line-height">Line Height: {lineHeight}</label
                >
                <div
                    class="flex items-center gap-3 bg-surface-0 p-3 rounded-md border border-border-subtle"
                >
                    <span class="text-text-muted font-medium text-sm">↕</span>
                    <input
                        class="flex-1 m-0 accent-[var(--accent)]"
                        type="range"
                        id="line-height"
                        min="1.0"
                        max="2.5"
                        step="0.1"
                        bind:value={lineHeight}
                    />
                    <span class="text-text-muted font-medium text-lg">↕</span>
                </div>
            </div>

            <p class="text-xs text-text-muted text-center mt-auto py-4">
                Theme colors map automatically from Fumiki to the reader
                background.
            </p>
        </div>
    </div>
</div>
