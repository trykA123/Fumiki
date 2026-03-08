<script lang="ts">
    import { theme } from "$stores/theme";

    let {
        class: className = "",
    }: {
        class?: string;
    } = $props();
</script>

{#if $theme?.decorations?.dividerStyle === "dots"}
    <div
        class={`my-6 flex justify-center items-center gap-2 ${className}`}
        role="separator"
    >
        <span class="block w-1 h-1 bg-text-muted rounded-full opacity-30"
        ></span>
        <span class="block w-1 h-1 bg-text-muted rounded-full opacity-30"
        ></span>
        <span class="block w-1 h-1 bg-text-muted rounded-full opacity-30"
        ></span>
    </div>
{:else if $theme?.decorations?.dividerStyle === "space"}
    <div class={`my-6 h-0 border-none ${className}`} role="separator"></div>
{:else}
    <div
        class={`my-6 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent [mask:url(&quot;data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='4'%3E%3Cpath%20d='M0%202%20Q25%200%2050%202%20Q75%204%20100%202%20Q125%200%20150%202%20Q175%204%20200%202'%20stroke='white'%20stroke-width='3'%20fill='none'/%3E%3C/svg%3E&quot;)_repeat-x] [mask-size:200px_4px] [-webkit-mask:url(&quot;data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='4'%3E%3Cpath%20d='M0%202%20Q25%200%2050%202%20Q75%204%20100%202%20Q125%200%20150%202%20Q175%204%20200%202'%20stroke='white'%20stroke-width='3'%20fill='none'/%3E%3C/svg%3E&quot;)_repeat-x] [-webkit-mask-size:200px_4px] root-kami:h-[1px] root-kami:bg-none root-kami:bg-border-subtle root-kami:[mask:none] root-kami:[-webkit-mask:none] ${className}`}
        role="separator"
    ></div>
{/if}
