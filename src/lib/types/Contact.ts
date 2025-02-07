// src/lib/types/Contact.ts
import type { Writable } from "svelte/store";

export type Contact = {
  id: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactStore = Writable<Contact[]> & {
  addContact: (contact: Contact) => Promise<void>;
  updateContact: (updatedContact: Contact) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addLocalContact: (contact: Contact) => void;
  updateLocalContact: (updatedContact: Contact) => void;
  deleteLocalContact: (id: string) => void;
};