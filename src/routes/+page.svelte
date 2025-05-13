<!--src/routes/+page.svelte-->
<script lang="ts">
    import { browser } from "$app/environment";
    import AboutUs from "$lib/components/AboutUs.svelte";
    import AdminProducts from "$lib/components/AdminProducts.svelte";
    import Contact from "$lib/components/Contact.svelte";
    import HeroSlider from "$lib/components/HeroSlider.svelte";
    import HotDeals from "$lib/components/HotDeals.svelte";
    import OurProducts from "$lib/components/OurProducts.svelte";

  
  import type { Product } from "$lib/types/Product";
 
  export let data;
  const products = data?.products || [];
  if (browser) {
    console.log('Produtos recebidos:', data.products);
  }
</script>

<main>
  <HeroSlider />
  <OurProducts products={products} />
  <AboutUs />
  <HotDeals />
  <Contact />
</main>

<style>
  main{
    background-color: #FDF4E3;
  }
</style>

  