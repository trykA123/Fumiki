<script lang="ts">
    import { auth } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import Card from "$lib/components/ui/Card.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { onMount } from "svelte";

    let absUrl = $state("");
    let username = $state("");
    let password = $state("");
    let isEditingHost = $state(false);

    // Check auth immediately
    onMount(async () => {
        if (!$auth.initialized) {
            await auth.checkStatus();
        }

        // If already authenticated, redirect to home
        if ($auth.isAuthenticated) {
            goto("/");
        }
    });

    const showUrlInput = $derived(!$auth.absConfigured || isEditingHost);

    async function handleLogin() {
        const success = await auth.login(
            username,
            password,
            showUrlInput ? absUrl : undefined,
        );
        if (success) {
            goto("/");
        }
    }

    function toggleEditHost() {
        isEditingHost = true;
        absUrl = $auth.absHost || "";
    }
</script>

<svelte:head>
    <title>Login - Fumiki</title>
</svelte:head>

<div class="auth-page">
    <div class="auth-container">
        <div class="logo-area">
            <h1 class="kanji-logo">文木</h1>
            <p class="subtitle">A tree that grows from literature</p>
        </div>

        <Card variant="elevated" class="login-card">
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                {#if $auth.error}
                    <div class="error-banner">
                        {$auth.error}
                    </div>
                {/if}

                <div class="input-stack">
                    {#if showUrlInput}
                        <div class="field">
                            <label for="abs-url">AudioBookShelf Server</label>
                            <Input
                                id="abs-url"
                                bind:value={absUrl}
                                placeholder="https://audiobookshelf.example.com"
                                required={!$auth.absConfigured}
                            />
                            <p class="help-text">
                                The full URL to your ABS instance.
                            </p>
                        </div>
                    {:else}
                        <div class="saved-host">
                            <span class="label">Connected to:</span>
                            <div class="host-row">
                                <span class="host-value">{$auth.absHost}</span>
                                <button
                                    type="button"
                                    class="text-link"
                                    onclick={toggleEditHost}>Change</button
                                >
                            </div>
                        </div>
                    {/if}

                    <div class="field">
                        <label for="username">Username</label>
                        <Input id="username" bind:value={username} required />
                    </div>

                    <div class="field">
                        <label for="password">Password</label>
                        <Input
                            id="password"
                            type="password"
                            bind:value={password}
                            required
                        />
                    </div>
                </div>

                <div class="actions">
                    <Button
                        type="submit"
                        disabled={$auth.loading || !username || !password}
                        class="w-full"
                    >
                        {$auth.loading ? "Entering..." : "Enter Library"}
                    </Button>
                </div>
            </form>
        </Card>
    </div>
</div>

<style>
    .auth-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: var(--space-4);
        background: var(--surface-0);
    }

    .auth-container {
        width: 100%;
        max-width: 440px;
        display: flex;
        flex-direction: column;
        gap: var(--space-8);
    }

    .logo-area {
        text-align: center;
    }

    .kanji-logo {
        font-family: var(--font-serif);
        font-size: 64px;
        font-weight: 300;
        line-height: 1;
        color: var(--text-base);
        margin-bottom: var(--space-2);
    }

    .subtitle {
        font-family: var(--font-sans);
        color: var(--text-muted);
        font-size: var(--text-sm);
        letter-spacing: 0.05em;
    }

    :global(.login-card) {
        padding: var(--space-8);
    }

    .error-banner {
        background: color-mix(in srgb, var(--danger) 10%, transparent);
        color: var(--danger);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        margin-bottom: var(--space-6);
        text-align: center;
    }

    .input-stack {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
    }

    .field label {
        display: block;
        margin-bottom: var(--space-2);
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-base);
    }

    .help-text {
        margin-top: var(--space-2);
        font-size: 13px;
        color: var(--text-muted);
    }

    .saved-host {
        padding: var(--space-4);
        background: var(--surface-1);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-subtle);
    }

    .saved-host .label {
        display: block;
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: var(--space-1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .host-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .host-value {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--text-base);
    }

    .text-link {
        background: none;
        border: none;
        color: var(--accent);
        font-size: var(--text-sm);
        cursor: pointer;
        padding: 0;
    }

    .text-link:hover {
        text-decoration: underline;
    }

    .actions {
        margin-top: var(--space-8);
    }

    :global(.w-full) {
        width: 100%;
    }

    /* Theme specific overrides */
    :global([data-theme="kami"] .login-card) {
        border: 1px solid var(--border-subtle);
        box-shadow: 4px 4px 16px var(--shadow-color);
    }
</style>
