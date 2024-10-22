<script lang="ts">
    // Importa o tipo Product para tipar corretamente a propriedade `product`
    import type { Product } from "$lib/types/Product";
  
    export let product: Product; // Produto individual passado como propriedade
    export let isHighlighted: boolean = false; 
  
    // Função utilitária opcional para formatar o preço
    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
    };
</script>
  
<div class="product-card {isHighlighted ? 'highlight' : ''}" >

  <img src={product.image} alt={product.name} />

  <h3>{product.name}</h3>

  <p>{formatPrice(product.price)}</p>
</div>

<style>
    /* Estilos do cartão de produto */
    .product-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #ccc;
      padding: 16px;
      border-radius: 8px;
      transition: box-shadow 0.3s ease;
    }
  
    .product-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  
    .product-card img {
      width: 100%;
      max-width: 200px;
      border-radius: 8px;
      height: 200px;
      object-fit: cover; 

    }
  
    .product-card h3 {
      margin: 16px 0 8px;
      font-size: 1.2rem;
      text-align: center;
    }
  
    .product-card p {
      font-size: 1rem;
      color: #555;
    }
</style>
  


