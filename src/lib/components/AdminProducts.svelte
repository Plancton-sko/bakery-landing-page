<!-- src/lib/components/AdminProducts.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import type { Product } from "$lib/types/Product";

    let products: Product[] = [];
    let currentProduct: Partial<Product> = {};
    let isEditing = false;
    let currentPage = 1;
    let totalPages = 1;

    const fetchProducts = async (page = 1) => {
        const res = await fetch(`/api/products?page=${page}`);
        const { data, meta } = await res.json();

        products = data.map((product: any) => ({
            ...product,
            price: parseFloat(product.price), // Converter Decimal para number
        }));

        currentPage = meta.page;
        totalPages = meta.totalPages;
    };

    const deleteProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
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
            price: currentProduct.price?.toString(), // Converter para string para o Prisma
        };

        const method = isEditing ? "PUT" : "POST";
        const url = isEditing
            ? `/api/products/${currentProduct.id}`
            : "/api/products";

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

    onMount(fetchProducts);
</script>

<div class="admin-container">
    <h2>Gerenciamento de Produtos</h2>

    <!-- Formulário -->
    <div class="product-form">
        <input
            type="text"
            bind:value={currentProduct.name}
            placeholder="Nome"
        />
        <textarea
            bind:value={currentProduct.description}
            placeholder="Descrição"
        />
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
        <button on:click={handleSubmit}
            >{isEditing ? "Atualizar" : "Adicionar"} Produto</button
        >
    </div>

    <!-- Listagem -->
    <div class="product-grid">
        {#each products as product (product.id)}
            <div transition:fade class="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Preço: {product.price}</p>
                <div class="actions">
                    <button
                        on:click={() => {
                            currentProduct = product;
                            isEditing = true;
                        }}
                    >
                        Editar
                    </button>
                    <button on:click={() => deleteProduct(product.id)}>
                        Excluir
                    </button>
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
</style>
