'use client';

import { useState } from 'react';
import Link from 'next/link';
import { register } from '../../lib/api';
import { setUser } from '../../lib/auth';

const OCCUPATIONS = [
  'Estudante',
  'Engenharia / Tecnologia',
  'Educação / Professor',
  'Criador de Conteúdo',
  'Negócios / Empreendedorismo',
  'Saúde',
  'Direito',
  'Arte / Design',
  'Outro',
];

const OBJECTIVES = [
  'Aprender idiomas',
  'Viagem / Intercâmbio',
  'Trabalho / Negócios',
  'Aprovação em concursos ou vestibulares',
  'Entretenimento (filmes, músicas)',
  'Outro',
];

const TECH_LEVELS = [
  { value: 'Iniciante',     desc: 'Primeira vez usando um app de idiomas' },
  { value: 'Intermediário', desc: 'Já usei outros apps ou métodos' },
  { value: 'Avançado',      desc: 'Estudo idiomas de forma sistemática' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [occupation, setOccupation] = useState('');
  const [objective, setObjective] = useState('');
  const [techLevel, setTechLevel] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { user } = await register(name.trim(), email.trim(), password, {
        occupation: occupation || undefined,
        objective: objective || undefined,
        techLevel: techLevel || undefined,
      });
      setUser({ id: user.id, name: user.name, email: user.email });
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-sm text-gray-400 mt-1">Os campos de perfil são opcionais, mas nos ajudam a melhorar o app.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 items-start">

            {/* Coluna esquerda — dados de acesso */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Dados de acesso</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  minLength={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Coluna direita — perfil */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Seu perfil <span className="text-gray-300 font-normal normal-case tracking-normal">— opcional</span></h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ocupação / Área de atuação</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
                >
                  <option value="">Selecione...</option>
                  {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo principal</label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
                >
                  <option value="">Selecione...</option>
                  {OBJECTIVES.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível de conhecimento</label>
                <div className="flex flex-col gap-2">
                  {TECH_LEVELS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTechLevel(t.value)}
                      className={`text-left px-3 py-2.5 rounded-lg border text-sm transition ${
                        techLevel === t.value
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{t.value}</span>
                      <span className="text-xs text-gray-400 ml-2">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-6 flex flex-col items-center gap-3">
            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2 w-full text-center">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full max-w-xs bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
            <div className="w-full max-w-xs">
              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3001'}/api/auth/google`}
                className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continuar com Google
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">Entrar</Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
