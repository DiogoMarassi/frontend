'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteVocabularyWord, type VocabularyEntry } from '../lib/api';

function LearnedBadge({ learned, total }: { learned: number; total: number }) {
  if (total === 0) return null;
  if (learned === total)
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">✓ Aprendida</span>;
  if (learned > 0)
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">↗ Parcial</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">· Aprendendo</span>;
}

export default function VocabularyTable({ entries: initial }: { entries: VocabularyEntry[] }) {
  const [entries, setEntries] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(vocabularyId: string, original: string) {
    if (!confirm(`Remover "${original}" do seu vocabulário?`)) return;
    setDeleting(vocabularyId);
    try {
      await deleteVocabularyWord(vocabularyId);
      setEntries((prev) => prev.filter((e) => e.vocabularyId !== vocabularyId));
    } catch {
      alert('Erro ao remover palavra.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Palavra</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Tradução</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Lições</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {entries.map((entry) => (
            <tr key={entry.vocabularyId} className="hover:bg-gray-50 transition group">
              <td className="px-5 py-3.5 font-semibold text-gray-800">{entry.original}</td>
              <td className="px-5 py-3.5 text-gray-500">{entry.translation}</td>
              <td className="px-5 py-3.5">
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
              <td className="px-5 py-3.5 text-right">
                <button
                  onClick={() => handleDelete(entry.vocabularyId, entry.original)}
                  disabled={deleting === entry.vocabularyId}
                  className="opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-500 text-lg leading-none disabled:opacity-40"
                  title="Remover palavra"
                >
                  {deleting === entry.vocabularyId ? '·' : '×'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
