<!-- src/lib/components/Contact.svelte -->
<script lang="ts">
  import { onMount } from "svelte";

  let email = "";
  let subject = "";
  let message = "";

  async function handleSubmit(e: Event) {
    e.preventDefault();

    const newContact = {
      email,
      subject,
      message,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
        return;
      }

      const responseData = await response.json();
      alert('Contato salvo com sucesso!');
      resetForm();
    } catch (error) {
      console.error('Erro ao enviar contato:', error);
      alert('Erro ao salvar o contato.');
    }
  }

  function resetForm() {
    email = "";
    subject = "";
    message = "";
  }
</script>

<section id="contact">
  <form on:submit={handleSubmit}>
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      placeholder="Digite seu email"
      required
    />

    <label for="subject">Assunto</label>
    <input
      type="text"
      id="subject"
      bind:value={subject}
      placeholder="Digite o assunto"
      required
    />

    <label for="message">Mensagem</label>
    <textarea
      id="message"
      bind:value={message}
      placeholder="Digite sua mensagem"
      rows="5"
      required
    ></textarea>

    <button type="submit">Enviar</button>
  </form>
</section>

<style>
  #contact {
    max-width: 600px;
    margin: 20px auto;
    padding: 40px 20px ;
    background-color: #fffaf3; /* Fundo neutro */
    box-shadow: var(--box-shadow-intense);
    border-radius: var(--border-radius);
    font-family: var(--font-primary);
  }

  #contact form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: var(--spacing-md);
  }

  #contact label {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--text-color); /* Texto escuro */
    margin-bottom: var(--spacing-sm);
  }

  #contact input,
  #contact textarea {
    width: 95%;
    padding: 12px;
    font-size: 1rem;
    border: 2px solid #eaeaea; /* Cinza claro */
    border-radius: 8px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    font-family: var(--font-primary);
  }

  #contact input:focus,
  #contact textarea:focus {
    border-color: var(--button-background); /* Dourado */
    outline: none;
    box-shadow: 0 0 8px rgba(235, 185, 22, 0.3); /* Glow dourado */
  }

  #contact textarea {
    resize: none;
  }

  #contact button {
    background-color: var(--button-background); /* Dourado */
    color: white;
    border: none;
    padding: var(--spacing-md);
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: var(--border-radius-medium);
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  #contact button:hover {
    background-color: var(--button-background-hover); 
    transform: scale(1.05);
  }

  /* Responsividade */
  @media (max-width: 768px) {
    #contact {
      padding: 20px 15px;
    }

    #contact label {
      font-size: 1rem;
    }

    #contact input,
    #contact textarea {
      font-size: 0.95rem;
    }

    #contact button {
      font-size: 1rem;
      padding: 12px;
    }
  }
</style>
