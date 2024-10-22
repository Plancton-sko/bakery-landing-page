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
    padding: 20px;
  }

  #our-products h2 {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  /* Estilo da barra de navegação de categorias */
  .category-nav {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .category-nav a {
    margin: 0 10px;
    font-size: 1rem;
    color: #555;
    text-decoration: none;
    cursor: pointer;
  }

  .category-nav a.active {
    font-weight: bold;
    color: #000;
    border-bottom: 2px solid #000;
  }

  /* Estilo da grade de produtos */
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 32px;
  }

  /* Estilo de cada cartão de produto */
  .product-card {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s ease;
  }

  .product-card:hover {
    transform: scale(1.05);
  }

  /* Estilo da imagem do produto */
  .product-card img {
    max-width: 100%;
    height: auto;
    border-bottom: 1px solid #ddd;
    margin-bottom: 15px;
  }

  /* Estilo do título do produto */
  .product-card h3 {
    font-size: 1.25rem;
    margin-bottom: 10px;
    color: #333;
  }

  /* Estilo do preço */
  .product-card p.price {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 10px;
  }

  /* Estilo das estrelas de avaliação */
  .product-card .stars {
    color: #f5c518;
    margin-bottom: 10px;
  }

  /* Estilo para responsividade */
  @media (max-width: 768px) {
    .product-grid {
      grid-template-columns: 1fr;
    }
  }
</style>