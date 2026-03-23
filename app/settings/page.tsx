'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGeminiKeyStatus, saveGeminiKey, deleteGeminiKey } from '../../lib/api';
import { ArrowLeft, Check } from 'lucide-react';
import { useConfirm } from '../../hooks/useConfirm';

export default function SettingsPage() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const { confirm, ConfirmDialog } = useConfirm();

  useEffect(() => {
    getGeminiKeyStatus()
      .then((r) => setHasKey(r.hasKey))
      .catch(() => setHasKey(false));
  }, []);

  async function handleSave() {
    if (!keyInput.trim()) return;
    setSaving(true);
    setStatus('idle');
    try {
      await saveGeminiKey(keyInput.trim());
      setHasKey(true);
      setKeyInput('');
      setStatus('ok');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('err');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    const ok = await confirm({ message: 'Remover sua chave Gemini?', confirmLabel: 'Remover' });
    if (!ok) return;
    setRemoving(true);
    try {
      await deleteGeminiKey();
      setHasKey(false);
      setStatus('idle');
    } catch {
      alert('Erro ao remover chave.');
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
    {ConfirmDialog}
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-blue-500 hover:underline text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar para lições
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">Gerencie as integrações da sua conta.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Chave de API do Google Gemini</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Usada para gerar histórias e traduzir palavras com o modelo Gemini.
              Importante dizer que sua chave é armazenada de forma criptografada e segura.
              <br></br> <br></br>
              Caso queira e tenha o conhecimento necessário, você também pode baixar o projeto
              <a href="https://github.com/DiogoMarassi/frontend" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                (\frontend </a> e \
              <a href="https://github.com/DiogoMarassi/backend" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                backend) </a> e rodar localmente, sem precisar fornecer a chave para ninguém além de você mesmo.
            </p>
          </div>
          {hasKey && (
            <span className="flex-shrink-0 ml-4 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
              <Check className="w-3 h-3" /> Configurada
            </span>
          )}
        </div>

        <div className="mt-4">
          {hasKey ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 select-none">
                ••••••••••••••••••••••••••••••••••••••••
              </div>
              <button
                onClick={handleRemove}
                disabled={removing}
                className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm hover:bg-red-50 transition disabled:opacity-40"
              >
                {removing ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="AIza..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition placeholder:text-gray-300"
              />
              <button
                onClick={handleSave}
                disabled={saving || !keyInput.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          )}

          {status === 'ok' && (
            <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Chave salva com sucesso.</p>
          )}
          {status === 'err' && (
            <p className="mt-2 text-xs text-red-500">Erro ao salvar. Verifique a chave e tente novamente.</p>
          )}

          <p className="mt-3 text-xs text-gray-400">
            Obtenha sua chave em{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google AI Studio.
            </a>
            . Criando uma chave do google, você tem acesso a 20 chamadas gratuitas todos os dias.
            Isso signfica que você pode gerar 10 lições diárias. O que é mais que o suficiente para o aprendizado diário.
          </p>
        </div>
      </div>
    </main>
    </>
  );
}
