import { json } from "@sveltejs/kit";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuração do Firebase (insira os dados do seu firebaseConfig)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();

    // Validar os dados do corpo da requisição
    if (!body.email || !body.subject || !body.message) {
      return json({ error: "Campos obrigatórios não preenchidos." }, { status: 400 });
    }

    // Adicionar os dados ao Firestore
    const docRef = await addDoc(collection(db, "contacts"), {
      email: body.email,
      subject: body.subject,
      message: body.message,
      createdAt: new Date().toISOString(),
    });

    return json({ message: "Contato salvo com sucesso!", id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Erro ao salvar contato:", error);
    return json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
