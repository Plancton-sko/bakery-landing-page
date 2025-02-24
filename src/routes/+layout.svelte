<!--src/routes/+layout.svelte-->
<script lang="ts">
  import { onMount } from 'svelte'; // Adicione essa linha
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import '../styles/global.css';
  import { loadCartFromDB } from '$lib/stores/cart';

  let cartCount: number = 0;
  let loading: boolean = true;

  onMount(() => {
    setTimeout(() => {
      loading = false; // Simule o fim do carregamento após 2 segundos
    }, 600);
  });

  onMount(() => {
    if (typeof window !== 'undefined') {
      const images = document.querySelectorAll('enhanced:img');
      images.forEach(img => {
        img.addEventListener('load', () => {
          // console.log(`Image loaded: ${img.src}`);
          // performance.mark(`image-${img.src}-loaded`);
        });
      });
    }
  });

  onMount(() => {
    loadCartFromDB();
  })

</script>
<Header/>

{#if loading}
  <div class="spinner-container">
    <Spinner />
  </div>
{:else}
  <slot />
{/if}


<Footer />

<style>
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  body{
    background-color: #FDF4E3;
  }
</style>
