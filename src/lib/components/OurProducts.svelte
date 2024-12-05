<!--src/lib/components/OurProducts.svelte-->
<script lang="ts">
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { Categories } from "$lib/enums/Categories";
  import type { Product } from "$lib/types/Product";
  import { products as productStore } from "$lib/stores/products"; // Importa a store de produtos
  import CategoryNav from "./CategoryNav.svelte"; // Importa o componente de navegação de categorias
  import ProductCard from "./ProductCard.svelte"; // Importa o novo componente ProductCard

  export let products: Product[]; // Produtos recebidos como propriedade

  const selectedCategory = writable(Categories.ALL);

  // Store derivada para produtos filtrados com base na categoria
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

  // Carrega os produtos na store quando o componente monta
  onMount(() => {
    productStore.set(products);
  });

  // Array de categorias para passar ao componente de navegação
  const categoriesList = Object.values(Categories);
</script>

<section id="our-products">
  <h2>Our Products</h2>

  <!-- Componente de Navegação de Categorias -->
  <CategoryNav
    categories={categoriesList}
    on:select={(event) => selectedCategory.set(event.detail)}
  />

  <!-- Grade de Produtos Filtrados -->
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
    background-color: #FDF4E3; /* Cream background */
  }

  #our-products h2 {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: bold;
    color: #6B4226; /* Dark brown */
    margin-bottom: 20px;
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
