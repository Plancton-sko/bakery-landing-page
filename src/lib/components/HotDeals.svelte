<script>
    import { products } from "$lib/consts/Products";
    import Highlights from "./Highlights.svelte";
    import ProductCard from "./ProductCard.svelte";
    import { highlights } from "$lib/consts/Highlights";
</script>

<div class="hot-deals">
    <h2>Hot Deals</h2>
    <p>Lorem ipsum is placeholder text commonly used</p>
  <div class="products">
    <Highlights {highlights} />
  
    <div class="product-grid">
        {#each products as product, index}
            <ProductCard 
                {product} 
                isHighlighted={index === 0}
            />
        {/each}
    </div>
  </div>
</div>

<style>
  .hot-deals {
      display: flex;
      flex-direction: column;
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

  /* Para centralizar a div .products */
  .products {
      display: flex;
      flex-direction: row;
      align-items: center; /* Centraliza o conteúdo horizontalmente */
      margin: 0 auto;
      background-color: transparent;
      gap: 10px;
  }

  .product-grid {
      display: grid;
      gap: 20px;
      width: 100%;
  }

  /* Responsividade com media queries */
  @media (min-width: 320px) {
      .product-grid {
          grid-template-columns: 1fr; /* Uma coluna para telas pequenas */
      }
  }

  @media (min-width: 480px) {
      .product-grid {
          grid-template-columns: 1fr 1fr; /* Uma colunas para telas médias */
      }
  }

  @media (min-width: 720px) {
      .product-grid {
          grid-template-columns: 1fr 1fr ; /* Três colunas para telas maiores */
      }
  }

  @media (min-width: 1080px) {
      .product-grid {
          grid-template-columns: 1fr 1fr 1fr; /* Quatro colunas para telas grandes */
      }
  }
  @media (min-width:480px){
    .products{
        flex-direction: column;
      }
  }
  @media (min-width:1080px){
    .products{
        flex-direction: row;
      }
  }

</style>

