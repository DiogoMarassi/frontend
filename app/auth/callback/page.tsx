'use client';

import { useEffect } from 'react';
import { setUser } from '../../../lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export default function AuthCallbackPage() {
  useEffect(() => {
    async function finish() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const user = await res.json();
          setUser({ id: user.id, name: user.name, email: user.email });
        }
      } finally {
        window.location.href = '/';
      }
    }
    finish();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Entrando...
    </main>
  );
}
