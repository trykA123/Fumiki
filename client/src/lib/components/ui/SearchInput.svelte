<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "$lib/components/Icon.svelte";

    let {
        value = $bindable(""),
        placeholder = "Search...",
        class: className = "",
        onsearch,
    }: {
        value?: string;
        placeholder?: string;
        class?: string;
        onsearch?: (val: string) => void;
    } = $props();

    let timeout: ReturnType<typeof setTimeout>;

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        value = target.value;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (onsearch) onsearch(value);
        }, 300);
    }
</script>

<div class={`relative flex items-center w-full max-w-[480px] ${className}`}>
    <div
        class="absolute left-3 text-text-muted pointer-events-none flex items-center justify-center"
    >
        <Icon name="search" size={18} />
    </div>
    <input
        type="search"
        {value}
        oninput={handleInput}
        {placeholder}
        class="w-full h-10 pl-10 pr-4 rounded-full border border-border-medium bg-surface-1 text-text-primary font-body text-sm transition-all duration-200 hover:bg-surface-2 hover:border-border-strong focus:outline-none focus:bg-surface-0 focus:border-accent focus:shadow-[0_0_0_1px_var(--accent)] placeholder:text-text-muted [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:h-4 [&::-webkit-search-cancel-button]:w-4 [&::-webkit-search-cancel-button]:bg-text-muted [&::-webkit-search-cancel-button]:cursor-pointer [&::-webkit-search-cancel-button]:[mask-image:url(&quot;data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cline%20x1='18'%20y1='6'%20x2='6'%20y2='18'%3E%3C/line%3E%3Cline%20x1='6'%20y1='6'%20x2='18'%20y2='18'%3E%3C/line%3E%3C/svg%3E&quot;)] [&::-webkit-search-cancel-button]:[-webkit-mask-image:url(&quot;data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cline%20x1='18'%20y1='6'%20x2='6'%20y2='18'%3E%3C/line%3E%3Cline%20x1='6'%20y1='6'%20x2='18'%20y2='18'%3E%3C/line%3E%3C/svg%3E&quot;)]"
    />
</div>
