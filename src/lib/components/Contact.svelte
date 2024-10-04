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
