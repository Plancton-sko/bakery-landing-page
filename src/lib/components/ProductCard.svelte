<!--src/li/components/ProductCard.svelte-->
<script lang="ts">
  import { onMount } from 'svelte'; // Add this line to import onMount
  import type { Product } from "$lib/types/Product";
  import Modal from "$lib/components/Modal.svelte";
  import BottomSheet from "$lib/components/BottomSheet.svelte";
  import { addToCart, isCartOpen } from "$lib/stores/cart";
  import { formatPrice } from "$lib/utils/format";

  export let product: Product;
  export let isHighlighted: boolean = false;

  let isModalOpen = false;
  let quantity = 1;
  let isMobile = false;

  // Check if screen is mobile on mount
  onMount(() => {
      isMobile = window.innerWidth <= 768;
      window.addEventListener('resize', () => {
          isMobile = window.innerWidth <= 768;
      });
  });

  const openModal = () => {
      isModalOpen = true;
  };

  const closeModal = () => {
      isModalOpen = false;
  };

  const handleAddToCart = () => {
      addToCart(product, quantity);
      isCartOpen.set(true);
      closeModal();
  };
</script>

<button
  class="product-card {isHighlighted ? 'highlight' : ''}"
  on:click={openModal}
  type="button"
>
  <img src="{product.image}" alt={product.name} loading="lazy"/>
  <h3>{product.name}</h3>
  <p>{formatPrice(product.price)}</p>
</button>

<!-- Conditional rendering for Modal on desktop and BottomSheet on mobile -->
{#if isMobile}
  <BottomSheet isOpen={isModalOpen} onClose={closeModal}>
      <div class="bottomSheet-content">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <img src="{product.image}" alt={product.name} class="imgBottomSheet"/>
          <p>{formatPrice(product.price)}</p>
          <label for="quantity">Quantity:</label>
          <input
              type="number"
              id="quantity"
              bind:value={quantity}
              min="1"
              class="quantity-input"
          />

          <button class="add-to-cart" on:click={handleAddToCart}>Add to Cart</button>
      </div>
  </BottomSheet>
{:else}
  <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div class="modal-content">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <img src={product.image} alt={product.name} class="imgModal" loading="lazy" />
          <p>{formatPrice(product.price)}</p>

          <label for="quantity">Quantity:</label>
          <input
              type="number"
              id="quantity"
              bind:value={quantity}
              min="1"
              class="quantity-input"
          />

          <button class="add-to-cart" on:click={handleAddToCart}>Add to Cart</button>
      </div>
  </Modal>
{/if}

 
<style>

  .product-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    border: 1px solid #ccc;
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    background: #fdfdfd;
    transition: box-shadow 0.3s ease, transform 0.2s ease;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .product-card:hover {
    box-shadow:var(--box-shadow-intense);
    transform: translateY(-3px);
  }

  .product-card img {
    width: 100%;
    max-width: 240px;
    height: 240px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: var(--box-shadow-medium);
  }

  .product-card h3 {
    font-family: var(--font-primary);
    font-size: clamp(16px, 4vw, 20px);
    font-weight: bold;
    color: var(--primary-color);
    margin: 16px 0 8px;
    text-align: center;
  }

  .product-card p {
    font-family: var(--font-primary);
    font-size: clamp(14px, 3.5vw, 16px);
    color: var(--light-text);
    text-align: center;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    font-family: var(--font-primary);
    max-width: 600px;
    margin: auto;
  }

  .bottomSheet-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border-radius: var(--border-radius);
    font-family: var(--font-primary);
  }
  

  .imgBottomSheet {
    max-width: 400px;
    max-height: 400px;
    border-radius: var(--border-radius-medium);
    box-shadow: var(--box-shadow-medium);
    margin-bottom: 20px;
  }

  .imgModal {
    max-width: 500px;
    max-height: 350px;
    border-radius: var(--border-radius-medium);
    box-shadow: var(--box-shadow-medium);
    margin-bottom: 20px;
  }

  .quantity-input {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-sm);
    width: 60px;
    text-align: center;
    border-radius: var(--border-radius-medium);
    border: 1px solid #ccc;
    font-size: 16px;
    transition: border-color 0.3s;
  }

  .quantity-input:focus {
    border-color: var(--button-background);
    outline: none;
    box-shadow: 0 0 5px rgba(235, 185, 22, 0.3);
  }

  .add-to-cart {
    margin-top: var(--spacing-md);
    background-color: var(--button-background);
    color: var(--white-text);
    font-size: 16px;
    padding: var(--button-padding);
    border: none;
    border-radius: var(--border-radius-small);
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  .add-to-cart:hover {
    background-color: var(--button-background-hover);
    transform: scale(1.05);
  }

  </style>