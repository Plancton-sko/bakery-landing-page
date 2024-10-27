<script lang="ts">
  import { contacts } from "$lib/stores/contacts";
  import { v4 as uuidv4 } from "uuid"; // Para gerar IDs únicos
  import { onMount } from "svelte";

  let email = "";
  let subject = "";
  let message = "";

  function handleSubmit(e: Event) {
    e.preventDefault();

    const newContact = {
      id: uuidv4(),
      email,
      subject,
      message,
    };

    contacts.addLocalContact(newContact); // Adicionar localmente
    // Para adicionar na API, você poderia usar: contacts.addContact(newContact);
    resetForm();
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
    margin: 0 auto;
    padding: 50px 20px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    font-family: 'Roboto', sans-serif;
  }

  #contact form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  #contact label {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }

  #contact input,
  #contact textarea {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border 0.3s ease;
    font-family: 'Roboto', sans-serif;
  }

  #contact input:focus,
  #contact textarea:focus {
    border-color: #eab308; /* Dourado */
    outline: none;
  }

  #contact textarea {
    resize: none;
  }

  #contact button {
    background-color: #eab308; /* Dourado */
    color: #fff;
    border: none;
    padding: 15px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  #contact button:hover {
    background-color: #cc9407; /* Dourado mais escuro ao passar o mouse */
  }
</style>