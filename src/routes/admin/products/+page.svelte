<script lang="ts">
  import AdminProducts from "$lib/components/AdminProducts.svelte";
</script>

<div class="page-header">
  <h1>Gerenciamento de Produtos</h1>
</div>

<AdminProducts />

<style>
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
</style>