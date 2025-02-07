<!--src/lib/components/Modal.svelte-->
<script lang="ts">
  export let isOpen: boolean;
  export let onClose: () => void;

  let isMobile = false;
  if (typeof window !== 'undefined') {
    isMobile = window.innerWidth <= 768;
  }

  const closeModal = () => onClose();
</script>

{#if isOpen}
  <div
    class="modal-overlay"
    tabindex="-1"
    on:click={closeModal}
    aria-hidden={!isOpen}
  >
    <div
      class="modal-content {isMobile ? 'bottom-sheet' : ''}" 
      role="dialog"
      aria-modal="true"
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
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in;
  }

  .modal-content {
    background: var(--gradient-primary);
    padding: 30px;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    text-align: center;
    box-shadow: var(--box-shadow-intense);
    animation: slideIn 0.3s ease-in;
  }

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
    background: var(--gradient-primary);
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease-in-out;
  }

  .drag-handle {
    width: 50px;
    height: 5px;
    background-color: var(--highlight-color);
    border-radius: 3px;
    margin: 0 auto 12px auto;
  }

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

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
</style>