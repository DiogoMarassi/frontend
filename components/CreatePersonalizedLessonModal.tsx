'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createLesson, generateStory } from '../lib/api';
import { Sparkles, X } from 'lucide-react';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const LEVEL_LABELS: Record<string, string> = {
  A1: 'A1 — Iniciante',
  A2: 'A2 — Básico',
  B1: 'B1 — Intermediário',
  B2: 'B2 — Intermediário avançado',
  C1: 'C1 — Avançado',
  C2: 'C2 — Fluente',
};

interface Props {
  words: { original: string; translation: string }[];
  onClose: () => void;
}

export default function CreatePersonalizedLessonModal({ words, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<string>('A1');
  const [provider, setProvider] = useState<'gemini' | 'ollama'>('gemini');
  const [storyContent, setStoryContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleGenerate() {
    if (!title.trim()) { setError('Preencha o título antes de gerar a história.'); return; }
    setError('');
    setIsGenerating(true);
    try {
      const vocabularyWords = words.map((w) => w.original);
      const content = await generateStory(level, provider, { vocabularyWords });
      setStoryContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar história');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    setError('');
    setIsSaving(true);
    try {
      await createLesson({
        title: title.trim(),
        level,
        themeWords: [],
        storyContent: storyContent || undefined,
        provider,
      });
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar lição');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Lição personalizada</h2>
            <p className="text-xs text-gray-400 mt-0.5">A história será criada usando as palavras selecionadas.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">

          {/* Palavras selecionadas */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Palavras incluídas na história ({words.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {words.map((w) => (
                <span
                  key={w.original}
                  className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {w.original}
                  <span className="text-indigo-400">{w.translation}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-400">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Revisão semana 1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Nível */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível <span className="text-red-400">*</span></label>
            <select
              value={level}
              onChange={(e) => { setLevel(e.target.value); setStoryContent(''); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
              ))}
            </select>
          </div>

          {/* Modelo de IA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo de IA</label>
            <select
              value={provider}
              onChange={(e) => { setProvider(e.target.value as 'gemini' | 'ollama'); setStoryContent(''); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white"
            >
              <option value="gemini">Gemini (API)</option>
              <option value="ollama">Mistral Nemo (local)</option>
            </select>
            {provider === 'gemini' && (
              <p className="mt-1.5 text-xs text-gray-400">
                Certifique-se de ter configurado sua chave em{' '}
                <a href="/settings" className="text-blue-500 hover:underline">Configurações</a>.
              </p>
            )}
          </div>

          {/* Story preview */}
          {storyContent && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">História gerada</p>
                <button
                  type="button"
                  onClick={() => setStoryContent('')}
                  className="text-xs text-indigo-400 hover:text-indigo-600"
                >
                  Regenerar
                </button>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{storyContent}</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>

            {!storyContent ? (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {isGenerating ? 'Gerando história...' : <span className="flex items-center justify-center gap-1.5"><Sparkles className="w-4 h-4" /> Gerar história</span>}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isSaving ? 'Criando lição...' : 'Criar lição'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
