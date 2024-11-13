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
  /* Estilo da seção de produtos */
  #our-products {
    text-align: center;
    padding: 40px 20px;
    background-color: #fdfdfd;
  }

  #our-products h2 {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
  }

  /* Estilo da grade de produtos */
  .product-grid {
    display: grid;
    gap: 24px;
    margin-top: 32px;
  }

  /* Definindo diferentes breakpoints */
  @media (min-width: 576px) {
    .product-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
  }

  @media (min-width: 768px) {
    .product-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 32px;
    }

    #our-products {
      padding: 60px 40px;
    }
  }

  @media (min-width: 1024px) {
    .product-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    #our-products h2 {
      font-size: 3rem;
    }
  }



  /* Melhorias de responsividade geral */
  @media (max-width: 576px) {
    .product-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .product-card {
      padding: 16px;
    }

    #our-products h2 {
      font-size: 2rem;
    }
  }
</style>
