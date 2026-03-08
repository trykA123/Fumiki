<script lang="ts">
    import { auth } from "$lib/stores/auth";
    import { theme, themeId } from "$stores/theme";
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";

    function switchTheme(t: "sumi" | "kami" | "mori") {
        themeId.setTheme(t);
    }
</script>

<svelte:head>
    <title>Settings - Fumiki</title>
</svelte:head>

<div class="px-6 max-w-[800px] mx-auto flex flex-col gap-6">
    <SectionHeader title="Connection" />

    <Card variant="default">
        <div class="flex justify-between items-center py-4">
            <div>
                <h3 class="text-sm text-text-muted mb-1 font-medium">
                    AudioBookShelf Server
                </h3>
                <p class="font-mono text-base text-text-primary">
                    {$auth.absHost || "Unknown"}
                </p>
            </div>
            <div
                class={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${$auth.isAuthenticated ? "bg-success/20 text-success border border-success/40" : "bg-surface-2 text-text-muted"}`}
            >
                {$auth.isAuthenticated ? "Connected" : "Disconnected"}
            </div>
        </div>

        <div
            class="flex justify-between items-center py-4 border-t border-border-subtle"
        >
            <div>
                <h3 class="text-sm text-text-muted mb-1 font-medium">
                    Logged in as
                </h3>
                <p class="text-base text-text-primary">
                    {$auth.username || "System"}
                </p>
            </div>
            <Button variant="danger" size="sm" onclick={() => auth.logout()}
                >Disconnect</Button
            >
        </div>

        <div
            class="flex items-center justify-between py-4 border-t border-border-subtle"
        >
            <div>
                <h3 class="text-sm text-text-muted mb-1 font-medium">
                    Artificial Intelligence
                </h3>
                <p class="text-base text-text-primary">
                    Summary Generation via Ollama, OpenAI, or Anthropic
                </p>
            </div>
            <Button variant="secondary" size="sm" href="/settings/ai"
                >Configure</Button
            >
        </div>
    </Card>

    <SectionHeader title="Appearance" />

    <Card variant="interactive">
        <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <button
                class={`flex-1 bg-surface-0 border border-border-medium rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 text-text-primary hover:border-accent ${$themeId === "sumi" ? "border-accent bg-surface-accent shadow-[0_0_0_2px_var(--accent-glow-strong)]" : ""}`}
                onclick={() => switchTheme("sumi")}
            >
                <span
                    class="w-8 h-8 rounded-full border border-border-strong bg-[#111111]"
                ></span>
                Sumi
            </button>
            <button
                class={`flex-1 bg-surface-0 border border-border-medium rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 text-text-primary hover:border-accent ${$themeId === "kami" ? "border-accent bg-surface-accent shadow-[0_0_0_2px_var(--accent-glow-strong)]" : ""}`}
                onclick={() => switchTheme("kami")}
            >
                <span
                    class="w-8 h-8 rounded-full border border-border-strong bg-[#faf9f6]"
                ></span>
                Kami
            </button>
            <button
                class={`flex-1 bg-surface-0 border border-border-medium rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 text-text-primary hover:border-accent ${$themeId === "mori" ? "border-accent bg-surface-accent shadow-[0_0_0_2px_var(--accent-glow-strong)]" : ""}`}
                onclick={() => switchTheme("mori")}
            >
                <span
                    class="w-8 h-8 rounded-full border border-border-strong bg-[#2a312b]"
                ></span>
                Mori
            </button>
        </div>
        <p class="text-text-muted text-sm text-center">
            Current aesthetics: <em class="not-italic font-medium"
                >{$theme.name}</em
            >
        </p>
    </Card>
</div>
