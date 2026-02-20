<script lang="ts">
    import { Feather } from "lucide-svelte";
    import Library from "lucide-svelte/icons/library";
    import Play from "lucide-svelte/icons/play";
    import Settings from "lucide-svelte/icons/settings";
    import Search from "lucide-svelte/icons/search";

    // A simple wrapper around Lucide icons to quickly pull by name
    let {
        name,
        size = 24,
        color = "currentColor",
        class: className = "",
    }: {
        name: "library" | "play" | "settings" | "search";
        size?: number;
        color?: string;
        class?: string;
    } = $props();

    const icons = {
        library: Library,
        play: Play,
        settings: Settings,
        search: Search,
    };

    const IconComponent = $derived(icons[name]);
</script>

{#if IconComponent}
    <div
        class={className}
        style="width: {size}px; height: {size}px; display: inline-flex; align-items: center; justify-content: center; color: {color}"
    >
        <IconComponent {size} />
    </div>
{/if}
