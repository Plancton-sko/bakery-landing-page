<!--src/li/components/BottomSheets.svelte-->
<script lang="ts">
    import { onMount } from 'svelte';
    import { isCartOpen } from '$lib/stores/cart';

    export let isOpen = false;
    export let onClose = () => {};

    const handleOverlayClick = () => onClose();

    // Close the bottom sheet if `isCartOpen` becomes false
    onMount(() => {
        isCartOpen.subscribe((value) => {
            if (!value) onClose();
        });
    });
</script>

{#if isOpen}
<div class="overlay" on:click={handleOverlayClick}></div>
<div class="bottom-sheet">
    <slot></slot>
</div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .bottom-sheet {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        padding: 20px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        box-shadow: 0px -2px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateY(0);
        transition: transform 0.3s ease-in-out;
    }
</style>
