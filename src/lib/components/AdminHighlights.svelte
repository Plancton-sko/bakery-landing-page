<!--src/routes/admin/highlights/+page.svelte-->
<script lang="ts">
    import { onMount } from "svelte";
    import type { Product } from "$lib/types/Product";
    import type { Highlight } from "$lib/types/Highlight";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { config } from '$lib/services/config';

    import {
        highlights,
        highlightsLoading,
        highlightsError,
        highlightsSuccess,
        fetchHighlights,
        saveHighlights,
        removeHighlight,
        clearMessages,
    } from "$lib/stores/highlightsStore";

    let products: Product[] = [];
    let highlightsData: Highlight[] = [];
    let selectedProducts: Set<string> = new Set();
    let loading = false;
    let error = "";
    let success = "";

    // Reatividade dos stores
    $: loading = $highlightsLoading;
    $: error = $highlightsError;
    $: success = $highlightsSuccess;
    $: highlightsData = $highlights;
    $: selectedProducts = new Set(highlightsData.map((h) => h.id));

    const baseUrl = config.baseUrl;

    onMount(async () => {
        await loadData();
    });

    async function loadData() {
        try {
            clearMessages();
            const productsRes = await fetch(`${baseUrl}/products`, {
                credentials: "include",
            });

            if (!productsRes.ok) {
                throw new Error("Erro ao carregar produtos");
            }

            products = await productsRes.json();
            await fetchHighlights();
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        }
    }

    function toggleProduct(productId: string) {
        if (selectedProducts.has(productId)) {
            selectedProducts.delete(productId);
        } else {
            selectedProducts.add(productId);
        }
        selectedProducts = selectedProducts; // Trigger reactivity
    }

    async function saveHighlightsData() {
        try {
            clearMessages();
            const highlightData = Array.from(selectedProducts).map(
                (productId) => {
                    const product = products.find((p) => p.id === productId);
                    return {
                        id: productId,
                        name: product?.name || "",
                        price: product?.price || 0,
                        image: product?.image || "",
                        description: product?.description,
                        isActive: false,
                    };
                },
            );

            await saveHighlights(highlightData);
        } catch (err) {
            console.error("Erro ao salvar highlights:", err);
        }
    }

    async function removeHighlightData(highlightId: string) {
        try {
            clearMessages();
            await removeHighlight(highlightId);
        } catch (err) {
            console.error("Erro ao remover highlight:", err);
        }
    }

    function formatPrice(price: number): string {
        return (price / 100).toFixed(2);
    }
</script>

<svelte:head>
    <title>Gerenciar Highlights - Admin</title>
</svelte:head>

<div class="admin-highlights">
    <div class="header">
        <h1>Gerenciar Highlights</h1>
        <p>
            Selecione os produtos que devem aparecer como destaque na seção "Hot
            Deals"
        </p>
    </div>

    {#if error}
        <div class="alert error">
            {error}
        </div>
    {/if}

    {#if success}
        <div class="alert success">
            {success}
        </div>
    {/if}

    {#if loading}
        <div class="loading">
            <div class="spinner"></div>
            <p>Carregando...</p>
        </div>
    {:else}
        <div class="content">
            <!-- Highlights Atuais -->
            <div class="current-highlights">
                <h2>Highlights Atuais ({highlightsData.length})</h2>
                {#if highlightsData.length > 0}
                    <div class="highlights-grid">
                        {#each highlightsData as highlight}
                            <div class="highlight-card current">
                                <div class="image-container">
                                    <enhanced:img
                                        src={highlight.image}
                                        alt={highlight.name}
                                        class="product-image"
                                    />
                                </div>
                                <div class="card-content">
                                    <h3>{highlight.name}</h3>
                                    <p class="price">
                                        R$ {formatPrice(highlight.price)}
                                    </p>
                                    {#if highlight.description}
                                        <p class="description">
                                            {highlight.description}
                                        </p>
                                    {/if}
                                </div>
                                <button
                                    class="remove-btn"
                                    on:click={() =>
                                        removeHighlightData(highlight.id)}
                                    disabled={loading}
                                >
                                    ✕
                                </button>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="empty-state">
                        <p>Nenhum highlight configurado</p>
                    </div>
                {/if}
            </div>

            <!-- Seleção de Produtos -->
            <div class="product-selection">
                <h2>Selecionar Produtos</h2>
                <div class="selection-info">
                    <p>{selectedProducts.size} produto(s) selecionado(s)</p>
                    <button
                        class="save-btn"
                        on:click={saveHighlightsData}
                        disabled={loading || selectedProducts.size === 0}
                    >
                        Salvar Highlights
                    </button>
                </div>

                <div class="products-grid">
                    {#each products as product}
                        <div
                            class="product-card"
                            class:selected={selectedProducts.has(product.id)}
                            on:click={() => toggleProduct(product.id)}
                        >
                            <div class="image-container">
                                <enhanced:img
                                    src={product.image}
                                    alt={product.name}
                                    class="product-image"
                                />
                                <div class="selection-indicator">
                                    {#if selectedProducts.has(product.id)}
                                        <div class="check-icon">✓</div>
                                    {/if}
                                </div>
                            </div>
                            <div class="card-content">
                                <h3>{product.name}</h3>
                                <p class="price">
                                    R$ {formatPrice(product.price)}
                                </p>
                                <p class="category">{product.category}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .admin-highlights {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .header {
        margin-bottom: 2rem;
        text-align: center;
    }

    .header h1 {
        color: var(--primary-color);
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .header p {
        color: var(--text-color);
        font-size: 1.1rem;
    }

    .alert {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-weight: 500;
    }

    .alert.error {
        background-color: #fee;
        color: #c33;
        border: 1px solid #fcc;
    }

    .alert.success {
        background-color: #efe;
        color: #373;
        border: 1px solid #cfc;
    }

    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem;
        gap: 1rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--primary-color);
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

    .content {
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

    .current-highlights h2,
    .product-selection h2 {
        color: var(--primary-color);
        font-size: 1.8rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }

    .highlights-grid,
    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    .highlight-card,
    .product-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
    }

    .product-card {
        cursor: pointer;
        border: 2px solid transparent;
    }

    .product-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .product-card.selected {
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }

    .highlight-card.current {
        border: 2px solid #28a745;
    }

    .image-container {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
    }

    .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
        transform: scale(1.05);
    }

    .selection-indicator {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ddd;
        transition: all 0.3s ease;
    }

    .product-card.selected .selection-indicator {
        background: var(--primary-color);
        border-color: var(--primary-color);
    }

    .check-icon {
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
    }

    .remove-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #dc3545;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .remove-btn:hover {
        background: #c82333;
        transform: scale(1.1);
    }

    .card-content {
        padding: 1.5rem;
    }

    .card-content h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--primary-color);
    }

    .price {
        font-size: 1.1rem;
        font-weight: 700;
        color: #28a745;
        margin-bottom: 0.5rem;
    }

    .category {
        font-size: 0.9rem;
        color: #666;
        text-transform: capitalize;
    }

    .description {
        font-size: 0.9rem;
        color: #666;
        line-height: 1.4;
        margin-top: 0.5rem;
    }

    .selection-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .selection-info p {
        font-weight: 600;
        color: var(--primary-color);
    }

    .save-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .save-btn:hover:not(:disabled) {
        background: #654321;
        transform: translateY(-1px);
    }

    .save-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
    }

    .empty-state p {
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        .admin-highlights {
            padding: 1rem;
        }

        .header h1 {
            font-size: 2rem;
        }

        .highlights-grid,
        .products-grid {
            grid-template-columns: 1fr;
        }

        .selection-info {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
    }
</style>
