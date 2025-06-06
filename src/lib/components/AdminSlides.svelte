<!-- src/lib/components/AdminSlides.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { config } from "$lib/services/config";
  import ImageGallery from "./ImageGallery.svelte";
  import type { GalleryImage } from "$lib/types/gallery";

  type Slide = {
    id?: string;
    title: string;
    subtitle?: string;
    image: string;
    buttonText?: string;
    buttonLink?: string;
    order: number;
  };

  let slides: Slide[] = [];
  let currentSlide: Partial<Slide> = { order: 1 };
  let isEditing = false;
  let showImageGallery = false;
  
  const baseUrl = config.baseUrl;

  onMount(() => {
    fetchSlides();
  });

  const fetchSlides = async () => {
    try {
      const res = await fetch(`${baseUrl}/slides`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      slides = await res.json();
      // Ordenar slides por ordem
      slides.sort((a, b) => a.order - b.order);
    } catch (err) {
      console.error("Erro ao buscar slides:", err);
    }
  };

  const handleSubmit = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${baseUrl}/slides/${currentSlide.id}`
      : `${baseUrl}/slides`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(currentSlide),
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      await fetchSlides();
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar slide:", err);
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este slide?")) return;
    
    try {
      const res = await fetch(`${baseUrl}/slides/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      await fetchSlides();
    } catch (err) {
      console.error("Erro ao excluir slide:", err);
    }
  };

  const moveSlide = async (id: string, direction: 'up' | 'down') => {
    const index = slides.findIndex(s => s.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === slides.length - 1)
    ) return;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentOrder = slides[index].order;
    const targetOrder = slides[targetIndex].order;
    
    // Atualiza a ordem localmente
    const updatedSlides = [...slides];
    updatedSlides[index].order = targetOrder;
    updatedSlides[targetIndex].order = currentOrder;
    
    try {
      // Atualiza no servidor
      await Promise.all([
        fetch(`${baseUrl}/slides/${slides[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ order: targetOrder }),
        }),
        fetch(`${baseUrl}/slides/${slides[targetIndex].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ order: currentOrder }),
        })
      ]);
      
      await fetchSlides();
    } catch (err) {
      console.error("Erro ao reordenar slides:", err);
    }
  };

  const resetForm = () => {
    // Define a ordem do novo slide como sendo a próxima disponível
    const nextOrder = slides.length > 0 
      ? Math.max(...slides.map(s => s.order)) + 1 
      : 1;
    
    currentSlide = { order: nextOrder };
    isEditing = false;
    showImageGallery = false;
  };

  // Handler para seleção de imagem da galeria
  const onSelectImage = (image: GalleryImage | GalleryImage[]) => {
    if (Array.isArray(image)) {
      // Se for array, pega a primeira imagem
      if (image.length > 0) {
        currentSlide.image = image[0].variants.find(v => v.size === 'original')?.url || image[0].variants[0].url;
      }
    } else {
      // Se for uma única imagem
      currentSlide.image = image.variants.find(v => v.size === 'original')?.url || image.variants[0].url;
    }
    showImageGallery = false;
  };
</script>

<div class="admin-slides">
  <section class="form-section">
    <h2>{isEditing ? "Editar Slide" : "Novo Slide"}</h2>
    
    <form on:submit|preventDefault={handleSubmit} class="slide-form">
      <div class="field-row">
        <div class="field-group">
          <label for="title">Título</label>
          <input 
            type="text" 
            id="title" 
            bind:value={currentSlide.title} 
            required 
          />
        </div>
        
        <div class="field-group">
          <label for="subtitle">Subtítulo (opcional)</label>
          <input 
            type="text" 
            id="subtitle" 
            bind:value={currentSlide.subtitle} 
          />
        </div>
      </div>
      
      <div class="field-row">
        <div class="field-group">
          <label for="buttonText">Texto do Botão (opcional)</label>
          <input 
            type="text" 
            id="buttonText" 
            bind:value={currentSlide.buttonText} 
          />
        </div>
        
        <div class="field-group">
          <label for="buttonLink">Link do Botão (opcional)</label>
          <input 
            type="text" 
            id="buttonLink" 
            bind:value={currentSlide.buttonLink} 
            placeholder="Ex: /produtos/pao"
          />
        </div>
      </div>
      
      <div class="field-group">
        <label for="order">Ordem</label>
        <input 
          type="number" 
          id="order" 
          bind:value={currentSlide.order} 
          min="1" 
          required 
        />
        <small>Determina a posição do slide no carrossel</small>
      </div>
      
      <div class="field-group">
        <label>Imagem</label>
        {#if currentSlide.image}
          <div class="current-image">
            <img 
              src={currentSlide.image} 
              alt="Imagem do slide" 
              style="max-width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;" 
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
            Selecionar Imagem da Galeria
          </button>
        {/if}
      </div>
      
      <div class="actions-row">
        <button type="submit" class="btn save" disabled={!currentSlide.image}>
          {isEditing ? "Atualizar Slide" : "Adicionar Slide"}
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
    <h2>Slides Cadastrados</h2>
    
    {#if slides.length === 0}
      <p class="no-items">Nenhum slide cadastrado ainda.</p>
    {:else}
      <div class="slides-list">
        {#each slides as slide}
          <div class="slide-item">
            <div class="order-indicator">{slide.order}</div>
            <div class="slide-content">
              <div class="slide-image">
                <img src={slide.image} alt={slide.title} />
              </div>
              <div class="slide-details">
                <h3>{slide.title}</h3>
                {#if slide.subtitle}
                  <p class="subtitle">{slide.subtitle}</p>
                {/if}
                {#if slide.buttonText}
                  <p class="button-info">
                    Botão: <span class="button-text">{slide.buttonText}</span>
                    {#if slide.buttonLink}
                      → <span class="button-link">{slide.buttonLink}</span>
                    {/if}
                  </p>
                {/if}
              </div>
            </div>
            <div class="slide-actions">
              <div class="order-buttons">
                <button 
                  on:click={() => moveSlide(slide.id as string, 'up')} 
                  class="btn order-btn"
                  disabled={slide.order === 1}
                >
                  ↑
                </button>
                <button 
                  on:click={() => moveSlide(slide.id as string, 'down')} 
                  class="btn order-btn"
                  disabled={slide.order === slides.length}
                >
                  ↓
                </button>
              </div>
              <div class="action-buttons">
                <button 
                  on:click={() => {
                    currentSlide = { ...slide };
                    isEditing = true;
                  }} 
                  class="btn edit"
                >
                  ✎ Editar
                </button>
                <button 
                  on:click={() => deleteSlide(slide.id as string)} 
                  class="btn delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<!-- Modal da Galeria de Imagens -->
{#if showImageGallery}
  <div class="modal-overlay" on:click={() => showImageGallery = false}>
    <div class="modal gallery-modal" on:click|stopPropagation>
      <div class="modal-header">
        <h3>Selecionar Imagem</h3>
        <button 
          class="close-btn" 
          on:click={() => showImageGallery = false}
        >
          ×
        </button>
      </div>
      
      <div class="modal-body">
        <ImageGallery 
          {onSelectImage}
          showUpload={true}
          allowMultiSelect={false}
          compactView={false}
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .admin-slides {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .form-section, .list-section {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .slide-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-group label {
    font-weight: 600;
    color: #374151;
  }

  .field-group input,
  .field-group select,
  .field-group textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
  }

  .field-group small {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .current-image {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .current-image img {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .actions-row {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn.save {
    background: #10b981;
    color: white;
  }

  .btn.save:hover:not(:disabled) {
    background: #059669;
  }

  .btn.cancel {
    background: #6b7280;
    color: white;
  }

  .btn.cancel:hover {
    background: #4b5563;
  }

  .btn.btn-select,
  .btn.btn-change {
    background: #3b82f6;
    color: white;
  }

  .btn.btn-select:hover,
  .btn.btn-change:hover {
    background: #2563eb;
  }

  .slides-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .slide-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
  }

  .order-indicator {
    background: #3b82f6;
    color: white;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .slide-content {
    display: flex;
    gap: 1rem;
    flex: 1;
  }

  .slide-image img {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
  }

  .slide-details h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
  }

  .subtitle {
    color: #6b7280;
    margin: 0 0 0.5rem 0;
  }

  .button-info {
    font-size: 0.875rem;
    color: #374151;
    margin: 0;
  }

  .button-text {
    font-weight: 600;
    color: #3b82f6;
  }

  .button-link {
    font-family: monospace;
    background: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
  }

  .slide-actions {
    display: flex;
    gap: 1rem;
  }

  .order-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .order-btn {
    width: 2rem;
    height: 1.5rem;
    padding: 0;
    background: #e5e7eb;
    color: #374151;
    font-size: 0.875rem;
  }

  .order-btn:hover:not(:disabled) {
    background: #d1d5db;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .btn.edit {
    background: #f59e0b;
    color: white;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn.edit:hover {
    background: #d97706;
  }

  .btn.delete {
    background: #ef4444;
    color: white;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn.delete:hover {
    background: #dc2626;
  }

  .no-items {
    text-align: center;
    color: #6b7280;
    font-style: italic;
    padding: 2rem;
  }

  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 8px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .gallery-modal {
    width: 1000px;
  }

  .modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    margin: 0;
    color: #1f2937;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: #374151;
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  @media (max-width: 768px) {
    .field-row {
      grid-template-columns: 1fr;
    }
    
    .slide-content {
      flex-direction: column;
    }
    
    .slide-actions {
      flex-direction: column;
      align-items: stretch;
    }
    
    .gallery-modal {
      width: 95vw;
    }
  }
</style>