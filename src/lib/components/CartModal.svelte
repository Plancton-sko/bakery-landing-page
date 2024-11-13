<!-- src/lib/components/CartModal.svelte -->
<script lang="ts">
  import { cart, clearCart, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice } from "$lib/stores/cart";
  import { get } from 'svelte/store';

  export let closeCartModal: () => void;

  // Inicialize com os itens do carrinho
  let cartItems = get(cart);

  // Variáveis para o formulário do usuário
  let showUserForm = false;
  let userName = "";
  let userAddress = "";
  let userEmail = "";

  // Atualize `cartItems` sempre que o carrinho mudar
  cart.subscribe(items => {
    cartItems = items;
  });

  // Verifica se o formulário do usuário está preenchido corretamente
  const isFormValid = () => {
    return userName && userAddress && userEmail;
  };

  // Exibe o formulário para finalizar a compra
  const displayForm = () => {
    showUserForm = true;
  };

  // Função para finalizar a compra
  const checkout = () => {
  if (cartItems.length === 0) {
    alert("O carrinho está vazio. Adicione itens antes de finalizar a compra.");
    return;
  }

  if (!isFormValid()) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Formate a mensagem para o WhatsApp com os itens do carrinho
  const productList = cartItems
    .map(item => 
      `${item.quantity}x ${item.product.name} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price * item.quantity)}`
    ).join("\n");

  const message = `Olá, meu nome é ${userName}.
  Eu gostaria de finalizar a compra dos seguintes produtos:
  ${productList}
  Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format($totalPrice)}
  Meu endereço: ${userAddress}
  Meu email: ${userEmail}`;

  // URL para redirecionar o usuário ao WhatsApp
  const whatsappURL = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
  window.location.href = whatsappURL;

  // Limpe o carrinho e feche o modal após a compra
  clearCart();
  closeCartModal();
};

  // Atualiza o total e impede a finalização se o carrinho estiver vazio
  const updateTotalAndCheckCart = () => {
    cartItems = get(cart); // Atualiza `cartItems` com o conteúdo atual do carrinho
    if (cartItems.length === 0) {
      showUserForm = false; // Esconde o formulário se o carrinho estiver vazio
    }
  };

  // Chama `updateTotalAndCheckCart` quando o carrinho muda
  cart.subscribe(updateTotalAndCheckCart);
</script>

<!-- Modal -->
<div class="modal-overlay" on:click={closeCartModal}>
  <div class="modal-content" on:click|stopPropagation>
    <h2>Finalizar Compra</h2>

    <ul>
      {#if cartItems.length === 0}
        <li>O carrinho está vazio.</li>
      {:else}
        {#each cartItems as item}
          <li>
            <span class="item-name">{item.product.name}</span>
            <span class="item-price">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)} x {item.quantity}</span>
            <div class="item-actions">
              <button class="quantity-btn" on:click={() => increaseQuantity(item.product.id)}>+</button>
              <button class="quantity-btn" on:click={() => decreaseQuantity(item.product.id)}>-</button>
              <button class="remove-btn" on:click={() => { 
                removeFromCart(item.product.id);
                updateTotalAndCheckCart(); // Chama para atualizar total após a remoção
              }}>
                🗑️ <!-- Ícone de lixeira -->
              </button>
            </div>
          </li>
        {/each}
      {/if}
    </ul>

    <p>Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format($totalPrice)}</p>

    {#if !showUserForm && cartItems.length > 0}
      <button class="checkout-btn" on:click={displayForm}>Checkout</button>
    {/if}

    {#if showUserForm}
      <form on:submit|preventDefault={checkout} class="user-form">
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <input type="text" id="name" bind:value={userName} placeholder="Seu nome completo" required />
        </div>

        <div class="form-group">
          <label for="address">Endereço</label>
          <input type="text" id="address" bind:value={userAddress} placeholder="Seu endereço completo" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" bind:value={userEmail} placeholder="Seu email" required />
        </div>

        <button class="checkout-btn" type="submit">Confirmar e Enviar Pedido</button>
      </form>
    {/if}
    <button class="close-btn" on:click={closeCartModal}>Continue Buying</button>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7); /* Fundo mais escuro para destacar o modal */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in;
  }

  .modal-content {
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    text-align: center;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-in;
    overflow: hidden;
  }

  h2 {
    font-family: 'Arial', sans-serif;
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 25px;
    color: #333;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 25px;
    max-height: 300px;
    overflow-y: auto;
  }

  ul li {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    padding: 15px 10px;
    border-bottom: 1px solid #eaeaea;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s;
  }

  ul li:hover {
    background-color: #fbf3e6;
  }

  .item-name {
    flex: 1;
    text-align: left;
    font-weight: 500;
    color: #555;
  }

  .item-price {
    flex: 1;
    text-align: center;
    font-size: 15px;
    color: #888;
  }

  .item-actions {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    gap: 5px;
  }

  .quantity-btn, .remove-btn {
    background-color: #e2cf96;
    color: #333;
    border: none;
    border-radius: 5px;
    padding: 5px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  .quantity-btn:hover {
    background-color: #d1b775;
  }

  .remove-btn {
    background-color: #ec3737;
    color: #fff;
    padding: 6px;
  }

  .remove-btn:hover {
    background-color: #cc2f2f;
  }

  .checkout-btn, .close-btn {
    background-color: #ebb916;
    color: white;
    font-size: 16px;
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }

  .checkout-btn:hover {
    background-color: #d6a514;
    transform: scale(1.05);
  }

  .close-btn {
    background-color: #6c757d;
    margin-top: 15px;
  }

  .close-btn:hover {
    background-color: #5b626a;
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
    color: #555;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  input:focus {
    border-color: #ebb916;
    outline: none;
    box-shadow: 0 0 5px rgba(235, 185, 22, 0.3);
  }

  /* Animações */
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
