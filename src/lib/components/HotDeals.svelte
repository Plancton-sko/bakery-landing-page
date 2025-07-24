<!--src/lib/components/HotDeals.svelte-->
<script lang="ts">
    import { onMount } from "svelte";
    import { products } from "$lib/consts/Products";
    import ProductCard from "./ProductCard.svelte";
    import { highlights, fetchHighlights } from "$lib/stores/highlightsStore";
    import type { Highlight } from "$lib/types/Highlight";
    import { Categories } from '$lib/consts/Categories';


    let highlightsData: Highlight[] = [];
    let loading = true;

    // Reatividade do store
    $: highlightsData = $highlights;

    onMount(async () => {
        try {
            await fetchHighlights();
        } catch (error) {
            console.error("Erro ao carregar highlights:", error);
        } finally {
            loading = false;
        }
    });
</script>

<div class="hot-deals">
    <h2>Hot Deals</h2>
    <p>Confira nossos produtos em destaque com as melhores ofertas</p>

    <div class="products">
        {#if loading}
            <div class="loading-highlights">
                <div class="spinner"></div>
                <p>Carregando destaques...</p>
            </div>
        {:else if highlightsData.length > 0}
            <div class="highlight-grid">
                {#each highlightsData as highlight}
                    <ProductCard
                        product={{
                            id: highlight.id,
                            name: highlight.name,
                            price: highlight.price,
                            description: highlight.description ?? '',
                            image: highlight.image,
                            category: highlight.category ??  Categories.OTHERS, 
                        }}
                        isHighlighted={true}
                    />
                {/each}
            </div>
        {:else}
            <div class="no-highlights">
                <p>Nenhum produto em destaque no momento</p>
            </div>
        {/if}

        <div class="product-grid">
            {#each products as product, index}
                <ProductCard
                    {product}
                    isHighlighted={highlightsData.some(
                        (h) => h.id === product.id,
                    )}
                />
            {/each}
        </div>
    </div>
</div>

<style>
    /* Estilo geral da seção */
    .hot-deals {
        display: flex;
        flex-direction: column;
        text-align: center;
        padding: 60px 20px;
        margin: 20px auto;
        max-width: 1200px;
        border-radius: 12px;
    }

    .hot-deals h2 {
        font-family: "Playfair Display", serif;
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 20px;
        color: var(--primary-color);
    }

    .hot-deals p {
        font-size: 18px;
        color: var(--primary-color);
        margin-bottom: 30px;
    }

    /* Área de produtos */
    .products {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        margin: 0 auto;
    }

    .product-grid {
        display: grid;
        gap: 20px;
        width: 100%;
    }

    /* Loading e estados vazios */
    .loading-highlights {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem;
        gap: 1rem;
        width: 40%;
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

    .no-highlights {
        width: 40%;
        padding: 2rem;
        text-align: center;
        color: #666;
        font-style: italic;
    }

    /* Estilo responsivo */
    @media (max-width: 480px) {
        .product-grid {
            grid-template-columns: 1fr;
        }

        .loading-highlights,
        .no-highlights {
            width: 100%;
        }
    }

    @media (min-width: 481px) and (max-width: 720px) {
        .product-grid {
            grid-template-columns: 1fr 1fr;
        }

        .loading-highlights,
        .no-highlights {
            width: 80%;
        }
    }

    @media (min-width: 721px) and (max-width: 1080px) {
        .product-grid {
            grid-template-columns: 1fr 1fr 1fr;
        }

        .loading-highlights,
        .no-highlights {
            width: 80%;
        }
    }

    @media (min-width: 1081px) {
        .product-grid {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }

        .products {
            flex-direction: row;
        }

        .loading-highlights,
        .no-highlights {
            width: 40%;
        }
    }
</style>
