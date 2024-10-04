<script lang="ts">
  export let cartCount: number;
</script>

<header>
  <div class="logo">Bread Bakery</div>
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
