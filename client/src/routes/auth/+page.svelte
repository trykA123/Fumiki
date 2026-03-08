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

<div class="flex items-center justify-center min-h-screen p-4 bg-surface-0">
    <div class="w-full max-w-[440px] flex flex-col gap-8">
        <div class="text-center">
            <h1
                class="font-serif text-[64px] font-light leading-none text-text-primary mb-2"
            >
                文木
            </h1>
            <p class="font-sans text-text-muted text-sm tracking-wide">
                A tree that grows from literature
            </p>
        </div>

        <Card variant="elevated" class="p-8">
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
                {#if $auth.error}
                    <div
                        class="bg-danger/10 text-danger p-4 rounded-md text-sm mb-6 text-center"
                    >
                        {$auth.error}
                    </div>
                {/if}

                <div class="flex flex-col gap-5">
                    {#if showUrlInput}
                        <div>
                            <label
                                class="block mb-2 text-sm font-medium text-text-primary"
                                for="abs-url">AudioBookShelf Server</label
                            >
                            <Input
                                id="abs-url"
                                bind:value={absUrl}
                                placeholder="https://audiobookshelf.example.com"
                                required={!$auth.absConfigured}
                            />
                            <p class="mt-2 text-[13px] text-text-muted">
                                The full URL to your ABS instance.
                            </p>
                        </div>
                    {:else}
                        <div
                            class="p-4 bg-surface-1 rounded-md border border-border-subtle"
                        >
                            <span
                                class="block text-xs text-text-muted mb-1 uppercase tracking-wider"
                                >Connected to:</span
                            >
                            <div class="flex justify-between items-center">
                                <span
                                    class="font-mono text-sm text-text-primary"
                                    >{$auth.absHost}</span
                                >
                                <button
                                    type="button"
                                    class="bg-transparent border-none text-accent text-sm cursor-pointer p-0 hover:underline"
                                    onclick={toggleEditHost}>Change</button
                                >
                            </div>
                        </div>
                    {/if}

                    <div>
                        <label
                            class="block mb-2 text-sm font-medium text-text-primary"
                            for="username">Username</label
                        >
                        <Input id="username" bind:value={username} required />
                    </div>

                    <div>
                        <label
                            class="block mb-2 text-sm font-medium text-text-primary"
                            for="password">Password</label
                        >
                        <Input
                            id="password"
                            type="password"
                            bind:value={password}
                            required
                        />
                    </div>
                </div>

                <div class="mt-8">
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
