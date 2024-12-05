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
    <div class="drag-indicator"></div>
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
        background: #FFECD1; /* Consistente com AboutUs */
        padding: 20px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        box-shadow: 0px -2px 12px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateY(0);
        transition: transform 0.3s ease-in-out;

        /* Altura reduzida */
        max-height: 50%; 
        overflow-y: auto; /* Adiciona scroll se o conteúdo exceder o espaço */
    }

    .drag-indicator {
        width: 60px;
        height: 4px;
        background-color: #D97A07; /* Cor harmonizada */
        border-radius: 2px;
        margin: 0 auto 10px auto;
    }

    .bottom-sheet > slot {
        color: #6B4226;
        font-family: 'Roboto', sans-serif;
    }

    /* Responsividade */
    @media (max-width: 768px) {
        .bottom-sheet {
            max-height: 60%; /* Maior altura em telas menores para mais espaço */
        }
    }
</style>
