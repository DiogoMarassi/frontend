'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createLesson, generateStory } from '../lib/api';

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
  onClose: () => void;
}

export default function CreateLessonModal({ onClose }: Props) {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<string>('A1');
  const [themeWords, setThemeWords] = useState<string[]>([]);
  const [wordInput, setWordInput] = useState('');
  const [error, setError] = useState('');

  // Story generation state
  const [storyContent, setStoryContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function addWord() {
    const w = wordInput.trim().toLowerCase();
    if (w && !themeWords.includes(w)) {
      setThemeWords((prev) => [...prev, w]);
    }
    setWordInput('');
    wordInputRef.current?.focus();
  }

  function handleWordKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addWord();
    }
    if (e.key === 'Backspace' && wordInput === '' && themeWords.length > 0) {
      setThemeWords((prev) => prev.slice(0, -1));
    }
  }

  function removeWord(word: string) {
    setThemeWords((prev) => prev.filter((w) => w !== word));
  }

  async function handleGenerate() {
    if (!title.trim()) { setError('Preencha o título antes de gerar a história.'); return; }
    if (themeWords.length === 0) { setError('Adicione pelo menos uma palavra-tema.'); return; }
    setError('');
    setIsGenerating(true);
    try {
      const content = await generateStory(level, themeWords);
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
        themeWords,
        storyContent: storyContent || undefined,
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
            <h2 className="text-lg font-semibold text-gray-900">Nova lição</h2>
            <p className="text-xs text-gray-400 mt-0.5">Preencha os dados e gere a história antes de salvar.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition">×</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">

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
              placeholder="Ex: Dia 2"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Nível */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nível <span className="text-red-400">*</span>
            </label>
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

          {/* Palavras-tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Palavras-tema da história <span className="text-red-400">*</span>
            </label>
            <div
              className="min-h-[44px] border border-gray-200 rounded-lg px-3 py-2 flex flex-wrap gap-2 items-center cursor-text focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition"
              onClick={() => wordInputRef.current?.focus()}
            >
              {themeWords.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => { removeWord(word); setStoryContent(''); }}
                    className="text-blue-400 hover:text-blue-700 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                ref={wordInputRef}
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={handleWordKey}
                onBlur={() => { if (wordInput.trim()) addWord(); }}
                placeholder={themeWords.length === 0 ? 'Ex: investigação, suspense...' : ''}
                className="flex-1 min-w-[140px] text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Pressione Enter ou vírgula para adicionar cada palavra.</p>
          </div>

          {/* Story preview */}
          {storyContent && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">História gerada</p>
                <button
                  type="button"
                  onClick={() => setStoryContent('')}
                  className="text-xs text-blue-400 hover:text-blue-600"
                >
                  Regenerar
                </button>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{storyContent}</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
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
                {isGenerating ? 'Gerando história...' : '✨ Gerar história'}
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
