<script lang="ts">
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";
  
    // Props para o bottom sheet
    export let isOpen = false;
    export let onClose: () => void;
  
    // Controle da posição do Bottom Sheet
    let yPosition = tweened(100, {
      duration: 300,
      easing: cubicOut,
    });
  
    // Função para abrir o Bottom Sheet
    const openSheet = () => {
      yPosition.set(0); // Deslizar para cima
    };
  
    // Função para fechar o Bottom Sheet
    const closeSheet = () => {
      yPosition.set(100); // Deslizar para baixo
      setTimeout(onClose, 300); // Chamando o onClose após a transição
    };
  
    // Atualizar a posição do modal baseado no estado "isOpen"
    $: if (isOpen) {
      openSheet();
    } else {
      closeSheet();
    }
  
    // Lógica de arrastar
    let startY: number;
    let currentY: number;
  
    const startDrag = (event: TouchEvent | MouseEvent) => {
      startY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;
    };
  
    const drag = (event: TouchEvent | MouseEvent) => {
      const moveY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;
      currentY = moveY - startY;
  
      if (currentY > 0) {
        yPosition.set((currentY / window.innerHeight) * 100); // Atualiza a posição do bottom sheet
      }
    };
  
    const endDrag = () => {
      if (currentY > window.innerHeight * 0.3) {
        closeSheet(); // Se o usuário arrastar mais de 30%, fecha
      } else {
        openSheet(); // Caso contrário, retorna à posição original
      }
    };
  
    onMount(() => {
      if (isOpen) {
        openSheet();
      }
    });
  </script>
  
  <!-- Estrutura do Bottom Sheet -->
  <div
    class="backdrop {isOpen ? 'active' : ''}"
    on:click={closeSheet}
    style:opacity={$yPosition / 100}
  ></div>
  
  <div
    class="bottom-sheet"
    style:transform={`translateY(${$yPosition}%)`}
    on:touchstart={startDrag}
    on:touchmove={drag}
    on:touchend={endDrag}
    on:mousedown={startDrag}
    on:mousemove={drag}
    on:mouseup={endDrag}
  >
    <div class="handle"></div>
    <slot></slot>
  </div>
  
  <style>
    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
      z-index: 9;
    }
  
    .backdrop.active {
      visibility: visible;
    }
  
    .bottom-sheet {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      transition: transform 0.3s ease;
      z-index: 10;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    }
  
    .handle {
      width: 50px;
      height: 6px;
      background: #ccc;
      border-radius: 3px;
      margin: 10px auto;
      cursor: grab;
    }
  </style>
  