<!--
  src/lib/componentes/CategoryNav.svelte
-->

<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Categories } from '$lib/enums/Categories';
  
    export let categories: Categories[];
    const dispatch = createEventDispatcher();
  
    function selectCategory(category: Categories) {
      dispatch('select', category);
    }
  </script>
  
  <nav class="product-nav">
    {#each categories as category}
      <button on:click={() => selectCategory(category)}>
        {category}
      </button>
    {/each}
  </nav>
  