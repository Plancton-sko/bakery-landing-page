<!--src/lib/components/Highlights.svelte-->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Highlight } from "$lib/types/Highlight";
    import { formatPrice } from "$lib/utils/format";

    export let highlights: Highlight[] = [];

    let currentIndex = 0;
    let intervalId: NodeJS.Timeout | null = null;
    let activeHighlights: Highlight[] = [];

    // Reatividade para quando highlights mudam
    $: if (highlights.length > 0) {
        activeHighlights = highlights.slice(); // Copia os highlights
        resetHighlights();
        if (intervalId) {
            clearInterval(intervalId);
        }
        startRotation();
    }

    onMount(() => {
        if (highlights.length > 0) {
            resetHighlights();
            startRotation();
        }
    });

    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });

    function resetHighlights() {
        if (activeHighlights.length === 0) return;

        // Resetar todos os highlights
        activeHighlights = activeHighlights.map((h) => ({
            ...h,
            isActive: false,
        }));

        // Ativar o primeiro
        if (activeHighlights.length > 0) {
            activeHighlights[0].isActive = true;
            currentIndex = 0;
        }
    }

    function rotateHighlights() {
        if (activeHighlights.length <= 1) return;

        // Desativar o atual
        activeHighlights[currentIndex].isActive = false;

        // Próximo índice
        currentIndex = (currentIndex + 1) % activeHighlights.length;

        // Ativar o próximo
        activeHighlights[currentIndex].isActive = true;

        // Forçar reatividade
        activeHighlights = activeHighlights;
    }

    function startRotation() {
        if (activeHighlights.length <= 1) return;

        intervalId = setInterval(rotateHighlights, 5000);
    }

    // Função para ir para um slide específico
    function goToSlide(index: number) {
        if (intervalId) {
            clearInterval(intervalId);
        }

        // Desativar o atual
        activeHighlights[currentIndex].isActive = false;

        // Ativar o selecionado
        currentIndex = index;
        activeHighlights[currentIndex].isActive = true;

        // Forçar reatividade
        activeHighlights = activeHighlights;

        // Reiniciar rotação
        startRotation();
    }
</script>

<!-- Só renderizar se tiver highlights -->
{#if activeHighlights.length > 0}
    <div class="highlights">
        {#each activeHighlights as highlight (highlight.id)}
            {#if highlight.isActive}
                <div class="highlight-item">
                    <enhanced:img
                        src={highlight.image}
                        alt={highlight.name}
                        class="enhanced-img"
                    />
                    <h3>{highlight.name}</h3>
                    <p class="price">R$ {formatPrice(highlight.price)}</p>
                    {#if highlight.description}
                        <p class="description">{highlight.description}</p>
                    {/if}
                </div>
            {/if}
        {/each}

        <!-- Indicadores de posição (dots) -->
        {#if activeHighlights.length > 1}
            <div class="indicators">
                {#each activeHighlights as _, index}
                    <button
                        class="indicator"
                        class:active={index === currentIndex}
                        on:click={() => goToSlide(index)}
                        aria-label="Ir para highlight {index + 1}"
                    ></button>
                {/each}
            </div>
        {/if}
    </div>
{/if}

<style>
    .highlights {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
        width: 40%;
        min-height: 100%;
        position: relative;
    }

    .highlight-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        width: 100%;
        height: auto;
        text-align: center;
        animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .enhanced-img {
        width: 100%;
        height: 400px;
        border-radius: var(--border-radius-medium);
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .enhanced-img:hover {
        transform: scale(1.02);
    }

    .highlight-item h3 {
        margin: 15px 0 10px 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--primary-color);
    }

    .price {
        color: #28a745;
        font-size: 1.3rem;
        font-weight: 700;
        margin: 5px 0;
    }

    .description {
        color: var(--text-color);
        font-size: 1rem;
        line-height: 1.4;
        margin-top: 10px;
        max-width: 90%;
    }

    .indicators {
        display: flex;
        gap: 8px;
        margin-top: 20px;
        justify-content: center;
    }

    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid var(--primary-color);
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.5;
    }

    .indicator:hover {
        opacity: 0.8;
        transform: scale(1.1);
    }

    .indicator.active {
        background: var(--primary-color);
        opacity: 1;
    }

    @media (max-width: 720px) {
        .highlights {
            display: none;
        }
        .enhanced-img {
            min-width: 100%;
            height: 300px;
            border-radius: 8px;
            object-fit: cover;
        }
    }

    @media (min-width: 720px) and (max-width: 1080px) {
        .highlights {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            width: 80%;
            min-height: 100%;
        }
        .enhanced-img {
            min-width: 100%;
            max-height: 300px;
            border-radius: 8px;
            object-fit: cover;
        }
    }
</style>
