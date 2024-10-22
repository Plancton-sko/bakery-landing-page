<script lang="ts">
  export let cartCount: number;
</script>

<header>
  <div class="logo">Bread <span class="highlight">Bakery</span></div>
  <!--colocar alguma indicação de onde você esta no Nav-->
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="#">Shop</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Blog</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
  <div class="cart">
    <span>My Cart ({cartCount})</span>
  </div>
</header>
<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #fff;
    border-bottom: 2px solid #f0f0f0;
  }

  .logo {
  font-size: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
}
.highlight {
  color: #f5c518; /* Cor amarela */
}

  nav ul {
    list-style: none;
    display: flex;
    gap: 20px;
    padding: 0;
    margin: 0;
  }

  nav ul li {
    display: inline;
  }

  nav ul li a {
    text-decoration: none;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    color: #333;
  }

  nav ul li a:hover {
    color: #007bff; /* Cor azul para indicar o link ativo */
    border-bottom: 2px solid #007bff;
  }

  .cart {
    display: flex;
    align-items: center;
    font-family: 'Roboto', sans-serif;
    background-color: #f8f8f8;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .cart span {
    font-size: 16px;
    color: #333;
  }

  .cart span::before {
    content: '\1F6D2'; /* Unicode de ícone de carrinho */
    font-size: 20px;
    margin-right: 5px;
    color: #b29444;
  }

  .cart span {
    background-color: #e2cf96;
    padding: 5px;
    border-radius: 5px;
  }

  .cart span:hover {
    background-color: #b29444;
    color: white;
  }
</style>