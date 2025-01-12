<!-- src/lib/components/BottomSheet.svelte -->
<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import { isCartOpen } from '$lib/stores/cart';

    const dispatch = createEventDispatcher();
    export let isOpen = false;
    export let onClose = () => {};

    let bottomSheet: HTMLDivElement | null = null;
    let initialY = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocity = 0;
    let isDragging = false;
    let movedDistance = 0;

    const DRAG_THRESHOLD = 10; // Distância mínima para considerar como drag
    const CLOSE_THRESHOLD = 100; // Distância para acionar fechamento

    const closeBottomSheet = () => {
        document.body.classList.remove('no-scroll');
        dispatch('close'); // Notifica o componente pai
        onClose();
    };

    const resetBottomSheetPosition = () => {
        if (bottomSheet) {
            bottomSheet.style.transition = 'transform 0.3s ease-in-out';
            bottomSheet.style.transform = 'translateY(0)';
        }
    };

    function handleTouchStart(event: TouchEvent) {
    // Evita que o evento toque propague para outros elementos
    event.stopPropagation();

    // Captura as variáveis necessárias diretamente
    const touch = event.touches[0];

    // Inicializa variáveis de controle
    initialY = lastY = touch.clientY;
    lastTime = Date.now();
    isDragging = true;
    movedDistance = velocity = 0;

    // Remove a transição do estilo para evitar atrasos na movimentação
    bottomSheet?.style.setProperty('transition', 'none');
    }

    function handleTouchMove(event: TouchEvent) {
        event.preventDefault(); // Evita comportamento padrão, como rolagem
        event.stopPropagation(); // Impede propagação para outros elementos

        if (!isDragging || !bottomSheet) return;

        const currentY = event.touches[0].clientY;
        const deltaY = currentY - initialY;
        movedDistance = Math.abs(deltaY);

        if (deltaY > 0) {
            bottomSheet.style.transform = `translateY(${deltaY}px)`;

            // Calcula a velocidade
            const now = Date.now();
            const deltaTime = now - lastTime || 1; // Evita divisão por zero
            velocity = (currentY - lastY) / deltaTime;
            lastY = currentY;
            lastTime = now;
        }
    }

    function handleTouchEnd(event: TouchEvent) {
        event.stopPropagation(); // Impede propagação para outros elementos

        if (!isDragging || !bottomSheet) return;

        isDragging = false;
        const transform = bottomSheet.style.transform || 'translateY(0px)';
        const currentY = parseFloat(transform.replace('translateY(', '').replace('px)', '')) || 0;

        if (currentY > CLOSE_THRESHOLD || velocity > 0.5) {
            closeBottomSheet();
        } else {
            resetBottomSheetPosition();
        }
    }

    let unsubscribe: () => void;

    onMount(() => {
        if (isOpen) document.body.classList.add('no-scroll');
        unsubscribe = isCartOpen.subscribe((value) => {
            if (!value) closeBottomSheet();
        });
    });

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
        document.body.classList.remove('no-scroll');
    });
</script>

{#if isOpen}
<div class="overlay" on:click={closeBottomSheet}></div>
<div
    bind:this={bottomSheet}
    class="bottom-sheet"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
>
    <div class="drag-handle"></div>
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
        background: var(--background-color);
        padding: 20px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        box-shadow: 0px -2px 12px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateY(0);
        transition: transform 0.3s ease-in-out;
        max-height: 50%;
        overflow-y: auto;
    }

    .drag-handle {
        width: 60px;
        height: 6px;
        background-color: var(--second-button-color);
        border-radius: 3px;
        margin: 0 auto 10px auto;
        cursor: grab;
        touch-action: none; /* Garante que toques não sejam interpretados como rolagem */
    }

    @media (max-width: 768px) {
        .bottom-sheet {
            max-height: 60%;
        }
    }
</style>
