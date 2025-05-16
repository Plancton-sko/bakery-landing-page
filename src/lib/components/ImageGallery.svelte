<!-- src/lib/components/ImageGallery.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { config } from "$lib/services/config";

  export let onSelectImage: (imageUrl: string) => void;
  
  let images: string[] = [];
  let loading = true;
  let error = "";
  let currentPage = 1;
  let totalPages = 1;
  let searchTerm = "";
  
  const baseUrl = config.baseUrl;

  onMount(() => {
    fetchImages();
  });

  const fetchImages = async (page = 1) => {
    loading = true;
    error = "";
    try {
      const res = await fetch(
        `${baseUrl}/images?page=${page}&search=${encodeURIComponent(searchTerm)}`, 
        { credentials: "include" }
      );
      
      if (!res.ok) throw new Error(await res.text());
      
      const data = await res.json();
      images = data.images;
      totalPages = Number(res.headers.get("X-Total-Pages")) || 1;
      currentPage = page;
    } catch (err) {
      console.error("Erro ao buscar imagens:", err);
      error = err instanceof Error ? err.message : "Erro desconhecido";
    } finally {
      loading = false;
    }
  };

  const handleSearch = () => {
    fetchImages(1);
  };

  const handleSelect = (imageUrl: string) => {
    onSelectImage(imageUrl);
  };
</script>

<div class="image-gallery">
  <div class="gallery-header">
    <h3>Galeria de Imagens</h3>
    <div class="search-bar">
      <input 
        type="text" 
        bind:value={searchTerm} 
        placeholder="Buscar imagens..." 
        on:keydown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button on:click={handleSearch} class="btn search">Buscar</button>
    </div>
  </div>

  {#if error}
    <div class="error-message">{error}</div>
  {/if}
  
  {#if loading}
    <div class="loading">Carregando imagens...</div>
  {:else if images.length === 0}
    <div class="no-images">Nenhuma imagem encontrada</div>
  {:else}
    <div class="images-grid">
      {#each images as imageUrl}
        <div class="image-item" on:click={() => handleSelect(imageUrl)}>
          <img src={imageUrl} alt="Imagem da galeria" />
        </div>
      {/each}
    </div>
    
    {#if totalPages > 1}
      <div class="pagination">
        {#each Array(totalPages) as _, i}
          <button
            class:active={i + 1 === currentPage}
            on:click={() => fetchImages(i + 1)}>{i + 1}</button
          >
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .image-gallery {
    background: white;
    border-radius: 6px;
    padding: 1rem;
    box-shadow: var(--box-shadow-small);
  }

  .gallery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .gallery-header h3 {
    margin: 0;
  }

  .search-bar {
    display: flex;
    gap: 0.5rem;
  }

  .search-bar input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-width: 200px;
  }

  .btn.search {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }

  .image-item {
    border: 2px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s ease;
    aspect-ratio: 1/1;
  }

  .image-item:hover {
    border-color: var(--primary-color);
  }

  .image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .loading, .no-images, .error-message {
    padding: 2rem 0;
    text-align: center;
    color: #666;
  }

  .error-message {
    color: var(--danger-color);
  }

  .pagination {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .pagination button {
    padding: 0.5rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }

  .pagination button.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
</style>