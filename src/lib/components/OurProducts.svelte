<script lang="ts">
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { Categories } from "$lib/enums/Categories";
  import type { Product } from "$lib/types/Product";
  import { products as productStore } from "$lib/stores/products"; // Importa a store
  import CategoryNav from "./CategoryNav.svelte"; // Importa o componente de navegação de categorias

  export let products: Product[];

  // Transformando selectedCategory em uma store writable
  const selectedCategory = writable(Categories.ALL);

  // Store derivada para produtos filtrados com base na categoria
  const filteredProducts = derived(
    [productStore, selectedCategory], // Adicionando selectedCategory como dependência
    ([$productsStore, $selectedCategory]) => {
      if ($selectedCategory === Categories.ALL) {
        return $productStore;
      }
      return $productStore.filter(
        (product: Product) => product.category === $selectedCategory,
      );
    },
  );

  // Buscar os produtos quando o componente montar
  onMount(() => {
    productStore.set(products);
  });

  // Array de categorias para passar para o componente de navegação
  const categoriesList = Object.values(Categories);
</script>

<section id="our-products">
  <h2>Our Products</h2>

  <!-- Navegação de Categorias -->
  <CategoryNav
    categories={categoriesList}
    on:select={(event) => selectedCategory.set(event.detail)}
  />

  <!-- Grade de Produtos Filtrados -->
  <div class="product-grid">
    {#each $filteredProducts as product (product.id)}
      <div class="product">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    {/each}
  </div>
</section>
