<script lang="ts">
    import { cart, clearCart } from "$lib/stores/cart";
    import { get } from 'svelte/store';
  
    // Recebendo a função para fechar o modal como prop
    export let closeCartModal: () => void;
  
    // Pegando os produtos do carrinho
    let cartItems = get(cart);
  
    let showUserForm = false;
    let userName = "";
    let userAddress = "";
    let userEmail = "";
    let userLocation = "";
  
    const totalPrice = () => {
      return cartItems.reduce((total, item) => total + item.price, 0);
    };
  
    cart.subscribe(items => {
      cartItems = items;
    });
  
    const isFormValid = () => {
      return userName && userAddress && userEmail && userLocation;
    };
  
    const displayForm = () => {
      showUserForm = true;
    };
  
    const checkout = () => {
      if (!isFormValid()) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
  
      const productList = cartItems.map(item => `${item.name} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}`).join("\n");
  
      const message = `
        Olá, meu nome é ${userName}.
        Eu gostaria de finalizar a compra dos seguintes produtos:
        ${productList}
        Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice())}
    
        Meu endereço: ${userAddress}
        Meu email: ${userEmail}
        Minha localização: ${userLocation}
      `;
      // Numero de telefone
      const whatsappURL = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
      window.location.href = whatsappURL;
  
      clearCart();
      closeCartModal();
    };
  </script>
  
  <!-- Modal -->
  <div class="modal-overlay" on:click={closeCartModal}>
    <div class="modal-content" on:click|stopPropagation>
      <h2>Finalizar Compra</h2>
  
      <!-- Exibição dos itens do carrinho -->
      <ul>
        {#if cartItems.length === 0}
          <li>O carrinho está vazio.</li>
        {:else}
          {#each cartItems as item}
            <li>{item.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</li>
          {/each}
        {/if}
      </ul>
  
      <!-- Exibe o total -->
      <p>Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice())}</p>
  
      <!-- Botão de finalizar compra -->
      {#if !showUserForm}
        <button class="checkout-btn" on:click={displayForm}>Finalizar Compra</button>
      {/if}
  
      <!-- Formulário de dados do usuário (exibido após clicar em "Finalizar Compra") -->
      {#if showUserForm}
        <form on:submit|preventDefault={checkout}>
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
  
          <div class="form-group">
            <label for="location">Sua Localização (cidade, bairro, etc.)</label>
            <input type="text" id="location" bind:value={userLocation} placeholder="Digite sua localização" required />
          </div>
  
          <button class="checkout-btn" type="submit">Confirmar e Enviar Pedido</button>
        </form>
      {/if}
  
      <!-- Botão de fechar -->
      <button class="close-btn" on:click={closeCartModal}>Fechar</button>
    </div>
  </div>


  
  
  <style>
    /* Mantendo a consistência visual com o CartModal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5); /* Mesma opacidade do CartModal */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000; /* Mantém o modal à frente */
    }
  
    .modal-content {
      background: white; /* Fundo branco para consistência */
      padding: 20px;
      border-radius: 10px; /* Bordas arredondadas iguais ao CartModal */
      width: 350px; /* Tamanho ajustado para caber melhor na tela */
      text-align: center;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1); /* Sombra suave */
    }
  
    ul {
      list-style: none; /* Remove o estilo de lista padrão */
      padding: 0;
      margin-bottom: 20px; /* Espaçamento inferior */
    }
  
    ul li {
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
  
    p {
      font-family: 'Roboto', sans-serif;
      font-size: 18px;
      font-weight: bold;
      margin-top: 20px;
      color: #111; /* Cor forte para destaque */
    }
  
    .checkout-btn {
      background-color: #28a745; /* Cor verde do botão de finalização */
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 20px;
      width: 100%; /* Largura completa para preencher o modal */
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
  
    .checkout-btn:hover {
      background-color: #218838; /* Efeito hover no botão */
    }
  
    .close-btn {
      background-color: #ff6f61; /* Cor vermelha do botão de fechar */
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
      width: 100%; /* Largura completa */
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
  
    .close-btn:hover {
      background-color: #e65a50; /* Efeito hover no botão de fechar */
    }
  
    .form-group {
      margin-bottom: 15px;
      text-align: left;
    }
  
    .form-group label {
      display: block;
      font-family: 'Roboto', sans-serif;
      font-size: 14px;
      margin-bottom: 5px;
    }
  
    .form-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: 'Roboto', sans-serif;
      font-size: 14px;
    }
  </style>
  