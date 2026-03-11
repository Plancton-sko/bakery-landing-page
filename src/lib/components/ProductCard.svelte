<!-- src/lib/components/ProductCard.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Product } from "$lib/types/Product";
  import Modal from "$lib/components/Modal.svelte";
  import BottomSheet from "$lib/components/BottomSheet.svelte";
  import { addToCart, isCartOpen } from "$lib/stores/cart";
  import { formatPrice } from "$lib/utils/format";
  import { activeDiscounts } from "$lib/consts/Discounts";
  import { calculateDiscounts } from "$lib/utils/discounts";

  export let product: Product;
  export let isHighlighted: boolean = false;

  let isModalOpen = false;
  let quantity = 1;
  let isMobile = false;
  const quantityId = `quantity-${Math.random().toString(36).slice(2, 10)}`;

  $: discountInfo = calculateDiscounts(product, activeDiscounts);

  const getSrcSet = (format: string) =>
    product?.images
      ?.filter((img) => img.format === format)
      .map((img) => `${img.url}?auto=compress&cs=tinysrgb&w=${img.width}&dpr=1 ${img.width}w`)
      .join(", ") ?? "";

  const getDefaultImage = () => {
    const preferred = product?.images?.find((img) => img.format === "avif" && img.size === "medium");
    return preferred
      ? `${preferred.url}?auto=compress&cs=tinysrgb&w=800&dpr=1`
      : typeof product?.image === "string"
      ? product.image
      : "/placeholder.jpg";
  };

  const updateMobile = () => {
    isMobile = window.innerWidth <= 768;
  };

  onMount(() => {
    updateMobile();
    window.addEventListener("resize", updateMobile);
  });

  onDestroy(() => {
    window.removeEventListener("resize", updateMobile);
  });

  const openModal = () => {
    isModalOpen = true;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal();
    }
  };

  const closeModal = () => {
    isModalOpen = false;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    isCartOpen.set(true);
    closeModal();
  };

  $: srcSetAvif = getSrcSet('avif');
  $: srcSetWebp = getSrcSet('webp');
  $: srcSetJpeg = getSrcSet('jpeg');
  $: fallbackImage = getDefaultImage();
</script>

<div
  class="product-card {isHighlighted ? 'highlight' : ''}"
  on:click={openModal}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
>
  {#if discountInfo}
    <div class="discount-badge">
      {#if discountInfo.discountType === "percentage"}
        {`${((discountInfo.discountAmount / discountInfo.originalPrice) * 100).toFixed(0)}% OFF`}
      {:else}
        {`-${formatPrice(discountInfo.discountAmount)}`}
      {/if}
    </div>
  {/if}

  <picture>
    {#if srcSetAvif}
      <source srcset={srcSetAvif} type="image/avif" />
    {/if}
    {#if srcSetWebp}
      <source srcset={srcSetWebp} type="image/webp" />
    {/if}
    {#if srcSetJpeg}
      <source srcset={srcSetJpeg} type="image/jpeg" />
    {/if}
    <img
      src={fallbackImage}
      alt={product?.name ?? 'Produto'}
      loading="lazy"
      decoding="async"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
    />
  </picture>

  <h3>{product?.name ?? 'Produto'}</h3>

  <div class="price-container">
    {#if discountInfo}
      <p class="original-price">{formatPrice(discountInfo.originalPrice)}</p>
      <p class="discounted-price">{formatPrice(discountInfo.finalPrice)}</p>
    {:else}
      <p>{formatPrice(product?.price ?? 0)}</p>
    {/if}
  </div>
</div>

{#if isMobile}
  <BottomSheet isOpen={isModalOpen} onClose={closeModal}>
    <div class="bottomSheet-content">
      <h2>{product?.name ?? 'Produto'}</h2>
      <p>{product?.description ?? ''}</p>

      <picture>
        {#if srcSetAvif}
          <source srcset={srcSetAvif} type="image/avif" />
        {/if}
        {#if srcSetWebp}
          <source srcset={srcSetWebp} type="image/webp" />
        {/if}
        {#if srcSetJpeg}
          <source srcset={srcSetJpeg} type="image/jpeg" />
        {/if}
        <img
          src={fallbackImage}
          alt={product?.name ?? 'Produto'}
          loading="lazy"
          decoding="async"
          sizes="100vw"
          class="imgBottomSheet"
        />
      </picture>

      <div class="modal-price">
        {#if discountInfo}
          <p class="original-price">{formatPrice(discountInfo.originalPrice)}</p>
          <p class="discounted-price">{formatPrice(discountInfo.finalPrice)}</p>
        {:else}
          <p>{formatPrice(product?.price ?? 0)}</p>
        {/if}
      </div>

      <label for={quantityId}>Quantidade:</label>
      <input
        type="number"
        id={quantityId}
        bind:value={quantity}
        min="1"
        class="quantity-input"
      />

      <button class="add-to-cart" on:click|stopPropagation={handleAddToCart}>
        Adicionar ao Carrinho
      </button>
    </div>
  </BottomSheet>
{:else}
  <Modal isOpen={isModalOpen} onClose={closeModal}>
    <div class="modal-content">
      <h2>{product?.name ?? 'Produto'}</h2>
      <p>{product?.description ?? ''}</p>

      <picture>
        {#if srcSetAvif}
          <source srcset={srcSetAvif} type="image/avif" />
        {/if}
        {#if srcSetWebp}
          <source srcset={srcSetWebp} type="image/webp" />
        {/if}
        {#if srcSetJpeg}
          <source srcset={srcSetJpeg} type="image/jpeg" />
        {/if}
        <img
          src={fallbackImage}
          alt={product?.name ?? 'Produto'}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
          class="imgModal"
        />
      </picture>

      <div class="modal-price">
        {#if discountInfo}
          <p class="original-price">{formatPrice(discountInfo.originalPrice)}</p>
          <p class="discounted-price">{formatPrice(discountInfo.finalPrice)}</p>
        {:else}
          <p>{formatPrice(product?.price ?? 0)}</p>
        {/if}
      </div>

      <div class="quantity-controls">
        <label for={quantityId}>Quantidade:</label>
        <input
          type="number"
          id={quantityId}
          bind:value={quantity}
          min="1"
          class="quantity-input"
        />
      </div>

      <button class="add-to-cart" on:click|stopPropagation={handleAddToCart}>
        Adicionar ao Carrinho
      </button>
    </div>
  </Modal>
{/if}

<style>
  /* Estilos mantidos do original com adições para descontos */
  .discount-badge {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--danger-color);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    z-index: 1;
  }

  .price-container {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .original-price {
    text-decoration: line-through;
    color: #999;
    font-size: 0.9rem;
  }

  .discounted-price {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 1.1rem;
  }

  .product-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    border: 1px solid #ccc;
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    background: #fdfdfd;
    transition:
      box-shadow 0.3s ease,
      transform 0.2s ease;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .product-card:hover {
    box-shadow: var(--box-shadow-intense);
    transform: translateY(-3px);
  }

  /* .product-card img {
    width: 100%;
    max-width: 240px;
    height: 240px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: var(--box-shadow-medium);
  } */

  .product-card h3 {
    font-family: var(--font-primary);
    font-size: clamp(16px, 4vw, 20px);
    font-weight: bold;
    color: var(--primary-color);
    margin: 16px 0 8px;
    text-align: center;
  }

  .product-card p {
    font-family: var(--font-primary);
    font-size: clamp(14px, 3.5vw, 16px);
    color: var(--light-text);
    text-align: center;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    font-family: var(--font-primary);
    max-width: 600px;
    margin: auto;
  }

  .bottomSheet-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border-radius: var(--border-radius);
    font-family: var(--font-primary);
  }

  .imgBottomSheet {
    max-width: 400px;
    max-height: 400px;
    border-radius: var(--border-radius-medium);
    box-shadow: var(--box-shadow-medium);
    margin-bottom: 20px;
  }

  .imgModal {
    max-width: 500px;
    max-height: 350px;
    border-radius: var(--border-radius-medium);
    box-shadow: var(--box-shadow-medium);
    margin-bottom: 20px;
  }

  .quantity-input {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-sm);
    width: 60px;
    text-align: center;
    border-radius: var(--border-radius-medium);
    border: 1px solid #ccc;
    font-size: 16px;
    transition: border-color 0.3s;
  }

  .quantity-input:focus {
    border-color: var(--button-background);
    outline: none;
    box-shadow: 0 0 5px rgba(235, 185, 22, 0.3);
  }

  .add-to-cart {
    margin-top: var(--spacing-md);
    background-color: var(--button-background);
    color: var(--white-text);
    font-size: 16px;
    padding: var(--button-padding);
    border: none;
    border-radius: var(--border-radius-small);
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
  }

  .add-to-cart:hover {
    background-color: var(--button-background-hover);
    transform: scale(1.05);
  }
</style>
