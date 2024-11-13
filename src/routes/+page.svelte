<script lang="ts">
  // Layout 
  import AboutUs from "$lib/components/AboutUs.svelte";
  import Contact from "$lib/components/Contact.svelte";
  import Hero from "$lib/components/HeroSlider.svelte";
  import HotDeals from "$lib/components/HotDeals.svelte";
  import OurProducts from "$lib/components/OurProducts.svelte";
  import { products } from "$lib/consts/Products";
  import type { Product } from "$lib/types/Product";

  export let data: { products: Product[] };
</script>

<head> </head>

<main>
  <Hero />
  <OurProducts products={data.products} />
  <AboutUs />
  <HotDeals />
  <Contact />
</main>

<style>
  /* Variáveis para cores e fontes */

  /* Estilos Gerais */
  body {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  section {
    padding: 40px;
    margin: 0 auto;
    max-width: 1200px;
  }

  h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: var(--primary-color);
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }

  /* Estilos do Header */
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: var(--bg-light);
  }

  nav ul {
    display: flex;
    gap: 20px;
    list-style: none;
  }

  nav ul li a {
    text-decoration: none;
    color: var(--primary-color);
    transition: color 0.3s;
  }

  nav ul li a:hover {
    color: var(--secondary-color);
  }

  .cart {
    font-weight: bold;
  }

  /* Hero Section */
  #hero {
    text-align: center;
    padding: 100px 20px;
    background-color: #f5f5f5;
  }

  #hero img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }

  #hero h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
  }

  /* Estilos da Seção "Our Products" */
  #our-products {
    text-align: center;
    margin-top: 60px;
  }

  .product-nav {
    margin-bottom: 20px;
  }

  .product-nav button {
    padding: 10px 15px;
    background-color: #f0f0f0;
    color: var(--primary-color);
    border: 1px solid #ddd;
    margin: 0 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 5px;
  }

  .product-nav button:hover,
  .product-nav button:focus {
    background-color: #e0e0e0;
    outline: none;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .product {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgb(0, 0, 0, 0.1);
    transition: transform 0.3s;
    text-align: center;
  }

  .product img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .product:hover {
    transform: scale(1.05);
  }

  .product h3 {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 10px;
  }

  .product p {
    font-size: 1.2rem;
    color: var(--text-color);
  }

  /* Estilo para o container da imagem */
  .image-container img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  /* Estilo para o container do texto */
  .text-container {
    text-align: left;
    max-width: 400px;
  }

  .text-container h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .text-container p {
    font-size: 1rem;
    margin-bottom: 20px;
  }

  .text-container button {
    background-color: var(--primary-color);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .text-container button:hover {
    background-color: var(--secondary-color);
  }

  /* Estilos do Formulário de Contato */
  form {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
  }

  label {
    margin-top: 1rem;
    font-weight: bold;
  }

  input,
  textarea {
    padding: 0.5rem;
    margin-top: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  button[type="submit"] {
    margin-top: 1.5rem;
    padding: 0.75rem;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button[type="submit"]:hover,
  button[type="submit"]:focus {
    background-color: var(--tertiary-color);
    outline: none;
  }

  /* Estilos do Footer */
  footer {
    text-align: center;
    padding: 20px;
    background-color: var(--bg-dark);
    color: white;
  }

  footer p {
    margin: 0;
  }

  /* Responsividade */
  @media (max-width: 1024px) {
    .about-content {
      flex-direction: column;
    }

    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .product-grid {
      grid-template-columns: 1fr;
    }

    #hero h1 {
      font-size: 2rem;
    }
  }
</style>
