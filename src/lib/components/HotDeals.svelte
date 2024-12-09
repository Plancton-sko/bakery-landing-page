<!--src/lib/components/HotDeals.svelte-->
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
  /* Estilo geral da seção */
.hot-deals {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 60px 20px;
    margin: 20px auto;
    max-width: 1200px;
    border-radius: 12px;
    
}

.hot-deals h2 {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 20px;
    color: var(--primary-color); /* Dark brown */
}

.hot-deals p {
    font-size: 18px;
    color: var(--primary-color);
    margin-bottom: 30px;
}

/* Área de produtos */
.products {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin: 0 auto;
}

.product-grid {
    display: grid;
    gap: 20px;
    width: 100%;
}

/* Estilo responsivo */
@media (max-width: 480px) {
    .product-grid {
        grid-template-columns: 1fr; /* 1 coluna para telas pequenas */
    }
}

@media (min-width: 481px) and (max-width: 720px) {
    .product-grid {
        grid-template-columns: 1fr 1fr; /* 2 colunas para telas médias */
    }
}

@media (min-width: 721px) and (max-width: 1080px) {
    .product-grid {
        grid-template-columns: 1fr 1fr 1fr; /* 3 colunas para telas maiores */
    }
}

@media (min-width: 1081px) {
    .product-grid {
        grid-template-columns: 1fr 1fr 1fr 1fr; /* 4 colunas para telas grandes */
    }

    .products {
        flex-direction: row;
    }
}

</style>

