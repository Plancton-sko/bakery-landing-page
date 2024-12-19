<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Categories } from "$lib/enums/Categories";

  export let categories: Categories[];
  const dispatch = createEventDispatcher();

  let activeCategory: Categories = Categories.ALL;

  function selectCategory(category: Categories) {
    activeCategory = category;
    dispatch("select", category);
  }
</script>

<nav class="product-nav">
  {#each categories as category}
    <button
      class:selected={category === activeCategory}
      on:click={() => selectCategory(category)}
    >
      {category}
    </button>
  {/each}
</nav>



<style>
  /* Layout Principal */
  .product-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap; /* Quebra de linha para listas longas */
    margin-bottom: 20px;
    overflow-x: auto; /* Scroll horizontal em dispositivos menores */
    padding: 0 10px;
  }

  .product-nav button {
    background-color: transparent;
    border: none;
    font-size: 1.1rem;
    color: var(--light-text);
    cursor: pointer;
    padding: var(--button-padding-small);
    transition: color 0.3s ease, border-bottom 0.3s ease;
    border-bottom: 2px solid transparent;
    position: relative;
    white-space: nowrap; /* Evita quebra de texto */
  }

  .product-nav button.selected {
    color: var(--primary-color); /* Destaque para a categoria ativa */
    font-weight: bold;
    border-bottom: 2px solid var(--secondary-color); /* Linha de destaque */
  }

  .product-nav button:hover {
    color: var(--secondary-color);
  }

  .product-nav button::after {
    content: "";
    display: block;
    width: 0;
    height: 2px;
    background: var(--secondary-color);
    transition: width 0.3s;
    margin-top: 5px;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .product-nav button:hover::after {
    width: 100%;
  }

  /* Estilos Responsivos */
  @media (max-width: 768px) {
    .product-nav {
      gap: 10px;
      justify-content: flex-start; /* Alinhamento à esquerda em telas menores */
      overflow-x: scroll; /* Scroll horizontal */
    }

    .product-nav::-webkit-scrollbar {
      height: 6px;
    }

    .product-nav::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 10px;
    }

    .product-nav::-webkit-scrollbar-track {
      background-color: transparent;
    }

    .product-nav button {
      font-size: 0.95rem;
      padding: 8px 12px;
    }
  }

  @media (max-width: 576px) {
    .product-nav {
      gap: 8px;
    }

    .product-nav button {
      font-size: 0.9rem;
      padding: 6px 10px;
    }
  }

  @media (min-width: 1024px) {
    .product-nav {
      gap: 25px;
    }

    .product-nav button {
      font-size: 1.2rem;
    }
  }
</style>
