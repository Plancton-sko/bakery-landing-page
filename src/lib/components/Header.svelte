<script lang="ts">
  import { cart } from "$lib/stores/cart";
  import { get } from 'svelte/store';
  import CartModal from "./CartModal.svelte";

  let cartCount = get(cart).length;

  cart.subscribe(items => {
    cartCount = items.length;
  });

  let isCartModalOpen = false;
  let isMenuOpen = false;

  const openCartModal = () => {
    isCartModalOpen = true;
  };

  const closeCartModal = () => {
    isCartModalOpen = false;
  };

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };
</script>

<header>
  <div class="logo">Favo <span class="highlight">D'Mel</span></div>

  <nav class="desktop-nav">
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
      <div class="cart-text">My Cart </div><span class="cart-count">{cartCount}</span>
    </span>
  </div>

  <div class="hamburger" on:click={toggleMenu}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M3 6h18M3 12h18m-18 6h18" stroke="#000" stroke-width="2" stroke-linecap="round" />
    </svg>
  </div>

  {#if isMenuOpen}
    <div class="mobile-menu">
      <button class="close-menu" on:click={toggleMenu}>X</button>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="#our-products">Shop</a></li>
        <li><a href="#about-us">About</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  {/if}

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

  .logo {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .highlight {
    color: #f5c518;
  }

  .desktop-nav ul {
    list-style: none;
    display: flex;
    gap: 25px;
    padding: 0;
    margin: 0;
  }

  .desktop-nav ul li a {
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    color: #555;
    transition: color 0.3s;
  }

  .desktop-nav ul li a:hover {
    color: #f5c518;
  }

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

  .cart-text {
    display: inline;
  }

  .hamburger {
    display: none;
    cursor: pointer;
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 75%;
    height: 100%;
    background: #FDF4E3;
    box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .mobile-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .mobile-menu ul li {
    margin: 20px 0;
  }

  .mobile-menu ul li a {
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .close-menu {
    align-self: flex-end;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: #333;
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }

    .cart-text {
      display: none;
    }

    .hamburger {
      display: flex;
      align-items: center;
    }
  }
</style>
