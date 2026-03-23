'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteVocabularyWord, type VocabularyEntry } from '../lib/api';
import CreatePersonalizedLessonModal from './CreatePersonalizedLessonModal';
import { Check, TrendingUp, Circle, Sparkles, X, Trash2 } from 'lucide-react';
import { useConfirm } from '../hooks/useConfirm';

function LearnedBadge({ learned, total }: { learned: number; total: number }) {
  if (total === 0) return null;
  if (learned === total)
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"><Check className="w-3 h-3" /> Aprendida</span>;
  if (learned > 0)
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><TrendingUp className="w-3 h-3" /> Parcial</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-600"><Circle className="w-2 h-2 fill-current" /> Aprendendo</span>;
}

export default function VocabularyTable({ entries: initial }: { entries: VocabularyEntry[] }) {
  const [entries, setEntries] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingMany, setDeletingMany] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const { confirm, ConfirmDialog } = useConfirm();

  const filtered = search.trim()
    ? entries.filter((e) =>
        e.original.toLowerCase().includes(search.toLowerCase()) ||
        e.translation.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  function toggleSelect(vocabularyId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(vocabularyId) ? next.delete(vocabularyId) : next.add(vocabularyId);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((e) => e.vocabularyId))
    );
  }

  const selectedWords = entries
    .filter((e) => selected.has(e.vocabularyId))
    .map((e) => ({ original: e.original, translation: e.translation }));

  async function handleDeleteSelected() {
    const ok = await confirm({ message: `Remover ${selected.size} palavra${selected.size > 1 ? 's' : ''} do seu vocabulário?`, confirmLabel: 'Remover' });
    if (!ok) return;
    setDeletingMany(true);
    try {
      await Promise.all([...selected].map((id) => deleteVocabularyWord(id)));
      setEntries((prev) => prev.filter((e) => !selected.has(e.vocabularyId)));
      setSelected(new Set());
    } catch {
      alert('Erro ao remover palavras.');
    } finally {
      setDeletingMany(false);
    }
  }

  async function handleDelete(vocabularyId: string, original: string) {
    const ok = await confirm({ message: `Remover "${original}" do seu vocabulário?`, confirmLabel: 'Remover' });
    if (!ok) return;
    setDeleting(vocabularyId);
    try {
      await deleteVocabularyWord(vocabularyId);
      setEntries((prev) => prev.filter((e) => e.vocabularyId !== vocabularyId));
      setSelected((prev) => { const next = new Set(prev); next.delete(vocabularyId); return next; });
    } catch {
      alert('Erro ao remover palavra.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      {ConfirmDialog}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por palavra em francês ou português..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition placeholder:text-gray-300"
        />
      </div>

      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm text-gray-500">
          {selected.size > 0 ? `${selected.size} palavra${selected.size > 1 ? 's' : ''} selecionada${selected.size > 1 ? 's' : ''}` : '\u00a0'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDeleteSelected}
            disabled={selected.size === 0 || deletingMany}
            className="flex items-center gap-2 border border-red-200 text-red-500 text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {deletingMany ? 'Removendo...' : 'Remover selecionadas'}
          </button>
          <button
            onClick={() => setShowModal(true)}
            disabled={selected.size === 0}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" /> Criar lição personalizada
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="rounded border-gray-300 text-indigo-600 cursor-pointer"
                />
              </th>
              <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Palavra</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Tradução</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Lições</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                Nenhuma palavra encontrada para "{search}".
              </td>
            </tr>
          )}
          {filtered.map((entry) => (
              <tr
                key={entry.vocabularyId}
                className={`hover:bg-gray-50 transition group cursor-pointer ${selected.has(entry.vocabularyId) ? 'bg-indigo-50/50' : ''}`}
                onClick={() => toggleSelect(entry.vocabularyId)}
              >
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.has(entry.vocabularyId)}
                    onChange={() => toggleSelect(entry.vocabularyId)}
                    className="rounded border-gray-300 text-indigo-600 cursor-pointer"
                  />
                </td>
                <td className="px-5 py-3.5 font-semibold text-gray-800">{entry.original}</td>
                <td className="px-5 py-3.5 text-gray-500">{entry.translation}</td>
                <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-wrap gap-1">
                    {entry.lessons.map((l) => (
                      <Link
                        key={l.id}
                        href={`/lesson/${l.id}`}
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-700 transition"
                      >
                        {l.title}
                      </Link>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <LearnedBadge learned={entry.learned} total={entry.total} />
                </td>
                <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleDelete(entry.vocabularyId, entry.original)}
                    disabled={deleting === entry.vocabularyId}
                    className="opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-500 disabled:opacity-40"
                    title="Remover palavra"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CreatePersonalizedLessonModal
          words={selectedWords}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
