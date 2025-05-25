<!--src/lib/components/HeroSlider.svelte-->
<script lang="ts">
  import { onMount } from "svelte";
  import { writable, type Writable, get } from "svelte/store";
  import { config } from "$lib/services/config";

  // Definição da interface Slide com base no backend
  interface Slide {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    buttonText?: string;
    buttonLink?: string;
    order: number;
  }
  
  // Store para armazenar os slides
  const slidesStore: Writable<Slide[]> = writable([]);
  const currentSlideIndex = writable(0);
  let autoSlideInterval: ReturnType<typeof setInterval>;
  let loading = true;
  let error = false;
  
  // URL base para API
  const baseUrl = config.baseUrl;

  onMount(() => {
    const fetchSlides = async () => {
      try {
        // Buscar slides do backend
        const response = await fetch(`${baseUrl}/slides`);
        if (!response.ok) throw new Error('Falha ao buscar slides');
        
        const data = await response.json();
        // Ordenar slides por ordem
        data.sort((a: Slide, b: Slide) => a.order - b.order);
        slidesStore.set(data);
        
        // Iniciar autoplay somente se houver slides
        if (data.length > 0) {
          autoSlideInterval = setInterval(() => {
            currentSlideIndex.update((n: number) => (n + 1) % data.length);
          }, 5000);
        }
        
        loading = false;
      } catch (err) {
        console.error("Erro ao carregar slides:", err);
        error = true;
        loading = false;
      }
    };

    fetchSlides();

    return () => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    };
  });

  function goToSlide(index: number) {
    currentSlideIndex.set(index);
  }

  function nextSlide() {
    const slides = get(slidesStore);
    currentSlideIndex.update((n) => (n + 1) % slides.length);
  }

  function previousSlide() {
    const slides = get(slidesStore);
    currentSlideIndex.update((n) => (n - 1 + slides.length) % slides.length);
  }

  // Função auxiliar para tratar caminhos de imagem
  function getImagePath(path: string) {
    // Se a imagem já começa com http ou é uma URL absoluta, não é necessário modificar
    if (path.startsWith('http') || path.startsWith('/')) {
      return path;
    }
    // Caso contrário, adicione o caminho base (ajuste conforme necessário)
    return `${baseUrl}/${path}`;
  }
</script>

<section id="hero">
  {#if loading}
    <div class="loading">
      <p>Carregando slides...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>Não foi possível carregar os slides. Por favor, tente novamente mais tarde.</p>
    </div>
  {:else}
    {#each $slidesStore as slide, index}
      <div class:active={$currentSlideIndex === index} class="slide">
        <img
          src={getImagePath(slide.image)}
          alt={slide.title}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          class="hero-image"
        />

        {#if $currentSlideIndex === index}
          <div class="slide-content">
            <h1>{slide.title}</h1>
            {#if slide.subtitle}
              <p>{slide.subtitle}</p>
            {/if}
            {#if slide.buttonText && slide.buttonLink}
              <a href={slide.buttonLink} class="cta-button">{slide.buttonText}</a>
            {/if}
          </div>
        {/if}
      </div>
    {/each}

    {#if $slidesStore.length > 1}
      <div class="click-area left" on:click={previousSlide}></div>
      <div class="click-area right" on:click={nextSlide}></div>

      <!-- Controles -->
      <div class="controls">
        {#each $slidesStore as _, index}
          <button
            on:click={() => goToSlide(index)}
            class:active={$currentSlideIndex === index}
            aria-label={`Slide ${index + 1}`}
          ></button>
        {/each}
      </div>
    {/if}
  {/if}
</section>

<style lang="css">
  /* Mantemos o CSS original com algumas adições */
  
  .loading, .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    width: 100%;
    background: #f7f0e5;
    color: #555;
    font-size: 1.2rem;
  }
  
  .error {
    color: #d32f2f;
  }

  .hero-image {
    width: 100%;
    height: 100vh;
    max-height: 800px;
    object-fit: cover;
    transition: opacity 0.5s ease;
  }

  #hero {
    position: relative;
    height: 800px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f0e5;
  }

  .slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1s ease-in-out;
  }

  .slide.active {
    opacity: 1;
  }

  .slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.8);
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--overlay-dark);
    z-index: 1;
  }

  .slide-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    text-align: center;
    color: var(--white-text);
    font-family: var(--font-tertiary);
    max-width: 80%;
  }

  .slide-content h1 {
    font-size: 3rem;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .slide-content p {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }

  .cta-button {
    background-color: var(--button-background);
    color: var(--white-text);
    border: none;
    padding: 15px 30px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: var(--box-shadow);
  }

  .cta-button:hover {
    background-color: var(--button-background-hover);
  }

  .click-area {
    position: absolute;
    top: 0;
    height: 100%;
    width: 50%;
    z-index: 3;
    cursor: pointer;
  }

  .click-area.left {
    left: 0;
  }

  .click-area.right {
    right: 0;
  }

  .controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
  }

  .controls button {
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.6);
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }

  .controls button.active {
    background: rgba(255, 255, 255, 1);
  }

  @media (max-width: 768px) {
    #hero {
      height: 500px;
    }

    .slide-content h1 {
      font-size: 2rem;
    }

    .slide-content p {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    #hero {
      height: 400px;
    }

    .slide-content {
      max-width: 90%;
    }

    .slide-content h1 {
      font-size: 1.5rem;
    }

    .slide-content p {
      font-size: 0.9rem;
    }

    .cta-button {
      font-size: 0.9rem;
      padding: 10px 20px;
    }
  }
</style>