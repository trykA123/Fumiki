<script lang="ts">
    import { toast } from "$lib/stores/toast";

    let {
        id,
        intent = "info",
        message,
        duration = 4000,
        class: className = "",
    }: {
        id: string;
        intent?: "info" | "success" | "error" | "warning";
        message: string;
        duration?: number;
        class?: string;
    } = $props();

    function dismiss() {
        toast.remove(id);
    }
</script>

<div
    class={`inline-flex items-center justify-between gap-3 px-5 py-3 bg-surface-2 border border-border-medium border-l-[3px] rounded-[var(--radius)] shadow-[0_8px_24px_var(--shadow-color)] text-[var(--body-sm-size)] text-text-primary max-w-[380px] ${
        intent === "success"
            ? "!border-l-[var(--success)]"
            : intent === "error"
              ? "!border-l-[var(--error)]"
              : intent === "warning"
                ? "!border-l-[var(--warning)]"
                : intent === "info"
                  ? "!border-l-[#3b82f6]"
                  : ""
    } ${className}`}
    role="alert"
>
    <span>{message}</span>
    <button
        onclick={dismiss}
        class="bg-transparent border-none text-text-muted text-[16px] cursor-pointer leading-none p-0 transition-colors duration-200 hover:text-text-primary"
        aria-label="Close message">×</button
    >
</div>
