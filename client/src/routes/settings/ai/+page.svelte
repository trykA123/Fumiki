<script lang="ts">
    import { onMount } from "svelte";
    import { api } from "$lib/api/client";
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import { toast } from "$lib/stores/toast";

    let loading = $state(true);
    let saving = $state(false);

    let provider = $state("ollama");
    let baseUrl = $state("http://localhost:11434");
    let apiKey = $state("");
    let model = $state("llama3");

    onMount(async () => {
        try {
            const res: any = await api.get("/summaries/settings");
            if (res) {
                provider = res.provider || "ollama";
                baseUrl = res.baseUrl || "";
                apiKey = res.apiKey || "";
                model = res.model || "";
            }
        } catch (e: any) {
            toast.add("Failed to load AI settings", "error");
        } finally {
            loading = false;
        }
    });

    async function handleSave() {
        saving = true;
        try {
            const body = {
                provider,
                model,
                ...(provider === "ollama" ? { baseUrl } : {}),
                ...(provider !== "ollama" ? { apiKey } : {}),
            };

            await api.post("/summaries/settings", body);
            toast.add("AI Settings saved successfully", "success");
        } catch (e: any) {
            toast.add(e.message || "Failed to save settings", "error");
        } finally {
            saving = false;
        }
    }

    function handleProviderChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        provider = target.value;
        // Set sensible defaults when changing provider
        if (provider === "ollama") {
            baseUrl = baseUrl || "http://localhost:11434";
            model = "llama3";
        } else if (provider === "openai") {
            model = "gpt-4o-mini";
        } else if (provider === "anthropic") {
            model = "claude-3-haiku-20240307";
        }
    }
</script>

<svelte:head>
    <title>AI Settings - Fumiki</title>
</svelte:head>

<div class="px-6 max-w-[800px] mx-auto flex flex-col gap-6 py-8">
    <header
        class="flex items-center gap-4 border-b border-border-subtle pb-4 mb-4"
    >
        <Button variant="ghost" size="sm" href="/settings">← Back</Button>
        <h1
            class="font-serif text-2xl font-semibold m-0 flex text-text-primary gap-2 items-center"
        >
            <Icon name="settings" size={24} /> AI Configuration
        </h1>
    </header>

    {#if loading}
        <div class="flex justify-center py-12">
            <div
                class="w-8 h-8 border-2 border-surface-2 border-t-accent rounded-full animate-spin"
            ></div>
        </div>
    {:else}
        <SectionHeader title="Provider Settings" />

        <form
            class="flex flex-col gap-6"
            onsubmit={(e) => {
                e.preventDefault();
                handleSave();
            }}
        >
            <Card variant="default">
                <div class="flex flex-col gap-2 mb-6">
                    <label
                        class="text-sm font-medium text-text-secondary"
                        for="provider">AI Provider</label
                    >
                    <select
                        id="provider"
                        class="w-full bg-surface-1 border border-border-medium rounded-[6px] px-3 py-2 text-text-primary font-body focus:border-accent focus:outline-none transition-colors"
                        value={provider}
                        onchange={handleProviderChange}
                    >
                        <option value="ollama"
                            >Ollama (Local / Self-hosted)</option
                        >
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic (Claude)</option>
                    </select>
                </div>

                <div class="flex flex-col gap-2 mb-6">
                    <label
                        class="text-sm font-medium text-text-secondary"
                        for="model">Model Name</label
                    >
                    <input
                        type="text"
                        id="model"
                        class="w-full bg-surface-1 border border-border-medium rounded-[6px] px-3 py-2 text-text-primary font-body focus:border-accent focus:outline-none transition-colors"
                        bind:value={model}
                        placeholder={provider === "ollama"
                            ? "llama3"
                            : provider === "openai"
                              ? "gpt-4o-mini"
                              : "claude-3-haiku-20240307"}
                        required
                    />
                    <p class="text-xs text-text-muted">
                        The exact model identifier to request from the API.
                    </p>
                </div>

                {#if provider === "ollama"}
                    <div
                        class="flex flex-col gap-2 border-t border-border-subtle pt-6"
                    >
                        <label
                            class="text-sm font-medium text-text-secondary"
                            for="baseUrl">Ollama URL</label
                        >
                        <input
                            type="url"
                            id="baseUrl"
                            class="w-full bg-surface-1 border border-border-medium rounded-[6px] px-3 py-2 text-text-primary font-body focus:border-accent focus:outline-none transition-colors"
                            bind:value={baseUrl}
                            placeholder="http://localhost:11434"
                            required
                        />
                        <p class="text-xs text-text-muted">
                            Ensure Fumiki's sidecar backend can reach this URL.
                        </p>
                    </div>
                {:else}
                    <div
                        class="flex flex-col gap-2 border-t border-border-subtle pt-6"
                    >
                        <label
                            class="text-sm font-medium text-text-secondary"
                            for="apiKey">API Key (Secure)</label
                        >
                        <input
                            type="password"
                            id="apiKey"
                            class="w-full bg-surface-1 border border-border-medium rounded-[6px] px-3 py-2 text-text-primary font-body focus:border-accent focus:outline-none transition-colors"
                            bind:value={apiKey}
                            placeholder={apiKey === "********"
                                ? "••••••••••••••••"
                                : `Enter ${provider === "openai" ? "OpenAI" : "Anthropic"} API Key`}
                            required={apiKey !== "********"}
                        />
                        <p class="text-xs text-text-muted">
                            Your API key is stored safely in Fumiki's local
                            SQLite database.
                        </p>
                    </div>
                {/if}
            </Card>

            <div class="flex justify-end gap-3 mt-4">
                <Button variant="ghost" disabled={saving} href="/settings"
                    >Cancel</Button
                >
                <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Configuration"}
                </Button>
            </div>
        </form>
    {/if}
</div>
