<!-- src/lib/components/AdminSlides.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { config } from "$lib/services/config";
  import ImageGallery from "./ImageGallery.svelte";

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

  const onSelectImage = (imageUrl: string) => {
    currentSlide.image = imageUrl;
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
              style="max-width: 100%; max-height: 200px;" 
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

<style>
  .admin-slides {
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

  .field-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .field-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .field-group label {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .field-group small {
    color: #666;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  input, textarea {
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

  .slides-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .slide-item {
    background: white;
    border-radius: 6px;
    padding: 1rem;
    box-shadow: var(--box-shadow-small);
    display: flex;
    gap: 1rem;
    position: relative;
  }

  .order-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-color);
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: bold;
  }

  .slide-content {
    flex: 1;
    display: flex;
    gap: 1rem;
  }

  .slide-image {
    width: 200px;
    height: 100px;
    overflow: hidden;
    border-radius: 4px;
  }

  .slide-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .slide-details {
    flex: 1;
  }

  .slide-details h3 {
    margin: 0 0 0.5rem;
  }

  .subtitle {
    color: #555;
    margin-bottom: 0.5rem;
  }

  .button-info {
    font-size: 0.9rem;
    color: #666;
  }

  .button-text {
    color: var(--primary-color);
    font-weight: bold;
  }

  .button-link {
    color: var(--accent-color);
    font-style: italic;
  }

  .slide-actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .order-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .order-btn {
    padding: 0.25rem 0.5rem;
    background: #f0f0f0;
    border: 1px solid #ddd;
  }

  .order-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
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

  @media (max-width: 768px) {
    .field-row {
      flex-direction: column;
    }
    
    .slide-content {
      flex-direction: column;
    }
    
    .slide-image {
      width: 100%;
    }
  }
</style>