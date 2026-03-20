'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, removeUser, type AuthUser } from '../lib/auth';
import { logout } from '../lib/api';

export default function Header() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  async function handleLogout() {
    await logout().catch(() => { });
    removeUser();
    setUser(null);
    router.push('/login');
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-blue-600 tracking-tight">
          Easy Langue
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
              >
                Minhas lições
              </Link>
              <Link
                href="/cards"
                className="text-sm text-gray-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
              >
                Todos os Cards
              </Link>
              <Link
                href="/vocabulary"
                className="text-sm text-gray-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
              >
                Meu Vocabulário
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
              >
                <span className="text-base">👤</span>
                <span className="font-medium">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg transition"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
