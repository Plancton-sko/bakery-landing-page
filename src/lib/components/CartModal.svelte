<!-- src/lib/components/CartModal.svelte -->
<script lang="ts">
  import {
    cart,
    clearCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } from "$lib/stores/cart";
  import { get } from "svelte/store";
  import { formatPrice } from "$lib/utils/format";
  import { config } from "$lib/services/config";

  export let closeCartModal: () => void;

  let cartItems = get(cart);
  let showUserForm = false;
  let userName = "";
  let userAddress = "";
  let userEmail = "";
  let isSubmitting = false;
  let error = "";

  const baseUrl = config.baseUrl;

  // Atualiza quando o carrinho muda
  cart.subscribe((items) => {
    cartItems = items;
  });

  const isFormValid = () => {
    return userName && userAddress && userEmail;
  };

  const displayForm = () => {
    showUserForm = true;
  };

  const checkout = async () => {
    if (cartItems.length === 0) {
      error = "O carrinho está vazio!";
      return;
    }

    if (!isFormValid()) {
      error = "Preencha todos os campos!";
      return;
    }

    isSubmitting = true;
    error = "";

    try {
      // Prepare the order data
      const orderData = {
        customer: {
          firstName: userName.split(" ")[0],
          lastName: userName.split(" ").slice(1).join(" ") || "-",
          email: userEmail,
          address: userAddress,
        },
        items: cartItems.map((item) => {
          const price = item.appliedDiscount?.finalPrice || item.product.price;
          return {
            productId: item.product.id,
            quantity: item.quantity,
            price: price,
            discount: item.appliedDiscount
              ? item.product.price - item.appliedDiscount.finalPrice
              : 0,
          };
        }),
        notes: `Pedido via site - ${new Date().toLocaleString("pt-BR")}`,
      };

      // Send the order to our API
      const response = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao processar o pedido");
      }

      const result = await response.json();

      // Prepare WhatsApp message as backup
      const productList = cartItems
        .map((item) => {
          const price = item.appliedDiscount?.finalPrice || item.product.price;
          return `${item.quantity}x ${item.product.name} - ${formatPrice(price * item.quantity)}`;
        })
        .join("\n");

      const message = `Pedido de ${userName}
Endereço: ${userAddress}
Email: ${userEmail}

Itens:
${productList}

Total: ${formatPrice($totalPrice)}

Número do pedido: ${result.orderNumber || "Processando"}`;

      // Success - clear cart and close modal
      clearCart();
      closeCartModal();

      // Redirect to WhatsApp as backup communication
      window.open(
        `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`,
        "_blank",
      );
    } catch (err) {
      console.error("Erro no checkout:", err);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<div class="modal-overlay" on:click={closeCartModal}>
  <div class="modal-content" on:click|stopPropagation>
    <h2>Seu Carrinho</h2>

    <ul>
      {#if cartItems.length === 0}
        <li class="empty-cart">Seu carrinho está vazio</li>
      {:else}
        {#each cartItems as item}
          <li>
            <div class="item-info">
              <span class="item-name">{item.product.name}</span>
              {#if item.appliedDiscount}
                <div class="discount-info">
                  <span class="original"
                    >{formatPrice(item.appliedDiscount.originalPrice)}</span
                  >
                  <span class="final"
                    >{formatPrice(item.appliedDiscount.finalPrice)}</span
                  >
                </div>
              {:else}
                <span class="price">{formatPrice(item.product.price)}</span>
              {/if}
            </div>

            <div class="item-actions">
              <div class="quantity-controls">
                <button on:click={() => decreaseQuantity(item.product.id)}
                  >-</button
                >
                <span>{item.quantity}</span>
                <button on:click={() => increaseQuantity(item.product.id)}
                  >+</button
                >
              </div>
              <button
                class="remove-btn"
                on:click={() => removeFromCart(item.product.id)}
              >
                🗑️
              </button>
            </div>
          </li>
        {/each}
      {/if}
    </ul>

    <div class="total-section">
      <h3>Total: {formatPrice($totalPrice)}</h3>
      {#if cartItems.length > 0 && !showUserForm}
        <button class="checkout-btn" on:click={displayForm}
          >Finalizar Compra</button
        >
      {/if}
    </div>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    {#if showUserForm}
      <form on:submit|preventDefault={checkout} class="user-form">
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <input type="text" id="name" bind:value={userName} required />
        </div>

        <div class="form-group">
          <label for="address">Endereço</label>
          <input type="text" id="address" bind:value={userAddress} required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" bind:value={userEmail} required />
        </div>

        <button class="confirm-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processando..." : "Confirmar Pedido"}
        </button>
      </form>
    {/if}

    <button class="close-btn" on:click={closeCartModal}>Voltar</button>
  </div>
</div>

<style>
  .discount-info {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .original {
    text-decoration: line-through;
    color: #999;
    font-size: 0.9rem;
  }

  .final {
    color: var(--primary-color);
    font-weight: bold;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .quantity-controls button {
    padding: 4px 12px;
    background: var(--third-color);
    color: white;
    border: none;
    border-radius: 4px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* Fundo semi-transparente */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in;
  }

  .modal-content {
    background: white; /* Cor de fundo do AboutUs */
    padding: 30px;
    border-radius: var(--border-radius);
    width: 90%;
    max-width: 600px;
    text-align: center;
    box-shadow: var(--box-shadow-intense);
    animation: slideIn 0.3s ease-in;
  }

  h2 {
    font-family: var(--font-primary);
    font-size: 26px;
    font-weight: bold;
    margin-bottom: var(--spacing-lg);
    color: #493121; /* Título em marrom */
  }

  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 25px;
    max-height: 300px;
    overflow-y: auto;
  }

  ul li {
    font-family: var(--font-primary);
    font-size: 16px;
    padding: 15px 10px;
    border-bottom: 1px solid #ead9c3; /* Sutil separação */
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s;
  }

  ul li:hover {
    background-color: var(--background-color); /* Realce ao passar o mouse */
  }

  .item-name {
    flex: 1;
    text-align: left;
    font-weight: 500;
    color: var(--primary-color);
  }

  .item-price {
    flex: 1;
    text-align: center;
    font-size: 15px;
    color: var(--primary-color);
  }

  .item-actions {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    gap: 5px;
  }

  .quantity-btn,
  .remove-btn {
    background-color: var(--third-color); /* Cor de destaque */
    color: var(--white-text);
    border: none;
    border-radius: 5px;
    padding: 5px 12px;
    font-size: 14px;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
  }

  .quantity-btn:hover {
    background-color: var(--highlight-color); /* Cor mais intensa */
  }

  .remove-btn {
    background-color: var(--danger-color); /* Botão de remover */
    color: var(--white-text);
    padding: 6px;
  }

  .remove-btn:hover {
    background-color: var(--danger-color);
  }
  .close-btn {
    background-color: #f58e2d;
  }

  .checkout-btn {
    background-color: var(--danger-color);
  }

  .checkout-btn,
  .close-btn {
    color: var(--white-text);
    font-size: 16px;
    padding: 12px 20px;
    border: none;
    border-radius: var(--border-radius-small);
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
  }

  .checkout-btn:hover,
  .close-btn:hover {
    background-color: var(--highlight-color);
    transform: scale(1.05);
  }

  .user-form {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    font-weight: bold;
    font-size: 15px;
    color: var(--primary-color);
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ead9c3;
    border-radius: 8px;
    font-size: 15px;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
  }

  input:focus {
    border-color: var(--third-color);
    outline: none;
    box-shadow: 0 0 5px rgba(244, 162, 97, 0.3);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
