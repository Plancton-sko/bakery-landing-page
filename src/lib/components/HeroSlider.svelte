<!--src/lib/components/HeroSlider.svelte-->
<script lang="ts">
  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { slides } from "$lib/consts/Slides";

  const BREAKPOINTS = {
    mobile: 640, // 0px - 640px
    tablet: 1024, // 641px - 1024px
    desktop: 1280, // 1025px - 1280px
    hd: 1920, // 1281px+
  };

  const currentSlideIndex = writable(0);
  let autoSlideInterval: NodeJS.Timeout;

  onMount(() => {
    autoSlideInterval = setInterval(() => {
      currentSlideIndex.update((n: number) => (n + 1) % slides.length);
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
    <div class:active={$currentSlideIndex === index} class="slide">
      <enhanced:img
        {src}
        {alt}
        srcset="
          {src}?w=400&q=80&format=webp 400w,
          {src}?w=800&q=80&format=webp 800w,
          {src}?w=1200&q=80&format=webp 1200w
        "
        sizes="(max-width: 640px) 100vw,
              (max-width: 1024px) 90vw,
              (max-width: 1280px) 85vw,
              80vw"
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        class="hero-image"
      />

      {#if $currentSlideIndex === index}
        <div class="slide-content">
          <h1>{title}</h1>
          <p>{description}</p>
          <a href={ctaButton} class="cta-button">{ctaText}</a>
        </div>
      {/if}
    </div>
  {/each}

  <div class="click-area left" on:click={previousSlide}></div>
  <div class="click-area right" on:click={nextSlide}></div>

  <!-- Controles -->
  <div class="controls">
    {#each slides as _, index}
      <button
        on:click={() => goToSlide(index)}
        class:active={$currentSlideIndex === index}
        aria-label={`Slide ${index + 1}`}
      ></button>
    {/each}
  </div>
</section>

<style lang="scss">
  $mobile-break: 640px;
  $tablet-break: 1024px;
  $desktop-break: 1280px;

  .hero-image {
    width: 100%;
    height: 100vh;
    max-height: 800px;
    object-fit: cover;
    transition: opacity 0.5s ease;
  }

  .hero-image[data-loading] {
    opacity: 0.8;
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
