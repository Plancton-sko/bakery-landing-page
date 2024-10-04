<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import '../styles/global.css';

  let cartCount: number = 0;
</script>

<Header {cartCount} />

<slot />

<Footer />
