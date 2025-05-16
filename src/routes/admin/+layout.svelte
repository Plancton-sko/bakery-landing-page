<!-- src/routes/admin/+layout.svelte -->
<script lang="ts">
  import { page } from "$app/stores";
  import { config } from "$lib/services/config";
  
  async function logout() {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    location.href = '/'; 
  }
</script>

<div class="admin-layout">
  <header class="admin-header">
    <div class="admin-header-logo">
      <h1>Painel Administrativo</h1>
    </div>
    <div class="admin-header-actions">
      <button class="btn-logout" on:click={logout}>Sair</button>
    </div>
  </header>

  <div class="admin-container">
    <nav class="admin-nav">
      <ul>
        <li class:active={$page.url.pathname === "/admin"}>
          <a href="/admin">Dashboard</a>
        </li>
        <li class:active={$page.url.pathname === "/admin/products"}>
          <a href="/admin/products">Produtos</a>
        </li>
        <li class:active={$page.url.pathname === "/admin/categories"}>
          <a href="/admin/categories">Categorias</a>
        </li>
        <li class:active={$page.url.pathname === "/admin/slides"}>
          <a href="/admin/slides">Slides</a>
        </li>
        <li class:active={$page.url.pathname === "/admin/highlights"}>
          <a href="/admin/highlights">Destaques</a>
        </li>
        <li class:active={$page.url.pathname === "/admin/discounts"}>
          <a href="/admin/discounts">Cupons</a>
        </li>
        <li class:active={$page.url.pathname === "/admin/settings"}>
          <a href="/admin/settings">Configurações</a>
        </li>
      </ul>
    </nav>
    
    <main class="admin-content">
      <!-- Aqui será renderizado o conteúdo de cada rota -->
      <slot />
    </main>
  </div>
</div>

<style>
  .admin-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
  }

  .admin-header {
    background-color: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .admin-header h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .btn-logout {
    background-color: transparent;
    border: 1px solid white;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-logout:hover {
    background-color: white;
    color: var(--primary-color);
  }

  .admin-container {
    display: flex;
    flex: 1;
  }

  .admin-nav {
    width: 220px;
    background-color: var(--beeswax);
    padding: 1rem 0;
    box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
  }

  .admin-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .admin-nav li {
    padding: 0;
  }

  .admin-nav li a {
    display: block;
    padding: 0.75rem 1.5rem;
    color: #333;
    text-decoration: none;
    transition: all 0.2s;
  }

  .admin-nav li:hover a {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .admin-nav li.active a {
    background-color: var(--primary-color);
    color: white;
    font-weight: bold;
  }

  .admin-content {
    flex: 1;
    padding: 1.5rem;
    overflow: auto;
  }

  @media (max-width: 768px) {
    .admin-container {
      flex-direction: column;
    }

    .admin-nav {
      width: 100%;
    }

    .admin-nav ul {
      display: flex;
      flex-wrap: wrap;
    }

    .admin-nav li {
      margin-right: 0.5rem;
    }
  }
</style>