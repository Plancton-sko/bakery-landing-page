<!--src/lib/components/OurProducts.svelte-->
<script lang="ts">
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { Categories } from "$lib/enums/Categories";
  import type { Product } from "$lib/types/Product";
  import { products as productStore } from "$lib/stores/products";
  import CategoryNav from "./CategoryNav.svelte";
  import ProductCard from "./ProductCard.svelte";

  export let products: Product[];

  const selectedCategory = writable(Categories.ALL);
  const itemsToShow = writable(8); // Limit for initial products displayed
  const initialLimit = 8; // Default number of products to show
  const increment = 8; // Number of products to add when "See More" is clicked

  const filteredProducts = derived(
    [productStore, selectedCategory],
    ([$productsStore, $selectedCategory]) => {
      if ($selectedCategory === Categories.ALL) {
        return $productsStore;
      }
      return $productsStore.filter(
        (product: Product) => product.category === $selectedCategory
      );
    }
  );

  const limitedProducts = derived(
    [filteredProducts, itemsToShow],
    ([$filteredProducts, $itemsToShow]) => $filteredProducts.slice(0, $itemsToShow)
  );

  onMount(() => {
    productStore.set(products);
  });

  const categoriesList = Object.values(Categories);

  function loadMore() {
    itemsToShow.update((n) => n + increment);
  }

  function showLess() {
    itemsToShow.set(initialLimit);
  }
</script>

<section id="our-products">
  <h2>Our Products</h2>
  <div class="Category">
    <CategoryNav
      categories={categoriesList}
      on:select={(event) => selectedCategory.set(event.detail)}
    />
  </div>
  <div class="product-grid">
    {#each $limitedProducts as product (product.id)}
      <ProductCard {product} />
    {/each}
  </div>
  <div class="controls">
    {#if $limitedProducts.length < $filteredProducts.length}
      <button class="see-more" on:click={loadMore}>See More</button>
    {/if}
    {#if $limitedProducts.length > initialLimit}
      <button class="see-less" on:click={showLess}>See Less</button>
    {/if}
  </div>
</section>

<style>
  /* Section Styles */
  #our-products {
    text-align: center;
    padding: 50px 20px;
    background-color: var(--background-color);
  }

  #our-products h2 {
    font-family: var(--font-primary);
    font-size: 36px;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 20px;
    transition: color var(--transition-time);
  }

  #our-products h2:hover {
    color: var(--secondary-color);
  }

  .Category{
    display: flex;
    justify-content: center;
  }

  /* Product Grid Styles */
  .product-grid {
    display: grid;
    gap: var(--spacing-md);
    margin-top: 20px;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  /* Button Styles */
  .controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }

  .see-more,
  .see-less {
    padding: 10px 20px;
    font-size: 16px;
    color: var(--white-text);
    background-color: var(--primary-color);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color var(--transition-time);
  }

  .see-more:hover,
  .see-less:hover {
    background-color: var(--secondary-color);
  }
  
  /* Breakpoints for responsiveness */
  @media (max-width: 576px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    #our-products h2 {
      font-size: 28px;
    }
  }

  @media (max-width: 430px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
  }

  @media (min-width: 576px) and (max-width: 768px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .product-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .product-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    #our-products h2 {
      font-size: 40px;
    }
  }
</style>
