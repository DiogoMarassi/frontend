'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteLesson } from '../lib/api';
import { ChevronRight, LayoutGrid, X } from 'lucide-react';
import { useConfirm } from '../hooks/useConfirm';

interface LessonCardProps {
  id: string;
  title: string;
  level: string | null;
  createdAt: string;
  cardStats?: { total: number; learned: number };
  onDeleted?: (id: string) => void;
}

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-emerald-100 text-emerald-700',
  B1: 'bg-blue-100 text-blue-700',
  B2: 'bg-indigo-100 text-indigo-700',
  C1: 'bg-purple-100 text-purple-700',
  C2: 'bg-rose-100 text-rose-700',
};

const DATE_BADGES: Record<number, { label: string; style: string }> = {
  0: { label: 'criado Hoje', style: 'bg-blue-50 border-blue-200 text-blue-500' },
  1: { label: 'criado Ontem', style: 'bg-violet-50 border-violet-200 text-violet-400' },
  2: { label: 'criado Anteontem', style: 'bg-gray-50 border-gray-200 text-gray-400' },
};

function getDateBadge(createdAt: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const created = new Date(createdAt);
  created.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - created.getTime()) / 86400000);
  return DATE_BADGES[diffDays] ?? null;
}

function CardStatusDot({ stats }: { stats?: { total: number; learned: number } }) {
  if (!stats) return null;
  if (stats.total === 0)
    return <span className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0" title="Nenhuma palavra adicionada" />;
  if (stats.learned === stats.total)
    return <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Lição concluída" />;
  return <span className="w-2 h-2 rounded-full bg-blue-300 flex-shrink-0" title="Em andamento" />;
}

export default function LessonCard({ id, title, level, createdAt, cardStats, onDeleted }: LessonCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    const ok = await confirm({ message: `Remover a lição "${title}"?`, confirmLabel: 'Remover' });
    if (!ok) return;
    setDeleting(true);
    try {
      await deleteLesson(id);
      if (onDeleted) onDeleted(id);
      else router.refresh();
    } catch {
      alert('Erro ao remover lição.');
      setDeleting(false);
    }
  }

  const dateBadge = getDateBadge(createdAt);

  return (
    <>
    {ConfirmDialog}
    <div className="relative group flex gap-2">
      {dateBadge && (
        <div className={`flex items-center justify-center border rounded-xl shadow-sm text-xs font-semibold w-[90px] flex-shrink-0 text-center leading-tight px-2 ${dateBadge.style}`}>
          {dateBadge.label}
        </div>
      )}
      <Link href={`/lesson/${id}`} className="flex-1">
        <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-800">{title}</h3>
                {level && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEVEL_COLORS[level] ?? 'bg-gray-100 text-gray-600'}`}>
                    {level}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CardStatusDot stats={cardStats} />
                <p className="text-xs text-gray-400">
                  {new Date(createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {cardStats && cardStats.total > 0 && cardStats.learned === cardStats.total && (
                    <span className="ml-2 text-emerald-500 font-medium">Concluída</span>
                  )}
                  {cardStats && cardStats.total > 0 && cardStats.learned < cardStats.total && (
                    <span className="ml-2 text-blue-400 font-medium">Revise os cards</span>
                  )}
                  {cardStats && cardStats.total === 0 && (
                    <span className="ml-2 text-gray-400">Sem palavras salvas</span>
                  )}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
          </div>
        </div>
      </Link>

      <Link
        href={`/lesson/${id}/cards`}
        className="flex flex-col items-center justify-center gap-1 px-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50 transition text-gray-500 hover:text-blue-600 min-w-[70px]"
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-xs font-medium">Cards</span>
      </Link>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition p-1 rounded-full bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-200 shadow-sm disabled:opacity-40"
        title="Remover lição"
      >
        {deleting ? <span className="w-4 h-4 block" /> : <X className="w-3.5 h-3.5" />}
      </button>
    </div>
    </>
  );
}
