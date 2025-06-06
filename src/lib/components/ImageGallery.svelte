<!-- src/lib/components/ImageGallery.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { config } from "$lib/services/config";
  import type {
    GalleryImage,
    ImageVariant,
    GallerySearchParams,
    ImageUploadData,
    UploadState,
    GalleryState,
    ImageFormat,
    ImageSize,
  } from "$lib/types/gallery";
  import type {
    GalleryItemProps,
    GalleryFiltersProps,
    PaginationProps,
    MultiSelectProps,
  } from "$lib/types/components";
  import type { ApiResponse, PaginatedResponse } from "$lib/types/api";

  // Props do componente
  export let onSelectImage: (image: GalleryImage | GalleryImage[]) => void;
  export let showUpload: boolean = true;
  export let allowMultiSelect: boolean = false;
  export let maxSelections: number = 0;
  export let filterByTags: string[] = [];
  export let showStats: boolean = false;
  export let readOnly: boolean = false;
  export let compactView: boolean = false;

  // Estado interno tipado
  let galleryState: GalleryState = {
    images: [],
    loading: true,
    error: null,
    currentPage: 1,
    totalPages: 1,
    searchTerm: "",
    selectedTags: [...filterByTags],
    allTags: [],
    selectedImages: new Set<string>(),
    showUploadModal: false,
    uploadState: {
      isUploading: false,
      progress: 0,
      error: undefined,
      success: false,
    },
  };

  // Dados de upload tipados
  let uploadData: Partial<ImageUploadData> = {
    title: "",
    alt: "",
    description: "",
    tags: [],
  };
  let uploadFile: File | null = null;
  let uploadTagsString = "";

  const baseUrl = config.baseUrl;

  onMount(() => {
    fetchImages();
    fetchTags();
  });

  // Função para buscar imagens com tipos corretos
const fetchImages = async (page: number = 1): Promise<void> => {
  galleryState.loading = true;
  galleryState.error = null;

  const searchParams: GallerySearchParams = {
    page,
    limit: 20,
    search: galleryState.searchTerm || undefined,
    tags:
      galleryState.selectedTags.length > 0
        ? galleryState.selectedTags
        : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        params.append(key, value.join(","));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  try {
    const res = await fetch(`${baseUrl}/gallery?${params}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    let apiResponse: ApiResponse<PaginatedResponse<GalleryImage>>;
    
    try {
      console.log(res);
      // Corrigindo: primeiro fazer o parse do JSON, depois atribuir corretamente
      const jsonData = await res.json();
      console.log('JSON Data:', jsonData);
      
      // Se o servidor retorna diretamente os dados sem wrapper ApiResponse
      if (jsonData.images && jsonData.page) {
        apiResponse = {
          success: true,
          data: jsonData,
          timestamp: new Date().toISOString()
        };
      } else {
        // Se o servidor retorna no formato ApiResponse
        apiResponse = jsonData;
      }
      
      console.log('API Response:', apiResponse);
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      throw new Error("Erro ao processar resposta do servidor");
    }

    // Verificar se a resposta foi bem-sucedida
    if (!apiResponse || !apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse?.error || "Erro na busca");
    }

    // Atribuir os dados ao estado
    galleryState.images = apiResponse.data.items;
    galleryState.totalPages = apiResponse.data.pagination.totalPages;
    galleryState.currentPage = apiResponse.data.pagination.page;
    
  } catch (err) {
    console.error("Erro ao buscar imagens:", err);
    galleryState.error =
      err instanceof Error ? err.message : "Erro desconhecido";
  } finally {
    galleryState.loading = false;
  }
};

  // Função para buscar tags
  const fetchTags = async (): Promise<void> => {
    try {
      const res = await fetch(`${baseUrl}/gallery/tags`, {
        credentials: "include",
      });

      if (res.ok) {
        const apiResponse: ApiResponse<string[]> = await res.json();
        if (apiResponse.success && apiResponse.data) {
          galleryState.allTags = apiResponse.data.sort();
        }
      }
    } catch (err) {
      console.error("Erro ao buscar tags:", err);
    }
  };

  // Handlers tipados
  const handleSearch = (): void => {
    fetchImages(1);
  };

  const handleSelect = (image: GalleryImage): void => {
    if (allowMultiSelect) {
      const newSelectedImages = new Set(galleryState.selectedImages);

      if (newSelectedImages.has(image.id)) {
        newSelectedImages.delete(image.id);
      } else {
        // Verificar limite de seleção
        if (maxSelections > 0 && newSelectedImages.size >= maxSelections) {
          galleryState.error = `Máximo de ${maxSelections} imagens permitidas`;
          return;
        }
        newSelectedImages.add(image.id);
      }

      galleryState.selectedImages = newSelectedImages;
    } else {
      onSelectImage(image);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!uploadFile || !uploadData.title?.trim()) return;

    galleryState.uploadState.isUploading = true;
    galleryState.uploadState.error = undefined;
    galleryState.uploadState.progress = 0;
    galleryState.uploadState.success = false; // Reset success state

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadData.title);

    if (uploadData.alt) formData.append("alt", uploadData.alt);
    if (uploadData.description)
      formData.append("description", uploadData.description);

    if (uploadTagsString.trim()) {
      const tags = uploadTagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      formData.append("tags", JSON.stringify(tags));
    }

    try {
      const res = await fetch(`${baseUrl}/gallery/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      let apiResponse: ApiResponse<GalleryImage>;

      try {
        apiResponse = await res.json();
        apiResponse.success = true;
      } catch (parseError) {
        // Se falhar ao fazer parse do JSON, assumir que houve erro
        throw new Error("Erro ao processar resposta do servidor");
      }

      // Verificar se a resposta foi bem-sucedida
      if (!apiResponse || !apiResponse.success) {
        throw new Error(apiResponse?.error || "Erro no upload");
      }

      // Se chegou até aqui, o upload foi bem-sucedido
      galleryState.uploadState.success = true;

      // Reset form
      resetUploadForm();
      galleryState.showUploadModal = false;

      // Refresh gallery
      await fetchImages(galleryState.currentPage);
      await fetchTags();
    } catch (err) {
      console.error("Erro no upload:", err);
      galleryState.uploadState.error =
        err instanceof Error ? err.message : "Erro no upload";
      galleryState.uploadState.success = false;
    } finally {
      galleryState.uploadState.isUploading = false;
    }
  };

  const resetUploadForm = (): void => {
    uploadFile = null;
    uploadData = {
      title: "",
      alt: "",
      description: "",
      tags: [],
    };
    uploadTagsString = "";
  };

  const toggleTag = (tag: string): void => {
    if (galleryState.selectedTags.includes(tag)) {
      galleryState.selectedTags = galleryState.selectedTags.filter(
        (t) => t !== tag,
      );
    } else {
      galleryState.selectedTags = [...galleryState.selectedTags, tag];
    }
    fetchImages(1);
  };

  const getBestVariant = (
    variants: ImageVariant[],
    size: ImageSize = "small",
    format: ImageFormat = "avif",
  ): ImageVariant | undefined => {
    let variant = variants.find((v) => v.size === size && v.format === format);
    if (!variant) variant = variants.find((v) => v.size === size);
    if (!variant) variant = variants[0];
    return variant;
  };

  const generateSrcSet = (
    variants: ImageVariant[],
    format: ImageFormat,
  ): string => {
    return variants
      .filter((v) => v.format === format)
      .map((v) => `${v.url} ${v.width}w`)
      .join(", ");
  };

  const handleFileSelect = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      uploadFile = target.files[0];
    }
  };

  const handleMultiSelectAction = (): void => {
    const selectedImageObjects = galleryState.images.filter((img) =>
      galleryState.selectedImages.has(img.id),
    );
    onSelectImage(selectedImageObjects);
  };

  const clearSelection = (): void => {
    galleryState.selectedImages = new Set();
  };

  const clearFilters = (): void => {
    galleryState.selectedTags = [];
    fetchImages(1);
  };

  // Computed values
  $: isUploadDisabled =
    galleryState.uploadState.isUploading ||
    !uploadFile ||
    !uploadData.title?.trim();
  $: selectedCount = galleryState.selectedImages.size;
  $: hasFilters = galleryState.selectedTags.length > 0;
</script>

<div class="gallery-container">
  <div class="gallery-header">
    <h3>Galeria de Imagens</h3>

    <div class="controls">
      <div class="search-section">
        <input
          type="text"
          bind:value={galleryState.searchTerm}
          placeholder="Buscar imagens..."
          class="search-input"
          on:keydown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button on:click={handleSearch} class="btn search">Buscar</button>
      </div>

      {#if showUpload && !readOnly}
        <button
          on:click={() => (galleryState.showUploadModal = true)}
          class="btn primary"
        >
          Adicionar Imagem
        </button>
      {/if}
    </div>
  </div>

  <!-- Tags Filter -->
  {#if galleryState.allTags.length > 0}
    <div class="tags-filter">
      <span class="filter-label">Filtrar por tags:</span>
      {#each galleryState.allTags as tag}
        <button
          class="tag-btn {galleryState.selectedTags.includes(tag)
            ? 'active'
            : ''}"
          on:click={() => toggleTag(tag)}
        >
          {tag}
        </button>
      {/each}
      {#if hasFilters}
        <button class="clear-tags" on:click={clearFilters}>
          Limpar filtros
        </button>
      {/if}
    </div>
  {/if}

  {#if galleryState.error}
    <div class="error-message">{galleryState.error}</div>
  {/if}

  {#if galleryState.loading}
    <div class="loading">
      <div class="spinner"></div>
      Carregando imagens...
    </div>
  {:else if galleryState.images.length === 0}
    <div class="no-images">
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
      </svg>
      <p>Nenhuma imagem encontrada</p>
    </div>
  {:else}
    <div class="images-grid {compactView ? 'compact' : ''}">
      {#each galleryState.images as image}
        <div
          class="image-item {galleryState.selectedImages.has(image.id)
            ? 'selected'
            : ''}"
          on:click={() => handleSelect(image)}
        >
          <div class="image-wrapper">
            <picture>
              {#if image.variants.find((v) => v.format === "avif")}
                <source
                  srcset={generateSrcSet(image.variants, "avif")}
                  type="image/avif"
                />
              {/if}
              {#if image.variants.find((v) => v.format === "webp")}
                <source
                  srcset={generateSrcSet(image.variants, "webp")}
                  type="image/webp"
                />
              {/if}
              <img
                src={getBestVariant(image.variants, "small", "jpeg")?.url || ""}
                alt={image.alt || image.title}
                loading="lazy"
                class="gallery-image"
              />
            </picture>

            {#if allowMultiSelect && galleryState.selectedImages.has(image.id)}
              <div class="selection-indicator">✓</div>
            {/if}
          </div>

          <div class="image-info">
            <h4 class="image-title">{image.title}</h4>
            {#if image.description && !compactView}
              <p class="image-description">{image.description}</p>
            {/if}
            {#if image.tags.length > 0}
              <div class="image-tags">
                {#each image.tags as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    {#if galleryState.totalPages > 1}
      <div class="pagination">
        <button
          class="btn"
          disabled={galleryState.currentPage === 1}
          on:click={() => fetchImages(galleryState.currentPage - 1)}
        >
          Anterior
        </button>

        {#each Array(galleryState.totalPages) as _, i}
          <button
            class="btn page-btn {i + 1 === galleryState.currentPage
              ? 'active'
              : ''}"
            on:click={() => fetchImages(i + 1)}
          >
            {i + 1}
          </button>
        {/each}

        <button
          class="btn"
          disabled={galleryState.currentPage === galleryState.totalPages}
          on:click={() => fetchImages(galleryState.currentPage + 1)}
        >
          Próxima
        </button>
      </div>
    {/if}
  {/if}

  {#if allowMultiSelect && selectedCount > 0}
    <div class="multi-select-actions">
      <p>{selectedCount} imagem(ns) selecionada(s)</p>
      {#if maxSelections > 0}
        <span class="selection-limit">({selectedCount}/{maxSelections})</span>
      {/if}
      <button class="btn primary" on:click={handleMultiSelectAction}>
        Usar Selecionadas
      </button>
      <button class="btn" on:click={clearSelection}> Limpar Seleção </button>
    </div>
  {/if}
</div>

<!-- Upload Modal -->
{#if galleryState.showUploadModal}
  <div
    class="modal-overlay"
    on:click={() => (galleryState.showUploadModal = false)}
  >
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h3>Adicionar Nova Imagem</h3>
        <button
          class="close-btn"
          on:click={() => (galleryState.showUploadModal = false)}
        >
          ×
        </button>
      </div>

      <div class="modal-body">
        {#if galleryState.uploadState.error}
          <div class="error-message">{galleryState.uploadState.error}</div>
        {/if}

        <div class="form-group">
          <label for="file-input">Arquivo:</label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            on:change={handleFileSelect}
            required
          />
        </div>

        <div class="form-group">
          <label for="title-input">Título:</label>
          <input
            id="title-input"
            type="text"
            bind:value={uploadData.title}
            placeholder="Título da imagem"
            required
          />
        </div>

        <div class="form-group">
          <label for="alt-input">Texto alternativo:</label>
          <input
            id="alt-input"
            type="text"
            bind:value={uploadData.alt}
            placeholder="Descrição para acessibilidade"
          />
        </div>

        <div class="form-group">
          <label for="desc-input">Descrição:</label>
          <textarea
            id="desc-input"
            bind:value={uploadData.description}
            placeholder="Descrição detalhada da imagem"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="tags-input">Tags (separadas por vírgula):</label>
          <input
            id="tags-input"
            type="text"
            bind:value={uploadTagsString}
            placeholder="pães, doces, salgados..."
          />
        </div>

        {#if galleryState.uploadState.isUploading && galleryState.uploadState.progress > 0}
          <div class="upload-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                style="width: {galleryState.uploadState.progress}%"
              ></div>
            </div>
            <span>{galleryState.uploadState.progress}%</span>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <button
          class="btn"
          on:click={() => (galleryState.showUploadModal = false)}
          disabled={galleryState.uploadState.isUploading}
        >
          Cancelar
        </button>
        <button
          class="btn primary"
          on:click={handleUpload}
          disabled={isUploadDisabled}
        >
          {galleryState.uploadState.isUploading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .gallery-container {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .gallery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .gallery-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }

  .controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-section {
    display: flex;
    gap: 0.5rem;
  }

  .search-input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    min-width: 200px;
  }

  .tags-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .filter-label {
    font-weight: 600;
    color: #555;
    margin-right: 0.5rem;
  }

  .tag-btn {
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 16px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
  }

  .tag-btn:hover {
    background: #f0f0f0;
  }

  .tag-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .clear-tags {
    padding: 0.25rem 0.5rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }

  .btn:hover {
    background: #f8f9fa;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn.primary {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .btn.primary:hover {
    background: #0056b3;
  }

  .btn.search {
    background: #28a745;
    color: white;
    border-color: #28a745;
  }

  .btn.search:hover {
    background: #1e7e34;
  }

  .error-message {
    padding: 1rem;
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2rem;
    color: #666;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .no-images {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  .no-images svg {
    margin-bottom: 1rem;
    color: #ccc;
  }

  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .image-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }

  .image-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .image-item.selected {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .image-wrapper {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s;
  }

  .image-item:hover .gallery-image {
    transform: scale(1.05);
  }

  .selection-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 24px;
    height: 24px;
    background: #007bff;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: bold;
  }

  .image-info {
    padding: 1rem;
  }

  .image-title {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
  }

  .image-description {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: #666;
    line-height: 1.4;
  }

  .image-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .tag {
    padding: 0.125rem 0.375rem;
    background: #e9ecef;
    color: #495057;
    border-radius: 12px;
    font-size: 0.75rem;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
  }

  .page-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .multi-select-actions {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }

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
    z-index: 2000;
  }

  .modal {
    background: white;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
  }

  .modal-header h3 {
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }

  .modal-body {
    padding: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .form-group textarea {
    resize: vertical;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #ddd;
  }

  @media (max-width: 768px) {
    .gallery-header {
      flex-direction: column;
      align-items: stretch;
    }

    .controls {
      flex-direction: column;
    }

    .search-section {
      flex-direction: column;
    }

    .search-input {
      min-width: auto;
    }

    .images-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    .multi-select-actions {
      left: 1rem;
      right: 1rem;
      transform: none;
    }
  }
</style>
