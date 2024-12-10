<!--src/routes/+page.svelte-->
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

<head> 
  
</head>

<main>
  <Hero />
  <OurProducts products={data.products} />
  <AboutUs />
  <HotDeals />
  <Contact />
</main>

<style>
  main{
    background-color: #FDF4E3;
  }
</style>

  