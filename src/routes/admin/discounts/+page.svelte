<!-- src/routes/admin/discounts/+page.svelte -->
<script lang="ts">
  import AdminDiscounts from "$lib/components/AdminDiscounts.svelte";
</script>

<div class="page-header">
  <h1>Gerenciamento de Cupons de Desconto</h1>
</div>

<AdminDiscounts />

<style>
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
</style>