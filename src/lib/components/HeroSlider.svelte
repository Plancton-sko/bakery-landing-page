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
  {#each slides as { src, alt, title, description, ctaText, ctaButton }, index}
    <div class="slide {index === $currentSlideIndex ? 'active' : ''}">
      <picture>
        <img data-enhanced
             src="{src}?w=1920"
             alt="{alt}"
             loading="lazy"
        />
      </picture>

      <div class="overlay"></div>

      {#if index === $currentSlideIndex}
        <div class="slide-content">
          <h1>{title}</h1>
          <p>{description}</p>
          <button class="cta-button" on:click={() => (window.location.href = ctaButton)}>
            {ctaText}
          </button>
        </div>
      {/if}
    </div>
  {/each}

  <div class="click-area left" on:click={previousSlide}></div>
  <div class="click-area right" on:click={nextSlide}></div>

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
    font-family: var( --font-tertiary);
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
    box-shadow: var( --box-shadow);
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
