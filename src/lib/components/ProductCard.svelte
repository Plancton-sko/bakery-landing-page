<!-- src/lib/components/ProductCard.svelte -->
<script lang="ts">
  import type { Product } from "$lib/types/Product";
  import Modal from "$lib/components/Modal.svelte";
    import { addToCart } from "$lib/stores/cart";

  export let product: Product;
  export let isHighlighted: boolean = false;

  let isModalOpen = false;

  // Função para formatar o preço
  const formatPrice = (price: number): string => {
      return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
      }).format(price);
  };

  // Funções para abrir e fechar o modal
  const openModal = () => {
      isModalOpen = true;
  };

  const closeModal = () => {
      isModalOpen = false;
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

<Modal isOpen={isModalOpen} onClose={closeModal}>
  <div class="modal-content">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <img src={product.image} alt={product.name} />
      <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</p>
      <button class="add-to-cart" on:click={() => addToCart(product)}>Adicionar ao Carrinho</button>
  </div>
</Modal>

<style>
  .product-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #ccc;
      padding: 16px;
      border-radius: 8px;
      transition: box-shadow 0.3s ease;
      cursor: pointer; /* Indicando que é interativo */
      width: 100%; /* Ajustar conforme necessário */
  }

  .product-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .product-card img {
      width: 100%;
      max-width: 200px;
      border-radius: 8px;
      height: 200px;
      object-fit: cover; 
  }

  .product-card h3 {
      margin: 16px 0 8px;
      font-size: 1.2rem;
      text-align: center;
  }

  .product-card p {
      font-size: 1rem;
      color: #555;
  }

  .modal-details {
      display: flex;
      flex-direction: column;
      align-items: center;
  }

  .modal-image {
      width: 100%;
      max-width: 400px;
      border-radius: 8px;
      object-fit: cover;
      margin-bottom: 16px;
  }
</style>
