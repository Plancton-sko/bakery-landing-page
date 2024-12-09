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

  onMount(() => {
    productStore.set(products);
  });

  const categoriesList = Object.values(Categories);
</script>

<section id="our-products">
  <h2>Our Products</h2>

  <CategoryNav
    categories={categoriesList}
    on:select={(event) => selectedCategory.set(event.detail)}
  />

  <div class="product-grid">
    {#each $filteredProducts as product (product.id)}
      <ProductCard {product} />
    {/each}
  </div>
</section>

<style>
  /* Section Styles */
  #our-products {
    text-align: center;
    padding: 50px 20px;
    background-color: var(--background-color); /* Usando variável de fundo */
  }

  #our-products h2 {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: bold;
    color: var(--primary-color); /* Usando cor primária */
    margin-bottom: 20px;
    transition: color var(--transition-time); /* Transição suave para hover */
  }

  #our-products h2:hover {
    color: var(--secondary-color); /* Destaque ao passar o mouse */
  }

  /* Product Grid Styles */
  .product-grid {
    display: grid;
    gap: 20px;
    margin-top: 20px;
    width: 100%;
  }

  /* Breakpoints for responsiveness */
  @media (max-width: 576px) {
    .product-grid {
      grid-template-columns: 1fr;
    }

    #our-products h2 {
      font-size: 28px;
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
