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

    const DRAG_THRESHOLD = 10; // Minimum distance to consider a drag
    const CLOSE_THRESHOLD = 100; // Distance to trigger close action

    const closeBottomSheet = () => {
        document.body.classList.remove('no-scroll');
        isOpen = false;
        onClose();
    };

    const resetBottomSheetPosition = () => {
        if (bottomSheet) {
            bottomSheet.style.transition = 'transform 0.3s ease-in-out';
            bottomSheet.style.transform = 'translateY(0)';
        }
    };

    function handleTouchStart(event: TouchEvent) {
        initialY = event.touches[0].clientY;
        lastY = initialY;
        lastTime = Date.now();
        isDragging = true;
        movedDistance = 0;
        velocity = 0;

        if (bottomSheet) {
            bottomSheet.style.transition = ''; // Remove transition during drag
        }
    }

    function handleTouchMove(event: TouchEvent) {
        if (!isDragging || !bottomSheet) return;

        const currentY = event.touches[0].clientY;
        const deltaY = currentY - initialY;
        movedDistance = Math.abs(deltaY);

        if (deltaY > 0) {
            bottomSheet.style.transform = `translateY(${deltaY}px)`;

            // Calculate velocity
            const now = Date.now();
            const deltaTime = now - lastTime; // Time difference
            velocity = (currentY - lastY) / deltaTime;

            lastY = currentY;
            lastTime = now; // Update last time
        }
    }

    function handleTouchEnd() {
        if (!isDragging || !bottomSheet) return;

        isDragging = false;
        const currentY = parseFloat(bottomSheet.style.transform.replace('translateY(', '').replace('px)', '')) || 0;

        if (currentY > CLOSE_THRESHOLD || velocity > 0.5) {
            closeBottomSheet();
        } else {
            resetBottomSheetPosition();
        }
    }

    onMount(() => {
        if (isOpen) document.body.classList.add('no-scroll');
    });

    onDestroy(() => {
        document.body.classList.remove('no-scroll');
    });

    isCartOpen.subscribe((value) => {
        if (!value) closeBottomSheet();
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
        background: #FFECD1;
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
        height: 4px;
        background-color: #D97A07;
        border-radius: 2px;
        margin: 0 auto 10px auto;
        cursor: grab;
    }

    @media (max-width: 768px) {
        .bottom-sheet {
            max-height: 60%;
        }
    }
</style>


