<script lang="ts">
  import { cart } from "$lib/stores/cart";
  import { get } from 'svelte/store';
    import CartModal from "./CartModal.svelte";

  // Atualiza o valor de cartCount baseado no número de itens no carrinho
  let cartCount = get(cart).length;

  // Se inscreve no store para atualizar cartCount automaticamente
  cart.subscribe(items => {
    cartCount = items.length;
  });

  let isCartModalOpen = false;

  const openCartModal = () => {
    isCartModalOpen = true;
  };

  const closeCartModal = () => {
    isCartModalOpen = false;
  };
</script>

<header>
  <div class="logo">Bread <span class="highlight">Bakery</span></div>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="#">Shop</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Blog</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
  <div class="cart" on:click={openCartModal}>
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M3.87289 17.0194L2.66933 9.83981C2.48735 8.75428 2.39637 8.21152 2.68773 7.85576C2.9791 7.5 3.51461 7.5 4.58564 7.5H19.4144C20.4854 7.5 21.0209 7.5 21.3123 7.85576C21.6036 8.21152 21.5126 8.75428 21.3307 9.83981L20.1271 17.0194C19.7282 19.3991 19.5287 20.5889 18.7143 21.2945C17.9 22 16.726 22 14.3782 22H9.62182C7.27396 22 6.10003 22 5.28565 21.2945C4.47127 20.5889 4.27181 19.3991 3.87289 17.0194Z" stroke="currentColor" stroke-width="1.5" />
        <path d="M17.5 7.5C17.5 4.46243 15.0376 2 12 2C8.96243 2 6.5 4.46243 6.5 7.5" stroke="currentColor" stroke-width="1.5" />
      </svg>
      My Cart ({cartCount})
    </span>
  </div>

  <!-- Modal do Carrinho -->
  {#if isCartModalOpen}
    <CartModal {closeCartModal} />
  {/if}
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #fff;
    border-bottom: 2px solid #f0f0f0;
  }

  .logo {
    font-size: 20px;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
  }

  .highlight {
    color: #f5c518; /* Cor amarela */
  }

  nav ul {
    list-style: none;
    display: flex;
    gap: 20px;
    padding: 0;
    margin: 0;
  }

  nav ul li {
    display: inline;
  }

  nav ul li a {
    text-decoration: none;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    color: #333;
  }

  nav ul li a:hover {
    color: #007bff; /* Cor azul para indicar o link ativo */
    border-bottom: 2px solid #007bff;
  }

  .cart {
    display: flex;
    align-items: center;
    font-family: 'Roboto', sans-serif;
    background-color: #f8f8f8;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .cart span {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 16px;
    color: #070707;
    background-color: #e2cf96;
    padding: 5px;
    border-radius: 5px;
  }

  .cart span:hover {
    background-color: #b29444;
    color: white;
  }

  svg {
    color: #111111; /* Cor do ícone */
  }
</style>
