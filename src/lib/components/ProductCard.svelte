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
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p>{formatPrice(product.price)}</p>
</button>

<!-- Conditional rendering for Modal on desktop and BottomSheet on mobile -->
{#if isMobile}
  <BottomSheet isOpen={isModalOpen} onClose={closeModal}>
      <div class="modal-content">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <img src={product.image} alt={product.name} class="imgModal" />
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
          <img src={product.image} alt={product.name} class="imgModal" />
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
    align-items: center;
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 12px;
    background: #fdfdfd;
    transition: box-shadow 0.3s ease, transform 0.2s ease;
    cursor: pointer;
    width: 100%;
  }

  .product-card:hover {
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }

  .product-card img {
    width: 100%;
    max-width: 240px;
    height: 240px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }

  .product-card h3 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: bold;
    color: #6b4226;
    margin: 16px 0 8px;
    text-align: center;
  }

  .product-card p {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    color: #555;
    text-align: center;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    border-radius: 12px;
    font-family: 'Roboto', sans-serif;
    background: #fff;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
  }

  .imgModal {
    max-width: 500px;
    max-height: 350px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .quantity-input {
    margin-top: 8px;
    padding: 8px;
    width: 60px;
    text-align: center;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    transition: border-color 0.3s;
  }

  .quantity-input:focus {
    border-color: #ebb916;
    outline: none;
    box-shadow: 0 0 5px rgba(235, 185, 22, 0.3);
  }

  .add-to-cart {
    margin-top: 16px;
    background-color: #ebb916;
    color: white;
    font-size: 16px;
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  .add-to-cart:hover {
    background-color: #d6a514;
    transform: scale(1.05);
  }
  </style>
  