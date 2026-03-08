<script lang="ts">
    import type {
        HTMLInputAttributes,
        HTMLTextareaAttributes,
    } from "svelte/elements";

    let {
        value = $bindable(""),
        type = "text",
        size = "md",
        placeholder = "",
        disabled = false,
        class: className = "",
        ...rest
    }: {
        value?: string;
        type?: "text" | "search" | "password" | "textarea";
        size?: "sm" | "md" | "lg" | undefined;
        placeholder?: string;
        disabled?: boolean;
        class?: string;
    } & Omit<HTMLInputAttributes, "size" | "type"> &
        Omit<HTMLTextareaAttributes, "size" | "type"> = $props();

    const baseClass =
        "w-full bg-surface-2 border border-border-medium rounded text-text-primary font-body text-[var(--body-size)] outline-none transition-all duration-200 ease-in-out placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-glow-strong)] disabled:opacity-50 disabled:cursor-not-allowed root-kami:bg-surface-0 root-kami:border-border-strong root-mori:border-none root-mori:shadow-[inset_0_1px_3px_var(--shadow-color)] root-mori:focus:shadow-[inset_0_1px_3px_var(--shadow-color),0_0_0_3px_var(--accent-glow-strong)]";

    const sizeClasses = {
        sm: "px-[12px] py-[8px] h-[34px]",
        md: "px-[14px] py-[10px] h-[40px]",
        lg: "px-[16px] py-[13px] h-[46px]",
    };

    const searchClass =
        "pl-[38px] bg-no-repeat bg-[12px_center] bg-[length:16px]";
    const searchStyle =
        "background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E\");";

    const textareaClass =
        "min-h-[100px] h-auto resize-y leading-[1.6] py-[10px] px-[14px]";

    const computedClass = $derived(
        `
        ${baseClass}
        ${type === "textarea" ? textareaClass : sizeClasses[size || "md"] || sizeClasses.md}
        ${type === "search" ? searchClass : ""}
        ${className}
    `
            .replace(/\s+/g, " ")
            .trim(),
    );
</script>

{#if type === "textarea"}
    <textarea
        bind:value
        {placeholder}
        {disabled}
        class={computedClass}
        {...rest}
    ></textarea>
{:else}
    <input
        bind:value
        {type}
        {placeholder}
        {disabled}
        class={computedClass}
        style={type === "search" ? searchStyle : rest.style || undefined}
        {...rest}
    />
{/if}
