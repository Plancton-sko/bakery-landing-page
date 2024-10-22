<script>
    import { products } from "$lib/consts/Products";
    import ProductCard from "./ProductCard.svelte";
</script>

<div class="hot-deals">
    <h2>Hot Deals</h2>
    <p>Lorem ipsum is placeholder text commonly used</p>
    
    <div class="product-grid">
      {#each products as product}
        <ProductCard {product} />
      {/each}
    </div>
  </div>

<style>
    .hot-deals {
      text-align: center;
      padding: 40px 20px;
      background-color: #ffffff;
      margin: 20px auto;
      max-width: 1000px;
      border-radius: 8px;
    }
  
    .hot-deals h2 {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: lowercase;
      letter-spacing: 2px;
      color: #333;
    }
  
    .hot-deals p {
      font-size: 16px;
      color: #666;
      margin-bottom: 30px;
    }
  
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
  </style>
