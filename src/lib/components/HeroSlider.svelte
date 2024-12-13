  <!-- src/lib/components/HeroSlider.svelte -->
  <script lang="ts">
    import { onMount } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import { slides } from "$lib/consts/Slides";

    let currentSlideIndex: Writable<number> = writable(0);
    let autoSlideInterval: ReturnType<typeof setInterval>;

    onMount(() => {
      autoSlideInterval = setInterval(() => {
        currentSlideIndex.update((n) => (n + 1) % slides.length);
      }, 5000);

      return () => clearInterval(autoSlideInterval);
    });

    function goToSlide(index: number) {
      currentSlideIndex.set(index);
    }

    function nextSlide() {
      currentSlideIndex.update((n) => (n + 1) % slides.length);
    }

    function previousSlide() {
      currentSlideIndex.update((n) => (n - 1 + slides.length) % slides.length);
    }
  </script>

  <section id="hero">
    <!-- Cada slide -->
    {#each slides as { src, alt, title, description }, index}
      <picture class="slide" class:active={index === $currentSlideIndex}>
        <img src={src} alt={alt} loading="lazy"/>
      </picture>
    {/each}

    <div class="overlay"></div>

    <!-- Textos específicos de cada slide -->
    {#each slides as { title, description }, index}
      {#if index === $currentSlideIndex}
        <div class="slide-text">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      {/if}
    {/each}

    <!-- Áreas clicáveis para navegação -->
    <div class="click-area left" on:click={previousSlide}></div>
    <div class="click-area right" on:click={nextSlide}></div>

    <!-- Controles para selecionar slides específicos -->
    <div class="controls">
      {#each slides as _, index}
        <button
          type="button"
          on:click={() => goToSlide(index)}
          class:active={index === $currentSlideIndex}
          aria-label={`Go to slide ${index + 1}`}
        ></button>
      {/each}
    </div>
  </section>

  <style>
    /* Estilos gerais para o hero slider */
    #hero {
      position: relative;
      height: 800px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      background-color: #f8f8f8; /* Adiciona um fundo padrão */
    }

    /* Cada slide ocupa toda a área do hero */
    .slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 1s ease-in-out;
    }

    /* Slide ativo visível */
    .slide.active {
      opacity: 1;
    }

    /* Imagem dentro de cada slide */
    #hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.8); /* Escurece ligeiramente as imagens para melhor legibilidade do texto */
    }

    /* Texto específico de cada slide */
    .slide-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      color: #fff;
      text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.5); /* Aumenta o contraste do texto */
      text-align: center;
      max-width: 80%;
      line-height: 1.5;
    }

    .slide-text h1 {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 15px;
      letter-spacing: 1px; /* Adiciona espaço entre letras para uma leitura mais clara */
    }

    .slide-text p {
      font-size: 1.5rem;
      margin: 0 auto;
      max-width: 80%;
      opacity: 0.9;
    }

    /* Overlay para escurecer a imagem e melhorar a leitura do texto */
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1;
    }

    /* Áreas clicáveis para navegar entre slides */
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

    /* Controles do slider (botões) */
    .controls {
      position: absolute;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 4;
    }

    .controls button {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.6);
      transition: background 0.3s, transform 0.3s;
      cursor: pointer;
    }

    .controls button.active,
    .controls button:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: scale(1.2);
    }

    /* Estilização da responsividade */
    @media (max-width: 1320px) {
      #hero {
        height: 550px;
      }

      .slide-text h1 {
        font-size: 2.5rem;
      }

      .slide-text p {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 768px) {
      #hero {
        height: 500px;
      }

      .slide-text {
        max-width: 90%;
      }

      .slide-text h1 {
        font-size: 2rem;
      }

      .slide-text p {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      #hero {
        height: 450px;
      }

      .slide-text {
        max-width: 100%;
        padding: 0 20px;
      }

      .slide-text h1 {
        font-size: 1.8rem;
      }

      .slide-text p {
        font-size: 0.9rem;
      }

      .controls button {
        width: 10px;
        height: 10px;
      }
    }

    @media (max-width: 479px) {
      #hero {
        height: 350px;
        width: 100%;
      }

      .slide-text {
        max-width: 100%;
        padding: 0 20px;
      }

      .slide-text h1 {
        font-size: 1.8rem;
      }

      .slide-text p {
        font-size: 0.9rem;
      }

      .controls button {
        width: 10px;
        height: 10px;
      }
    }

  </style>

