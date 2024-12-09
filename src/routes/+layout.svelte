<!--src/routes/+layout.svelte-->
<script lang="ts">
  import { onMount } from 'svelte'; // Adicione essa linha
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import '../styles/global.css';

  let cartCount: number = 0;
  let loading: boolean = true;

  onMount(() => {
    setTimeout(() => {
      loading = false; // Simule o fim do carregamento após 2 segundos
    }, 600);
  });
</script>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap" rel="stylesheet">
</head>
<body>
<Header {cartCount} />

{#if loading}
  <div class="spinner-container">
    <Spinner />
  </div>
{:else}
  <slot />
{/if}

</body>
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
