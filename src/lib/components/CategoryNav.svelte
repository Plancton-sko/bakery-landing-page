<!--
  src/lib/componentes/CategoryNav.svelte
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Categories } from '$lib/enums/Categories';

  export let categories: Categories[];
  const dispatch = createEventDispatcher();

  function selectCategory(category: Categories) {
    dispatch('select', category);
  }
</script>

<nav class="product-nav">
  {#each categories as category}
    <button on:click={() => selectCategory(category)}>
      {category}
    </button>
  {/each}
</nav>

<style>
  .product-nav {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      gap: 20px;
  }

  .product-nav button {
      background-color: transparent;
      border: none;
      font-size: 1rem;
      color: #555;
      cursor: pointer;
      padding: 10px 15px;
      transition: color 0.3s ease, border-bottom 0.3s ease;
      border-bottom: 2px solid transparent;
  }

  .product-nav button.selected {
      color: #000;
      font-weight: bold;
      border-bottom: 2px solid #000;
  }

  .product-nav button:hover {
      color: #000;
      border-bottom: 2px solid #000;
  }

  @media (max-width: 768px) {
      .product-nav {
          flex-direction: column;
          gap: 10px;
      }

      .product-nav button {
          padding: 8px 10px;
          font-size: 0.9rem;
      }
  }


</style>
