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

<div class="settings-page">
    <SectionHeader title="Connection" />

    <Card variant="default" class="connection-card">
        <div class="status-row">
            <div class="info">
                <h3>AudioBookShelf Server</h3>
                <p class="monospace">{$auth.absHost || "Unknown"}</p>
            </div>
            <div class="badge" class:active={$auth.isAuthenticated}>
                {$auth.isAuthenticated ? "Connected" : "Disconnected"}
            </div>
        </div>

        <div class="user-row">
            <div class="info">
                <h3>Logged in as</h3>
                <p>{$auth.username || "System"}</p>
            </div>
            <Button variant="danger" size="sm" onclick={() => auth.logout()}
                >Disconnect</Button
            >
        </div>
    </Card>

    <SectionHeader title="Appearance" />

    <Card variant="interactive" class="theme-card">
        <div class="theme-selector">
            <button
                class="theme-btn"
                class:active={$themeId === "sumi"}
                onclick={() => switchTheme("sumi")}
            >
                <span class="swatch bg-sumi"></span>
                Sumi
            </button>
            <button
                class="theme-btn"
                class:active={$themeId === "kami"}
                onclick={() => switchTheme("kami")}
            >
                <span class="swatch bg-kami"></span>
                Kami
            </button>
            <button
                class="theme-btn"
                class:active={$themeId === "mori"}
                onclick={() => switchTheme("mori")}
            >
                <span class="swatch bg-mori"></span>
                Mori
            </button>
        </div>
        <p class="theme-desc">Current aesthetics: <em>{$theme.name}</em></p>
    </Card>
</div>

<style>
    .settings-page {
        padding: var(--space-6);
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .status-row,
    .user-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-4) 0;
    }

    .user-row {
        border-top: 1px solid var(--border-subtle);
    }

    .info h3 {
        font-size: var(--text-sm);
        color: var(--text-muted);
        margin-bottom: var(--space-1);
        font-weight: 500;
    }

    .info p {
        font-size: var(--text-base);
        color: var(--text-base);
    }

    .monospace {
        font-family: var(--font-mono);
    }

    .badge {
        padding: 4px 12px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: var(--surface-2);
        color: var(--text-muted);
    }

    .badge.active {
        background: color-mix(in srgb, var(--success) 20%, transparent);
        color: var(--success);
        border: 1px solid color-mix(in srgb, var(--success) 40%, transparent);
    }

    .theme-selector {
        display: flex;
        gap: var(--space-4);
        margin-bottom: var(--space-4);
    }

    .theme-btn {
        flex: 1;
        background: var(--surface-0);
        border: 1px solid var(--border-medium);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        cursor: pointer;
        transition: all 200ms ease;
        color: var(--text-base);
    }

    .theme-btn:hover {
        border-color: var(--accent);
    }

    .theme-btn.active {
        border-color: var(--accent);
        background: var(--surface-accent);
        box-shadow: 0 0 0 2px var(--accent-glow-strong);
    }

    .swatch {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid var(--border-strong);
    }

    .bg-sumi {
        background: #111111;
    }
    .bg-kami {
        background: #faf9f6;
    }
    .bg-mori {
        background: #2a312b;
    }

    .theme-desc {
        color: var(--text-muted);
        font-size: var(--text-sm);
        text-align: center;
    }
</style>
