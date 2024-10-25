<script lang="ts">
  export let isOpen: boolean; // Indicates if the modal is open
  export let onClose: () => void; // Function to close the modal

  // Detect screen size for mobile responsiveness
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
        <div class="drag-handle"></div> <!-- Drag handle for bottom sheet -->
      {/if}
      <slot></slot>
      <button class="close-button" on:click={closeModal}>Close</button>
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 24px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    transition: transform 0.3s ease;
  }

  .close-button {
    margin-top: 16px;
    background: #007bff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .close-button:hover {
    background: #0056b3;
  }

  /* Bottom Sheet for mobile view */
  .bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100%;
    height: 40%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 16px;
    transition: transform 0.3s ease;
  }

  .drag-handle {
    width: 40px;
    height: 5px;
    background-color: #ccc;
    border-radius: 3px;
    margin: 0 auto 16px auto;
  }

  @media (max-width: 768px) {
    .modal-content {
      max-width: 100%;
      height: 100%;
      border-radius: 0;
    }

    .bottom-sheet {
      height: 50%;
    }
  }
</style>
