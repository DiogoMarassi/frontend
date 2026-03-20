'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser, removeUser } from '../../lib/auth';
import { getUser as fetchUser, logout, type User } from '../../lib/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = getUser();
    if (!stored) {
      router.replace('/login');
      return;
    }

    fetchUser(stored.id)
      .then(setProfile)
      .catch(() => setProfile({ id: stored.id, name: stored.name, email: stored.email }))
      .finally(() => setIsLoading(false));
  }, [router]);

  async function handleLogout() {
    await logout().catch(() => {});
    removeUser();
    router.push('/login');
  }

  if (isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-6 bg-gray-100 rounded w-1/3" />
          <div className="h-32 bg-gray-100 rounded-xl" />
        </div>
      </main>
    );
  }

  if (!profile) return null;

  const streak = profile.streak;
  const completedCount = profile.progress?.length ?? 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-500 hover:underline text-sm mb-6 inline-block">
        ← Voltar
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Perfil</h1>

      {/* Dados do usuário */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{streak?.currentStreak ?? 0}</p>
          <p className="text-xs text-gray-500 mt-1">Streak atual</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{streak?.highestStreak ?? 0}</p>
          <p className="text-xs text-gray-500 mt-1">Recorde</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{completedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Lições feitas</p>
        </div>
      </div>

      {/* Botão de logout */}
      <button
        onClick={handleLogout}
        className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition"
      >
        Sair da conta
      </button>
    </main>
  );
}
