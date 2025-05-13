<!-- src/lib/components/AdminProducts.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import type { Product } from "$lib/types/Product";
  import { config } from "$lib/services/config";

  let products: Product[] = [];
  let currentProduct: Partial<Product> = {};
  let isEditing = false;
  let currentPage = 1;
  let totalPages = 1;

  let fileInput: HTMLInputElement;
  let dragOver = false;

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

  const handleSubmit = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${baseUrl}/products/${currentProduct.id}`
      : `${baseUrl}/products`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(currentProduct),
      });
      if (res.ok) {
        const saved = await res.json();
        if (!isEditing) {
          // após criação, já seleciona para upload
          currentProduct = saved;
          isEditing = true;
        } else {
          // Atualiza o currentProduct com a resposta do servidor
          currentProduct = saved;
        }
        await fetchProducts(currentPage);
      } else {
        console.error(await res.text());
      }
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(
        `${baseUrl}/products/${currentProduct.id}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      if (res.ok) {
        const updated = await res.json();
        products = products.map((p) => (p.id === updated.id ? updated : p));
        // Atualiza o currentProduct com a nova imagem
        currentProduct = updated;
        alert("Imagem atualizada!");
      } else {
        console.error(await res.text());
      }
    } catch (err) {
      console.error("Erro no upload:", err);
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    dragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file && currentProduct.id) {
      handleImageUpload(file);
    }
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    dragOver = true;
  };

  const onDragLeave = () => {
    dragOver = false;
  };

  const resetForm = () => {
    currentProduct = {};
    isEditing = false;
    dragOver = false;
    if (fileInput) fileInput.value = "";
  };

  onMount(() => fetchProducts());
</script>

<div class="admin">
  <!-- Formulário de Criação/Edição -->
  <section class="form-section">
    <h2>{isEditing ? "Editar Produto" : "Novo Produto"}</h2>
    <form on:submit|preventDefault={handleSubmit} class="product-form">
      <div class="field-row">
        <div class="field-group">
          <label>Nome</label>
          <input type="text" bind:value={currentProduct.name} required />
        </div>
        <div class="field-group">
          <label>Categoria</label>
          <select bind:value={currentProduct.category} required>
            <option disabled value="">Selecione</option>
            <option value="bread">Pão</option>
            <option value="coffee">Café</option>
            <option value="cookies">Cookies</option>
            <option value="others">Outros</option>
          </select>
        </div>
      </div>
      <div class="field-group">
        <label>Descrição</label>
        <textarea bind:value={currentProduct.description} rows="2" required />
      </div>
      <div class="field-row">
        <div class="field-group">
          <label>Preço</label>
          <input
            type="number"
            step="0.01"
            bind:value={currentProduct.price}
            required
            min="0"
          />
        </div>
      </div>
      {#if isEditing && currentProduct.image}
        <div class="current-image">
          <p>Imagem atual:</p>
          <img
            src={currentProduct.image as string}
            alt={currentProduct.name}
            style="max-width: 150px; max-height: 150px;"
          />
        </div>
      {/if}
      <div class="drop-zone-div">
        <button
          type="button"
          class="drop-zone"
          class:drag-over={dragOver}
          on:click={() => fileInput.click()}
          on:drop|preventDefault={onDrop}
          on:dragover|preventDefault={onDragOver}
          on:dragleave={onDragLeave}
        >
          <p>
            {dragOver
              ? "Solte a imagem aqui"
              : "Arraste ou clique para enviar imagem"}
          </p>
          <input
            type="file"
            bind:this={fileInput}
            accept="image/*"
            on:change={() =>
              fileInput.files?.[0] && handleImageUpload(fileInput.files[0])}
            style="display: none;"
          />
        </button>
      </div>
      <div class="actions-row">
        <button type="submit" class="btn save"
          >{isEditing ? "Atualizar Produto" : "Adicionar Produto"}</button
        >
        {#if isEditing}
          <button type="button" on:click={resetForm} class="btn cancel"
            >Cancelar</button
          >
        {/if}
      </div>
    </form>
  </section>

  <!-- Lista de Produtos -->
  <section class="list-section">
    <h2>Produtos Cadastrados</h2>
    <div class="grid">
      {#each products as product}
        <div class="card">
          <img src={product.image as string} alt={product.name} />
          <div class="card-body">
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>R$ {product.price.toFixed(2)}</p>
          </div>
          <div class="card-actions">
            <button
              on:click={() => {
                currentProduct = { ...product };
                isEditing = true;
              }}
              class="btn edit">✎ Editar</button
            >
            <button
              on:click={() => deleteProduct(product.id)}
              class="btn delete">🗑️</button
            >
          </div>
        </div>
      {/each}
    </div>
    {#if totalPages > 1}
      <div class="pagination">
        {#each Array(totalPages) as _, i}
          <button
            class:active={i + 1 === currentPage}
            on:click={() => fetchProducts(i + 1)}>{i + 1}</button
          >
        {/each}
      </div>
    {/if}
  </section>
</div>

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
    background: var(--beeswax);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-small);
  }
  .field-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .field-group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .field-group label {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }
  input,
  textarea,
  select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  .actions-row {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .btn.save {
    background: var(--success-color);
    color: white;
  }
  .btn.cancel {
    background: #aaa;
    color: white;
  }
  .drop-zone {
    margin-top: 1rem;
    padding: 1rem;
    border: 2px dashed #999;
    border-radius: 4px;
    text-align: center;
    position: relative;
    cursor: pointer;
  }
  .drop-zone.drag-over {
    background: #f0f0f0;
    border-color: var(--primary-color);
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
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  .card {
    background: white;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: var(--box-shadow-small);
    display: flex;
    flex-direction: column;
  }
  .card img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  .card-body {
    padding: 0.75rem;
    flex: 1;
  }
  .card-body h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }
  .card-body p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: var(--text-muted);
  }
  .card-actions {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
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

  /* Botão de Adicionar/Atualizar Produto */
  .btn.save {
    background-color: #4caf50; /* verde vibrante */
    color: #fff; /* texto branco */
    border: none;
    padding: 0.75rem 1.5rem; /* tamanho confortável para clique */
    font-size: 1rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      transform 0.1s ease;
  }
  .btn.save:hover {
    background-color: #45a047;
    transform: translateY(-1px);
  }
  .btn.save:active {
    background-color: #3e8e41;
    transform: translateY(0);
  }

  /* Botão de Editar Produto (ícone ou texto) */
  .btn.edit {
    background-color: #2196f3; /* azul claro */
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      transform 0.1s ease;
  }
  .btn.edit:hover {
    background-color: #1e88e5;
    transform: translateY(-1px);
  }
  .btn.edit:active {
    background-color: #1976d2;
    transform: translateY(0);
  }

  /* Indicador para área de upload */
  .drop-zone {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border: 2px dashed #bbb;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }
  .drop-zone:hover {
    background-color: #f9f9f9;
  }
  .drop-zone.drag-over {
    background-color: rgba(76, 175, 80, 0.1);
    border-color: #4caf50;
  }
  .drop-zone p {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }
</style>
