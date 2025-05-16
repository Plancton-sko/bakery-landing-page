<!-- src/routes/admin/highlights/+page.svelte -->
<script lang="ts">
  import AdminHighlights from "$lib/components/AdminHighlights.svelte";
</script>

<div class="page-header">
  <h1>Gerenciamento de Destaques</h1>
</div>

<AdminHighlights />

<style>
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
</style>