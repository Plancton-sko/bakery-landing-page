// src/lib/stores/contacts.ts
import type { Contact, ContactStore } from '$lib/types/Contact';
import { writable, type Writable } from 'svelte/store';

// Função para criar a store de contatos
function createContactsStore(): ContactStore {
  const { subscribe, set, update } = writable<Contact[]>([]);

  // Função para adicionar um contato (POST)
  async function addContact(contact: Contact) {
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });

      if (!response.ok) throw new Error('Erro ao adicionar contato.');
      const newContact: Contact = await response.json();
      update((contacts) => [...contacts, newContact]);
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
    }
  }

  // Função para atualizar um contato (PUT)
  async function updateContact(updatedContact: Contact) {
    try {
      const response = await fetch(`/api/contacts/${updatedContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact),
      });

      if (!response.ok) throw new Error('Erro ao atualizar contato.');
      update((contacts) =>
        contacts.map((contact) =>
          contact.id === updatedContact.id ? updatedContact : contact
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
    }
  }

  // Função para deletar um contato (DELETE)
  async function deleteContact(id: string) {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar contato.');
      update((contacts) => contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
    }
  }

  // Função para adicionar um contato localmente (sem chamada à API)
  function addLocalContact(contact: Contact) {
    update((contacts) => {
      const updatedContacts = [...contacts, contact];
      console.log('Contato adicionado localmente:', contact);
      console.log('Lista atualizada de contatos:', updatedContacts);
      return updatedContacts;
    });
  }

  // Função para atualizar um contato localmente (sem chamada à API)
  function updateLocalContact(updatedContact: Contact) {
    update((contacts) =>
      contacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
  }

  // Função para deletar um contato localmente (sem chamada à API)
  function deleteLocalContact(id: string) {
    update((contacts) => contacts.filter((contact) => contact.id !== id));
  }

  return {
    subscribe,
    set,
    update,
    addContact,
    updateContact,
    deleteContact,
    addLocalContact,
    updateLocalContact,
    deleteLocalContact,
  };
}

export const contacts = createContactsStore();
