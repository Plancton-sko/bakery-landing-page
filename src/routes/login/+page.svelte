<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { goto } from "$app/navigation";
  import { config } from "$lib/services/config";

  let email = "";
  let password = "";
  let error = "";

  async function handleLogin() {
    const res = await fetch(config.baseUrl + "/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // 1) invalida a rota /auth/session para reexecutar o load do layout
      await invalidate(config.baseUrl + "/auth/session");

      // 2) navega para a área admin de produtos
      goto("/admin");
    } else {
      const body = await res.json();
      error = body.message || "Falha no login";
    }
  }
</script>

<div class="login-container">
  <h2>Login</h2>
  <form class="login-form" on:submit|preventDefault={handleLogin}>
    {#if error}<p class="error">{error}</p>{/if}
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Senha" required />
    <button type="submit" class="btn-login">Entrar</button>
  </form>
</div>

<style>
  /* Container principal */
  .login-container {
    max-width: 400px;
    margin: 4rem auto;
    background: var(--beeswax);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-small);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .login-container h2 {
    text-align: center;
    margin: 0;
    font-size: 1.5rem;
    color: var(--primary-text);
  }

  /* Formulário */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .login-form input[type="email"],
  .login-form input[type="password"] {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  .login-form input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }

  /* Mensagem de erro */
  .login-form .error {
    color: var(--danger-color);
    font-size: 0.9rem;
    text-align: center;
    margin: 0;
  }

  /* Botão de login */
  .btn-login {
    padding: 0.75rem;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      transform 0.1s ease;
  }

  .btn-login:hover {
    background-color: #45a047;
    transform: translateY(-1px);
  }

  .btn-login:active {
    background-color: #3e8e41;
    transform: translateY(0);
  }

  /* Link para esqueci senha / cadastro */
  .login-actions {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
  }

  .login-actions a {
    color: var(--accent-color);
    text-decoration: none;
    transition: color 0.2s;
  }

  .login-actions a:hover {
    color: var(--primary-color);
  }
</style>
