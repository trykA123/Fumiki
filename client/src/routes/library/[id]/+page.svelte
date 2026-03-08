<script lang="ts">
    import { book as bookStore } from "$lib/stores/book";
    import BookCover from "$lib/components/ui/BookCover.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Tag from "$lib/components/ui/Tag.svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
    import ChapterList from "$lib/components/library/ChapterList.svelte";
    import SummaryCard from "$lib/components/library/SummaryCard.svelte";
    import Skeleton from "$lib/components/ui/Skeleton.svelte";
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";

    let { data } = $props();

    $effect(() => {
        if (data && data.id) {
            bookStore.load(data.id);
        }
    });

    function formatTimeLeft(progress: number, duration: number | null): string {
        if (!duration || duration === 0) return "";
        const timeLeft = duration * (1 - progress);
        const h = Math.floor(timeLeft / 3600);
        const m = Math.floor((timeLeft % 3600) / 60);
        if (h > 0) return `${h}h ${m}m left`;
        return `${m}m left`;
    }
</script>

<div
    class="relative w-full min-h-full z-0 pb-[env(safe-area-inset-bottom,0px)]"
>
    <div
        class="relative z-10 px-[var(--page-padding-x,theme(spacing.4))] py-4 max-w-[var(--page-max-width,1000px)] mx-auto flex flex-col gap-4"
    >
        <header class="flex items-center">
            <Button variant="ghost" size="sm" href="/library">← Back</Button>
        </header>

        {#if $bookStore.loading && !$bookStore.data}
            <div class="skeleton-layout">
                <div class="skeleton-cover">
                    <Skeleton variant="cover" />
                </div>
                <div class="skeleton-meta">
                    <Skeleton
                        variant="text"
                        style="width: 80%; height: 2rem;"
                    />
                    <Skeleton
                        variant="text"
                        style="width: 60%; height: 1.5rem;"
                    />
                    <Skeleton
                        variant="text"
                        style="width: 40%; height: 1.25rem;"
                    />
                </div>
            </div>
        {:else if $bookStore.error}
            <div class="error-state">
                <p>{$bookStore.error}</p>
                <Button variant="ghost" onclick={() => bookStore.load(data.id)}
                    >Retry</Button
                >
            </div>
        {:else if $bookStore.data}
            {@const book = $bookStore.data}

            <div
                class="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] -z-10 overflow-hidden pointer-events-none"
                style="mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%); -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%);"
            >
                <img
                    src={book.coverUrl}
                    alt=""
                    class="w-full h-full object-cover opacity-50 blur-[40px] saturate-150 scale-125"
                    aria-hidden="true"
                />
            </div>

            <div
                class="flex flex-col md:flex-row md:items-start mx-2 gap-6 md:gap-8"
            >
                <div
                    class="flex-none md:w-[240px] md:sticky md:top-[calc(env(safe-area-inset-top)+theme(spacing.6))] flex flex-col gap-6"
                >
                    <div
                        class="flex justify-center md:block mb-2 md:mb-0 max-w-[200px] md:max-w-none mx-auto w-full"
                    >
                        <BookCover
                            src={book.coverUrl}
                            size="lg"
                            alt={book.title}
                        />
                    </div>

                    <div
                        class="flex flex-col gap-2 max-md:items-center max-md:text-center"
                    >
                        <h1
                            class="font-display text-2xl font-semibold text-text-primary m-0 leading-[1.2]"
                        >
                            {book.title}
                        </h1>
                        {#if book.subtitle}
                            <h2
                                class="font-body text-base font-normal text-text-secondary m-0 leading-[1.3]"
                            >
                                {book.subtitle}
                            </h2>
                        {/if}
                        <div
                            class="flex flex-wrap max-md:justify-center items-baseline gap-1 mt-1"
                        >
                            <span
                                class="font-medium text-text-primary text-base"
                                >{book.author}</span
                            >
                            {#if book.narrator}
                                <span class="text-text-muted text-sm ml-1"
                                    >narrated by {book.narrator}</span
                                >
                            {/if}
                        </div>
                        <div
                            class="flex flex-wrap max-md:justify-center items-center gap-2 mt-1 text-sm text-text-muted"
                        >
                            {#if book.duration}
                                <span
                                    >{Math.floor(book.duration / 3600)}h {Math.floor(
                                        (book.duration % 3600) / 60,
                                    )}m</span
                                >
                            {/if}
                            {#if book.duration && book.pages}
                                <span class="separator">·</span>
                            {/if}
                            {#if book.pages}
                                <span>{book.pages} pages</span>
                            {/if}
                        </div>
                    </div>

                    <div class="hidden md:block">
                        <div class="flex flex-wrap gap-2">
                            {#if book.primaryCategory}
                                <Tag intent="accent">{book.primaryCategory}</Tag
                                >
                            {/if}
                            {#if book.secondaryCategory}
                                <Tag>{book.secondaryCategory}</Tag>
                            {/if}
                        </div>
                    </div>
                </div>

                <div class="flex-1 flex flex-col gap-8 min-w-0">
                    <div class="flex flex-row flex-wrap gap-3">
                        {#if book.mediaType === "audiobook" || book.mediaType === "both"}
                            <Button
                                variant="primary"
                                size="lg"
                                href={`/player/${book.id}`}>▶ Play</Button
                            >
                        {/if}
                        {#if book.mediaType === "ebook" || book.mediaType === "both"}
                            <Button
                                variant="secondary"
                                size="lg"
                                href={`/reader/${book.id}`}>📖 Read</Button
                            >
                        {/if}
                        <Button
                            variant="ghost"
                            size="lg"
                            href={`/notes/${book.id}`}>📝 Notes</Button
                        >
                    </div>

                    {#if book.progress > 0}
                        <div class="flex flex-col gap-2">
                            <div
                                class="flex justify-between items-baseline text-sm"
                            >
                                <span class="font-medium text-text-primary"
                                    >{Math.round(book.progress * 100)}%</span
                                >
                                <span class="text-text-muted"
                                    >{formatTimeLeft(
                                        book.progress,
                                        book.duration,
                                    )}</span
                                >
                            </div>
                            <ProgressBar
                                value={Math.round(book.progress * 100)}
                                max={100}
                                size="md"
                            />
                        </div>
                    {/if}

                    <div class="md:hidden block">
                        <div class="flex flex-wrap gap-2">
                            {#if book.primaryCategory && book.primaryCategory !== "Uncategorized"}
                                <Tag intent="accent">{book.primaryCategory}</Tag
                                >
                            {/if}
                            {#if book.secondaryCategory}
                                <Tag>{book.secondaryCategory}</Tag>
                            {/if}
                            {#if book.genres && book.genres.length > 0}
                                <Tag>{book.genres[0]}</Tag>
                            {/if}
                        </div>
                    </div>

                    {#if book.description}
                        <div class="flex flex-col gap-4">
                            <SectionHeader title="Description" />
                            <p
                                class="ext-base text-text-secondary leading-[1.6] whitespace-pre-wrap"
                            >
                                {book.description}
                            </p>
                        </div>
                    {/if}

                    {#if book.chapters && book.chapters.length > 0}
                        <ChapterList
                            chapters={book.chapters}
                            currentTime={book.currentTime || 0}
                            isAudiobook={book.mediaType === "audiobook" ||
                                book.mediaType === "both"}
                        />
                    {/if}

                    <SummaryCard bookId={book.id} />

                    <div class="flex flex-col gap-4">
                        <SectionHeader
                            title={`Notes (${book.noteCount || 0})`}
                        />
                        <p class="text-text-muted text-sm italic">
                            Notes will appear here.
                        </p>
                    </div>

                    <div class="flex flex-col gap-4">
                        <SectionHeader title="Metadata" />
                        <ul class="list-none p-0 m-0 flex flex-col gap-2">
                            {#if book.publisher}<li
                                    class="text-base text-text-secondary flex gap-2"
                                >
                                    <strong
                                        class="font-medium text-text-primary min-w-[80px]"
                                        >Publisher:</strong
                                    >
                                    {book.publisher}
                                </li>{/if}
                            {#if book.publishedYear}<li
                                    class="text-base text-text-secondary flex gap-2"
                                >
                                    <strong
                                        class="font-medium text-text-primary min-w-[80px]"
                                        >Year:</strong
                                    >
                                    {book.publishedYear}
                                </li>{/if}
                            {#if book.isbn}<li
                                    class="text-base text-text-secondary flex gap-2"
                                >
                                    <strong
                                        class="font-medium text-text-primary min-w-[80px]"
                                        >ISBN:</strong
                                    >
                                    {book.isbn}
                                </li>{/if}
                            {#if book.genres && book.genres.length > 0}<li
                                    class="text-base text-text-secondary flex gap-2"
                                >
                                    <strong
                                        class="font-medium text-text-primary min-w-[80px]"
                                        >Genres:</strong
                                    >
                                    {book.genres.join(", ")}
                                </li>{/if}
                        </ul>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
