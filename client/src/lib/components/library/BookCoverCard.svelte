<script lang="ts">
    import type { Book } from "$lib/stores/library";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
    import Icon from "$lib/components/Icon.svelte";

    let { book }: { book: Book } = $props();

    // Default to the detail view, but could be overridden if dual formats need special handling
    let targetUrl = $derived(`/library/${book.id}`);
</script>

<a
    href={targetUrl}
    class="flex flex-col gap-2 no-underline text-inherit relative group"
    aria-label={`View details for ${book.title}`}
>
    <div
        class="relative w-full max-w-full aspect-[1/1.5] rounded-sm block shrink-0 overflow-hidden bg-surface-2 shadow-sm transition-all duration-200 group-hover:-translate-y-[2px] group-hover:shadow-md group-active:translate-y-0 group-active:duration-[100ms] group-active:shadow-sm"
    >
        <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            onload={(e) =>
                (e.target as HTMLImageElement).classList.add("loaded")}
            onerror={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
                if (img.nextElementSibling) {
                    img.nextElementSibling.classList.add("visible");
                }
            }}
            loading="lazy"
            class="w-full h-full object-cover opacity-0 transition-opacity duration-200 relative z-10 block [&.loaded]:opacity-100"
        />
        <div
            class="absolute inset-0 flex items-center justify-center p-3 bg-gradient-to-br from-surface-2 to-surface-3 text-center z-[1] opacity-0 [&.visible]:opacity-100"
        >
            <span
                class="font-serif text-sm font-medium text-text-muted line-clamp-4"
                >{book.title}</span
            >
        </div>

        {#if book.mediaType === "both"}
            <div
                class="absolute top-2 right-2 bg-black/65 backdrop-blur-[4px] text-white p-1 rounded-sm z-20 flex items-center justify-center flex-row gap-[2px] px-[6px]"
                aria-label="Audiobook and Ebook"
            >
                <Icon name="play" size={12} />
                <Icon name="library" size={12} />
            </div>
        {:else if book.mediaType === "audiobook"}
            <div
                class="absolute top-2 right-2 bg-black/65 backdrop-blur-[4px] text-white p-1 rounded-sm z-20 flex items-center justify-center"
                aria-label="Audiobook"
            >
                <Icon name="play" size={12} />
            </div>
        {:else if book.mediaType === "ebook"}
            <div
                class="absolute top-2 right-2 bg-black/65 backdrop-blur-[4px] text-white p-1 rounded-sm z-20 flex items-center justify-center"
                aria-label="Ebook"
            >
                <Icon name="library" size={12} />
            </div>
        {/if}

        {#if book.progress > 0 && book.progress < 1}
            <div
                class="absolute bottom-0 left-0 right-0 h-1 z-20 [&_.progress-container]:h-full [&_.progress-container]:rounded-none"
            >
                <ProgressBar
                    value={book.progress * 100}
                    max={100}
                    intent="accent"
                />
            </div>
        {/if}
    </div>

    <div class="flex flex-col gap-[2px]">
        <h3
            class="font-sans text-sm font-semibold text-text-base m-0 leading-tight line-clamp-2"
            title={book.title}
        >
            {book.title}
        </h3>
        <p
            class="text-xs text-text-muted m-0 whitespace-nowrap overflow-hidden text-ellipsis"
            title={book.author}
        >
            {book.author}
        </p>
    </div>
</a>
