<!-- src/lib/components/AdminProducts.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import type { Product } from "$lib/types/Product";
  import { config } from "$lib/services/config";
  import ImageGallery from "$lib/components/admin/ImageGallery.svelte";
  import type { GalleryImage } from "$lib/types/gallery";

  let products: Product[] = [];
  let currentProduct: Partial<Product> = {};
  let isEditing = false;
  let currentPage = 1;
  let totalPages = 1;

  let fileInput: HTMLInputElement;
  let dragOver = false;
  let selectedFile: File | null = null;

  let showImageGallery = false;
  let selectedGalleryImage: GalleryImage | null = null;

  const baseUrl = config.baseUrl;

  const fetchProducts = async (page = 1) => {
    try {
      const res = await fetch(`${baseUrl}/products?page=${page}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      products = data.map((p: Product) => ({ ...p, price: Number(p.price) }));
      totalPages = Number(res.headers.get("X-Total-Pages")) || 1;
      currentPage = page;
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const res = await fetch(`${baseUrl}/products/${currentProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...currentProduct,
            image: selectedGalleryImage?.variants.find(
              (v) => v.size === "original",
            )?.url,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          currentProduct = updated;
          await fetchProducts(currentPage);
        } else {
          console.error(await res.text());
        }
      } else {
        if (!selectedFile && !selectedGalleryImage) {
          alert("Por favor, selecione ou envie uma imagem para o produto.");
          return;
        }

        const formData = new FormData();
        formData.append("name", currentProduct.name || "");
        formData.append("category", currentProduct.category || "");
        formData.append("description", currentProduct.description || "");
        formData.append("price", currentProduct.price?.toString() || "0");
        if (selectedFile) {
          formData.append("file", selectedFile);
        } else if (selectedGalleryImage) {
          const originalUrl = selectedGalleryImage.variants.find(
            (v) => v.size === "original",
          )?.url;
          if (originalUrl) {
            formData.append("image", originalUrl);
          } else {
            alert(
              "Erro: a imagem selecionada da galeria não tem uma versão 'original'.",
            );
            return;
          }
        }

        const res = await fetch(`${baseUrl}/products`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (res.ok) {
          const saved = await res.json();
          currentProduct = saved;
          selectedFile = null;
          selectedGalleryImage = null;
          if (fileInput) fileInput.value = "";
          await fetchProducts(currentPage);
          alert("Produto criado com sucesso!");
          resetForm();
        } else {
          const errorText = await res.text();
          console.error("Erro ao criar produto:", errorText);
          alert(`Erro ao criar produto: ${errorText}`);
        }
      }
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    }
  };

  const resetForm = () => {
    currentProduct = {};
    isEditing = false;
    dragOver = false;
    selectedFile = null;
    selectedGalleryImage = null;
    if (fileInput) fileInput.value = "";
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp|avif)$/)) {
      alert("Por favor, selecione apenas arquivos de imagem válidos.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("O arquivo deve ter no máximo 10MB.");
      return;
    }
    selectedFile = file;
    dragOver = false;
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) handleFileSelect(file);
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    dragOver = true;
  };

  const onDragLeave = () => (dragOver = false);

  const handleImageSelect = (image: GalleryImage | GalleryImage[]) => {
    selectedGalleryImage = Array.isArray(image) ? image[0] : image;
    showImageGallery = false;
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    try {
      const res = await fetch(`${baseUrl}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchProducts(currentPage);
      else console.error(await res.text());
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
    }
  };

  onMount(() => fetchProducts());
</script>

<div class="admin">
  <!-- Formulário de Produto -->
  <div class="form-section">
    <h2>{isEditing ? "Editar Produto" : "Criar Produto"}</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="field-row">
        <div class="field-group">
          <label for="name">Nome</label>
          <input
            id="name"
            type="text"
            bind:value={currentProduct.name}
            placeholder="Nome do produto"
            required
          />
        </div>
        <div class="field-group">
          <label for="category">Categoria</label>
          <select id="category" bind:value={currentProduct.category} required>
            <option value="">Selecione uma categoria</option>
            <option value="bread">Pão</option>
            <option value="coffee">Café</option>
            <option value="cookies">Cookies</option>
            <option value="others">Outros</option>
          </select>
        </div>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label for="description">Descrição</label>
          <textarea
            id="description"
            bind:value={currentProduct.description}
            placeholder="Descrição do produto"
            required
          ></textarea>
        </div>
        <div class="field-group">
          <label for="price">Preço</label>
          <input
            id="price"
            type="number"
            bind:value={currentProduct.price}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <!-- Seletor da Galeria -->
      <div class="field-group">
        <label>Imagem do Produto</label>
        <div>
          <button type="button" class="btn" on:click={() => (showImageGallery = true)}>
            {selectedGalleryImage
              ? "Trocar Imagem da Galeria"
              : "Selecionar da Galeria"}
          </button>
          {#if selectedGalleryImage}
            <div style="margin-top: 1rem;">
              <img
                src={selectedGalleryImage.variants.find((v) => v.size === "original")
                  ?.url}
                alt="Imagem selecionada"
                width="150"
                style="border-radius: 4px;"
              />
            </div>
          {/if}
        </div>
      </div>

      <!-- Upload direto -->
      <div class="field-group">
        <label>Ou envie uma nova imagem</label>
        <div
          class="drop-zone"
          class:drag-over={dragOver}
          on:drop={onDrop}
          on:dragover={onDragOver}
          on:dragleave={onDragLeave}
        >
          <input
            type="file"
            bind:this={fileInput}
            accept="image/*"
            on:change={() => {
              const file = fileInput.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          <p>
            {#if selectedFile}
              Arquivo selecionado: {selectedFile.name}
            {:else}
              Clique para selecionar ou arraste uma imagem aqui
            {/if}
          </p>
        </div>
      </div>

      <div class="actions-row">
        <button type="submit" class="btn save">
          {isEditing ? "Atualizar Produto" : "Criar Produto"}
        </button>
        {#if isEditing}
          <button type="button" class="btn cancel" on:click={resetForm}>
            Cancelar
          </button>
        {/if}
      </div>
    </form>
  </div>

   <!-- Lista de produtos -->
  <div class="list-section">
    <h2>Produtos Cadastrados</h2>
    {#if products.length > 0}
      <div class="grid">
        {#each products as product}
          <div class="card">
            <img 
              src={typeof product.image === 'string' ? product.image : (product.image as any)?.url || ''} 
              alt={product.name} 
            />
            <div class="card-body">
              <h3>{product.name}</h3>
              <p><strong>Categoria:</strong> {product.category}</p>
              <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
              <p>{product.description}</p>
            </div>
            <div class="card-actions">
              <button
                class="btn edit"
                on:click={() => {
                  currentProduct = { ...product };
                  isEditing = true;
                  selectedFile = null;
                  selectedGalleryImage = null;
                }}>
                Editar
              </button>
              <button class="btn delete" on:click={() => deleteProduct(product.id)}>
                Excluir
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p>Nenhum produto cadastrado ainda.</p>
    {/if}
  </div>

  <!-- Paginação -->
  {#if totalPages > 1}
    <div class="pagination">
      {#each Array(totalPages) as _, i}
        <button
          class="btn"
          class:active={i + 1 === currentPage}
          on:click={() => fetchProducts(i + 1)}
        >
          {i + 1}
        </button>
      {/each}
    </div>
  {/if}
</div>

<!-- Galeria -->
{#if showImageGallery}
  <ImageGallery
    onSelectImage={handleImageSelect}
    showUpload={true}
    allowMultiSelect={false}
  />
{/if}

<style>
  .admin {
    max-width: 1000px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .form-section,
  .list-section {
    background: var(--beeswax, #f9f7f4);
    padding: 1.5rem;
    border-radius: var(--border-radius, 8px);
    box-shadow: var(--box-shadow-small, 0 2px 4px rgba(0,0,0,0.1));
  }
  
  .form-section h2,
  .list-section h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: var(--text-color, #333);
  }
  
  .field-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  
  .field-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 250px;
  }
  
  .field-group label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: var(--text-color, #333);
  }
  
  input,
  textarea,
  select {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }
  
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: var(--primary-color, #007bff);
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .actions-row {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }
  
  .btn:hover {
    transform: translateY(-1px);
  }
  
  .btn:active {
    transform: translateY(0);
  }
  
  .btn.save {
    background-color: #4caf50;
    color: white;
  }
  
  .btn.save:hover {
    background-color: #45a047;
  }
  
  .btn.save:active {
    background-color: #3e8e41;
  }
  
  .btn.cancel {
    background: #6c757d;
    color: white;
  }
  
  .btn.cancel:hover {
    background: #5a6268;
  }
  
  .btn.edit {
    background-color: #2196f3;
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .btn.edit:hover {
    background-color: #1e88e5;
  }
  
  .btn.edit:active {
    background-color: #1976d2;
  }
  
  .btn.delete {
    background: var(--danger-color, #dc3545);
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .btn.delete:hover {
    background: #c82333;
  }
  
  .drop-zone {
    margin-top: 0.5rem;
    padding: 2rem;
    border: 2px dashed #bbb;
    border-radius: 6px;
    text-align: center;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;
  }
  
  .drop-zone:hover {
    background-color: #f9f9f9;
  }
  
  .drop-zone.drag-over {
    background-color: rgba(76, 175, 80, 0.1);
    border-color: #4caf50;
  }
  
  .drop-zone input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  
  .drop-zone p {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--box-shadow-small, 0 2px 8px rgba(0,0,0,0.1));
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease;
  }
  
  .card:hover {
    transform: translateY(-2px);
  }
  
  .card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .card-body {
    padding: 1rem;
    flex: 1;
  }
  
  .card-body h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    color: var(--text-color, #333);
  }
  
  .card-body p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: var(--text-muted, #666);
    line-height: 1.4;
  }
  
  .card-actions {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }
  
  .pagination {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .pagination .btn {
    padding: 0.5rem 0.75rem;
    border: 1px solid #ddd;
    background: white;
    color: var(--text-color, #333);
  }
  
  .pagination .btn:hover {
    background: #f8f9fa;
  }
  
  .pagination .btn.active {
    background: var(--primary-color, #007bff);
    color: white;
    border-color: var(--primary-color, #007bff);
  }

  @media (max-width: 768px) {
    .admin {
      margin: 1rem;
    }
    
    .field-row {
      flex-direction: column;
    }
    
    .field-group {
      min-width: auto;
    }
    
    .actions-row {
      flex-direction: column;
    }
    
    .grid {
      grid-template-columns: 1fr;
    }
    
    .card-actions {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>