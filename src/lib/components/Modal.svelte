<!--src/lib/components/Modal.svelte-->
<script lang="ts">
  export let isOpen: boolean;
  export let onClose: () => void;

  let isMobile = false;
  if (typeof window !== 'undefined') {
    isMobile = window.innerWidth <= 768;
  }

  const closeModal = () => {
    onClose();
  };
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={closeModal}>
    <div
      class="modal-content {isMobile ? 'bottom-sheet' : ''}" 
      on:click|stopPropagation
    >
      {#if isMobile}
        <div class="drag-handle"></div>
      {/if}
      <slot></slot>
    </div>
  </div>
{/if}

<style>
   /* Overlay com o fundo escuro */
   .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7); /* Fundo mais escuro */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in;
  }

  /* Conteúdo do modal com estilo similar ao CartModal */
  .modal-content {
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    text-align: center;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-in;
  }

  /* Estilo de bottom-sheet para mobile */
  .bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100%;
    height: 50%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  }

  .drag-handle {
    width: 50px;
    height: 5px;
    background-color: #beb7b7;
    border-radius: 3px;
    margin: 0 auto 12px auto;
  }

  /* Animações de fade e slide */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>