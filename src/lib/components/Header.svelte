<!--src/lib/components/header.svelte-->
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
  <div class="logo">Favo <span class="highlight">D'Mel</span></div>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="#our-products">Shop</a></li>
      <li><a href="#about-us">About</a></li>
      <li><a href="#">Blog</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
  <div class="cart" on:click={openCartModal}>
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
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
  /* Estilização geral do header */
  header {
    font-family: sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background-color: #FDF4E3;
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  /* Estilo da logo */
  .logo {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .highlight {
    color: #f5c518; /* Cor amarela */
  }

  /* Menu de navegação */
  nav ul {
    list-style: none;
    display: flex;
    gap: 25px;
    padding: 0;
    margin: 0;
  }

  nav ul li {
    display: inline-block;
  }

  nav ul li a {
    text-decoration: none;
    /* font-family: sans-serif; */
    font-size: 16px;
    font-weight: 500;
    color: #555;
    position: relative;
    transition: color 0.3s, border-color 0.3s;
  }

  nav ul li a:hover {
    color: #f5c518;
  }

  nav ul li a::after {
    content: "";
    display: block;
    width: 0;
    height: 2px;
    background: #f5c518;
    transition: width 0.3s;
    margin-top: 5px;
  }

  nav ul li a:hover::after {
    width: 100%;
  }

  /* Estilo do botão do carrinho */
  .cart {
    display: flex;
    align-items: center;
    background-color: #eed16a;
    color: #fff;
    padding: 8px 16px;
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .cart:hover {
    background-color: #b29444;
  }

  .cart span {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: bold;
    color: #333;
  }

  svg {
    fill: currentColor;
    width: 20px;
    height: 20px;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    header {
      flex-wrap: wrap;
      padding: 10px 20px;
    }

    .logo {
      flex: 1 0 100%;
      text-align: center;
      margin-bottom: 10px;
    }

    nav ul {
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
    }

    .cart {
      margin-top: 10px;
      align-self: center;
    }
  }
</style>
