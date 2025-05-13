// src/lib/services/auth.ts
import jwt from 'jsonwebtoken'; 

export function verifyJWT(token: string) {
  return jwt.verify(token, 'your-secret-key') as { id: string; role: string };
}
