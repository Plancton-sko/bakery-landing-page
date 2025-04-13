<!-- src/lib/components/AdminProducts.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import type { Product } from "$lib/types/Product";
  import { config } from "$lib/services/config";

  let products: Product[] = [];
  let currentProduct: Partial<Product> = {};
  let isEditing = false;
  let currentPage = 1;
  let totalPages = 1;

  // Referência para o campo file
  let fileInput: HTMLInputElement;

  const baseUrl = config.baseUrl;

  const fetchProducts = async (page = 1) => {
    const res = await fetch(baseUrl + `/products?page=${page}`);
    const data = await res.json();

     products = data.map((product: Product) => ({
    id: product.id,
    name: product.name,
    category: product.category, 
    description: product.description,
    price: Number(product.price),
    image: product.image // A imagem vem como base64
  }));

  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(baseUrl + `/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchProducts(currentPage);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...currentProduct,
      price: currentProduct.price,
    };

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? baseUrl + `/products/${currentProduct.id}`
      : baseUrl + "/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchProducts(currentPage);
      isEditing = false;
      currentProduct = {};
    }
  };

  // Função para fazer upload da imagem via fetch
  const handleImageUpload = async () => {
    if (!fileInput.files || fileInput.files.length === 0) {
      console.error("Nenhum arquivo selecionado");
      return;
    }

    const file = fileInput.files[0];
    // Monta o FormData com o arquivo selecionado
    const formData = new FormData();
    formData.append("file", file);

    // Realiza a chamada para o endpoint do NestJS para upload
    const res = await fetch(baseUrl + `/products/${currentProduct.id}/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const updatedProduct = await res.json();
      // Atualiza a imagem do produto na lista se necessário
      products = products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
      );
      alert("Upload realizado com sucesso!");
    } else {
      alert("Erro ao realizar upload.");
      console.error("Erro no upload:", await res.text());
    }
  };

  onMount(fetchProducts);
</script>

<div class="admin-container">
  <h2>Gerenciamento de Produtos</h2>

  <!-- Formulário para cadastrar/editar produtos -->
  <div class="product-form">
    <input type="text" bind:value={currentProduct.name} placeholder="Nome" />
    <textarea bind:value={currentProduct.description} placeholder="Descrição"
    ></textarea>
    <input
      type="number"
      bind:value={currentProduct.price}
      placeholder="Preço"
    />
    <select bind:value={currentProduct.category}>
      <option value="bread">Pão</option>
      <option value="coffee">Café</option>
      <option value="cookies">Cookies</option>
      <option value="others">Outros</option>
    </select>
    <button on:click={handleSubmit}>
      {isEditing ? "Atualizar" : "Adicionar"} Produto
    </button>
  </div>

  <!-- Se o produto estiver sendo editado, permite o upload de imagem -->
  {#if currentProduct.id}
    <div class="upload-section">
      <label for="image-upload">Upload da Imagem:</label>
      <input
        type="file"
        id="image-upload"
        bind:this={fileInput}
        accept="image/*"
      />
      <button on:click={handleImageUpload}>Fazer Upload</button>
    </div>
  {/if}

  <!-- Listagem dos produtos -->
  <div class="product-grid">
    {#each products as product (product.id)}
      <div transition:fade class="product-card">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Preço: {product.price}</p>
        <!-- Se a imagem foi atualizada via Minio, ela virá em URL -->
        {#if product.image}
          <img src={product.image as string} alt={product.name} loading="lazy" />
        {/if}
        <div class="actions">
          <button
            on:click={() => {
              currentProduct = product;
              isEditing = true;
            }}
          >
            Editar
          </button>
          <button on:click={() => deleteProduct(product.id)}> Excluir </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Paginação -->
  <div class="pagination">
    {#each { length: totalPages } as _, i}
      <button
        class:active={i + 1 === currentPage}
        on:click={() => fetchProducts(i + 1)}
      >
        {i + 1}
      </button>
    {/each}
  </div>
</div>

<style>
  .admin-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
  }
  .product-form {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
    background: var(--beeswax);
    padding: 1.5rem;
    border-radius: var(--border-radius);
  }
  .upload-section {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  .product-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: var(--box-shadow-small);
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .pagination {
    margin-top: 1.5rem;
    text-align: center;
  }
  .pagination button.active {
    font-weight: bold;
  }
</style>
