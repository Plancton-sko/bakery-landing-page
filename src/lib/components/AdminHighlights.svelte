<!-- src/lib/components/AdminHighlights.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { config } from "$lib/services/config";
  import ImageGallery from "./ImageGallery.svelte";
  import type { Product } from "$lib/types/Product";

  type Highlight = {
    id?: string;
    title: string;
    description: string;
    image: string;
    productId?: string;
  };

  let highlights: Highlight[] = [];
  let currentHighlight: Partial<Highlight> = {};
  let isEditing = false;
  let showImageGallery = false;
  let products: Product[] = [];
  
  const baseUrl = config.baseUrl;

  onMount(async () => {
    await Promise.all([fetchHighlights(), fetchProducts()]);
  });

  const fetchHighlights = async () => {
    try {
      const res = await fetch(`${baseUrl}/highlights`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      highlights = await res.json();
    } catch (err) {
      console.error("Erro ao buscar destaques:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${baseUrl}/products?all=true`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      products = await res.json();
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  const handleSubmit = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${baseUrl}/highlights/${currentHighlight.id}`
      : `${baseUrl}/highlights`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(currentHighlight),
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      await fetchHighlights();
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar destaque:", err);
    }
  };

  const deleteHighlight = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este destaque?")) return;
    
    try {
      const res = await fetch(`${baseUrl}/highlights/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      await fetchHighlights();
    } catch (err) {
      console.error("Erro ao excluir destaque:", err);
    }
  };

  const resetForm = () => {
    currentHighlight = {};
    isEditing = false;
    showImageGallery = false;
  };

  const onSelectImage = (imageUrl: string) => {
    currentHighlight.image = imageUrl;
    showImageGallery = false;
  };
</script>

<div class="admin-highlights">
  <section class="form-section">
    <h2>{isEditing ? "Editar Destaque" : "Novo Destaque"}</h2>
    
    <form on:submit|preventDefault={handleSubmit} class="highlight-form">
      <div class="field-group">
        <label for="title">Título</label>
        <input 
          type="text" 
          id="title" 
          bind:value={currentHighlight.title} 
          required 
        />
      </div>
      
      <div class="field-group">
        <label for="description">Descrição</label>
        <textarea 
          id="description" 
          bind:value={currentHighlight.description} 
          rows="3" 
          required 
        ></textarea>
      </div>
      
      <div class="field-group">
        <label for="product">Produto Relacionado (opcional)</label>
        <select id="product" bind:value={currentHighlight.productId}>
          <option value="">Nenhum</option>
          {#each products as product}
            <option value={product.id}>{product.name}</option>
          {/each}
        </select>
      </div>
      
      <div class="field-group">
        <label>Imagem</label>
        {#if currentHighlight.image}
          <div class="current-image">
            <img 
              src={currentHighlight.image} 
              alt="Imagem do destaque" 
              style="max-width: 300px; max-height: 200px;" 
            />
            <button 
              type="button" 
              class="btn btn-change" 
              on:click={() => showImageGallery = true}
            >
              Alterar Imagem
            </button>
          </div>
        {:else}
          <button 
            type="button" 
            class="btn btn-select" 
            on:click={() => showImageGallery = true}
          >
            Selecionar Imagem
          </button>
        {/if}
      </div>
      
      {#if showImageGallery}
        <div class="gallery-container">
          <ImageGallery onSelectImage={onSelectImage} />
          <button 
            type="button" 
            class="btn btn-cancel" 
            on:click={() => showImageGallery = false}
          >
            Cancelar
          </button>
        </div>
      {/if}
      
      <div class="actions-row">
        <button type="submit" class="btn save" disabled={!currentHighlight.image}>
          {isEditing ? "Atualizar Destaque" : "Adicionar Destaque"}
        </button>
        {#if isEditing}
          <button type="button" on:click={resetForm} class="btn cancel">
            Cancelar
          </button>
        {/if}
      </div>
    </form>
  </section>
  
  <section class="list-section">
    <h2>Destaques Cadastrados</h2>
    
    {#if highlights.length === 0}
      <p class="no-items">Nenhum destaque cadastrado ainda.</p>
    {:else}
      <div class="highlights-grid">
        {#each highlights as highlight}
          <div class="highlight-card">
            <div class="image-container">
              <img src={highlight.image} alt={highlight.title} />
            </div>
            <div class="card-body">
              <h3>{highlight.title}</h3>
              <p class="description">{highlight.description}</p>
              {#if highlight.productId}
                <p class="product-linked">
                  Produto vinculado: {products.find(p => p.id === highlight.productId)?.name || 'Não encontrado'}
                </p>
              {/if}
            </div>
            <div class="card-actions">
              <button 
                on:click={() => {
                  currentHighlight = { ...highlight };
                  isEditing = true;
                }} 
                class="btn edit"
              >
                ✎ Editar
              </button>
              <button 
                on:click={() => deleteHighlight(highlight.id as string)} 
                class="btn delete"
              >
                🗑️
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .admin-highlights {
    max-width: 1000px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-section, .list-section {
    background: var(--beeswax);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-small);
  }

  .field-group {
    margin-bottom: 1rem;
  }

  .field-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .current-image {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .btn.btn-select, .btn.btn-change {
    background: var(--accent-color);
    color: white;
  }

  .btn.btn-cancel {
    background: #aaa;
    color: white;
    margin-top: 1rem;
  }

  .gallery-container {
    margin: 1rem 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    background: white;
  }

  .actions-row {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .btn.save {
    background: var(--success-color);
    color: white;
  }

  .btn.save:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .btn.cancel {
    background: #aaa;
    color: white;
  }

  .highlights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .highlight-card {
    background: white;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: var(--box-shadow-small);
  }

  .image-container {
    height: 200px;
    overflow: hidden;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-body {
    padding: 1rem;
  }

  .card-body h3 {
    margin: 0 0 0.5rem;
  }

  .description {
    color: #555;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .product-linked {
    font-size: 0.85rem;
    color: var(--primary-color);
    font-style: italic;
  }

  .card-actions {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: #f8f8f8;
  }

  .btn.edit {
    background: var(--accent-color);
    color: white;
  }

  .btn.delete {
    background: var(--danger-color);
    color: white;
  }

  .no-items {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
</style>