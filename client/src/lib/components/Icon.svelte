<script lang="ts">
    let {
        name,
        size = 24,
        color = "currentColor",
        class: className = "",
    }: {
        name:
            | "library"
            | "play"
            | "pause"
            | "settings"
            | "search"
            | "chevron-down"
            | "skip-back"
            | "skip-forward"
            | "moon"
            | "list"
            | "edit"
            | "device-floppy"
            | "trash"
            | "x";
        size?: number;
        color?: string;
        class?: string;
    } = $props();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={className}
>
    {#if name === "library"}
        <path d="m16 6 4 14" />
        <path d="M12 6v14" />
        <path d="M8 8v12" />
        <path d="M4 4v16" />
    {:else if name === "play"}
        <polygon points="6 3 20 12 6 21 6 3" />
    {:else if name === "pause"}
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    {:else if name === "skip-back"}
        <polygon points="19 20 9 12 19 4 19 20" />
        <line x1="5" y1="19" x2="5" y2="5" />
    {:else if name === "skip-forward"}
        <polygon points="5 4 15 12 5 20 5 4" />
        <line x1="19" y1="5" x2="19" y2="19" />
    {:else if name === "moon"}
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    {:else if name === "x"}
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    {:else if name === "settings"}
        <path
            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        />
        <circle cx="12" cy="12" r="3" />
    {:else if name === "search"}
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    {:else if name === "chevron-down"}
        <path d="m6 9 6 6 6-6" />
    {:else if name === "trash"}
        <polyline points="3 6 5 6 21 6" />
        <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        />
    {:else if name === "edit"}
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    {:else if name === "device-floppy"}
        <path
            d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
        />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    {/if}
</svg>
