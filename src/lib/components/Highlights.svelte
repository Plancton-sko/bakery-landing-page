<!--src/lib/components/Highlights.svelte-->
<script lang="ts">
    import type { Highlight } from "$lib/types/Highlight";
    export let highlights: Highlight[];

    // Função para alternar o destaque ativo
    function rotateHighlights() {
        const currentIndex = highlights.findIndex((highlight) => highlight.isActive);
        highlights[currentIndex].isActive = false;
        const nextIndex = (currentIndex + 1) % highlights.length;
        highlights[nextIndex].isActive = true;
    }

    // Intervalo para alternar os destaques a cada 5 segundos
    setInterval(rotateHighlights, 5000);
</script>

<div class="highlights">
    {#each highlights as highlight (highlight.id)}
        {#if highlight.isActive}
            <div class="highlight-item">
                <img src={highlight.image} alt={highlight.name} />
                <h3>{highlight.name}</h3>
                <p>${highlight.price / 100}</p>
            </div>
        {/if}
    {/each}
</div>

<style>
    .highlights {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
        width: 40%;
        min-height: 100%;
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
    }

    .highlight-item img {
        width: 100%; /* A largura será 100% do container */
        min-height: 400px; /* Limite de altura de 400px */
        border-radius: var(--border-radius-medium);
        object-fit: cover; /* Faz a imagem se ajustar como se fosse um "zoom" */
    }


    .highlight-item h3 {
        margin: 10px 0;
        font-size: 1.5rem;
    }

    .highlight-item p {
        color: var(--text-color);
    }

    @media (max-width:720px) {
    .highlights{
        display: none;
      }
    .highlight-item img {
        min-width: 100%; /* A largura será 100% do container */
        height: 300px; /* Limite de altura de 400px */
        border-radius: 8px;
        object-fit: cover; /* Faz a imagem se ajustar como se fosse um "zoom" */
    }
  }
  @media(min-width:720px) and (max-width: 1080px){
    .highlights {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
        width: 80%;
        min-height: 100%;
    }
    .highlight-item img {
        min-width: 100%; /* A largura será 100% do container */
        max-height: 300px; /* Limite de altura de 400px */
        border-radius: 8px;
        object-fit: cover; /* Faz a imagem se ajustar como se fosse um "zoom" */

    }
  }

</style>
