'use client';

import { useState } from 'react';
import { markCardLearned, unmarkCardLearned, markCardLearnedGlobal, unmarkCardLearnedGlobal, type Card } from '../lib/api';
import { Trophy, LayoutGrid, Check, Undo2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  cards: Card[];
}

function FlashCard({
  card,
  side,
}: {
  card: Card;
  side: 'learning' | 'learned';
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full h-52 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Frente */}
        <div
          className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-6 shadow-md border-2 ${side === 'learned'
            ? 'bg-emerald-50 border-emerald-100'
            : 'bg-white border-gray-100'
            }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className={`text-xs font-medium px-2 py-0.5 rounded-full mb-3 ${side === 'learned' ? 'bg-emerald-100 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
            {card.lessonTitle}
          </p>
          <p className={`text-2xl font-bold text-center ${side === 'learned' ? 'text-emerald-800' : 'text-gray-800'}`}>
            {card.original}
          </p>
          <p className={`text-xs mt-3 ${side === 'learned' ? 'text-emerald-400' : 'text-gray-400'}`}>
            Clique para ver a tradução
          </p>
        </div>

        {/* Verso */}
        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center px-6 shadow-md ${side === 'learned' ? 'bg-emerald-600' : 'bg-blue-600'
            }`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-2xl font-bold text-white text-center">{card.translation}</p>
        </div>
      </div>
    </div>
  );
}

function CardQueue({
  title,
  cards,
  side,
  onMarkLearned,
  onUnmarkLearned,
}: {
  title: string;
  cards: Card[];
  side: 'learning' | 'learned';
  onMarkLearned?: (id: string) => void;
  onUnmarkLearned?: (id: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const current = cards[index] ?? null;
  const total = cards.length;

  async function handleMarkLearned() {
    if (!current || !onMarkLearned || loading) return;
    setLoading(true);
    try {
      if (current.lessonId) {
        await markCardLearned(current.lessonId, current.id);
      } else {
        await markCardLearnedGlobal(current.id);
      }
      onMarkLearned(current.id);
      setIndex((i) => Math.max(0, Math.min(i, total - 2)));
    } finally {
      setLoading(false);
    }
  }

  async function handleUnmarkLearned() {
    if (!current || !onUnmarkLearned || loading) return;
    setLoading(true);
    try {
      if (current.lessonId) {
        await unmarkCardLearned(current.lessonId, current.id);
      } else {
        await unmarkCardLearnedGlobal(current.id);
      }
      onUnmarkLearned(current.id);
      setIndex((i) => Math.max(0, Math.min(i, total - 2)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header da fila */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-sm font-semibold uppercase tracking-wide ${side === 'learned' ? 'text-emerald-600' : 'text-blue-600'}`}>
            {title}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{total} {total === 1 ? 'palavra' : 'palavras'}</p>
        </div>
        {total > 0 && (
          <span className="text-sm text-gray-400">
            {index + 1} / {total}
          </span>
        )}
      </div>

      {/* Card ou empty state */}
      {current ? (
        <FlashCard card={current} side={side} />
      ) : (
        <div className={`w-full h-52 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center px-6 ${side === 'learned' ? 'border-emerald-100 text-emerald-300' : 'border-gray-100 text-gray-300'
          }`}>
          {side === 'learned'
            ? <Trophy className="w-10 h-10 mb-2" />
            : <LayoutGrid className="w-10 h-10 mb-2" />}
          <p className="text-sm font-medium">
            {side === 'learned' ? 'Nenhuma aprendida' : 'Nenhuma palavra aqui'}
          </p>
        </div>
      )}

      {/* Navegação */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0 || !current}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
          disabled={index >= total - 1 || !current}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          Próxima <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {side === 'learning' && onMarkLearned && (
        <button
          onClick={handleMarkLearned}
          disabled={!current || loading}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : <span className="flex items-center justify-center gap-1.5 pl-3 pd-3"><Check className="w-4 h-4" /> Marcar como aprendida</span>}
        </button>
      )}

      {side === 'learned' && onUnmarkLearned && (
        <button
          onClick={handleUnmarkLearned}
          disabled={!current || loading}
          className="w-full py-3 rounded-xl border p-5 border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '...' : <span className="flex items-center justify-center gap-1.5"><Undo2 className="w-4 h-4" /> Mover para não aprendidas</span>}
        </button>
      )}
    </div>
  );
}

export default function FlashCardGrid({ cards: initial }: Props) {
  const [cards, setCards] = useState(initial);

  const learning = cards.filter((c) => !c.learned);
  const learned = cards.filter((c) => c.learned);

  function handleMarkLearned(id: string) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, learned: true } : c)));
  }

  function handleUnmarkLearned(id: string) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, learned: false } : c)));
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-30">
        <CardQueue
          title="Aprendendo"
          cards={learning}
          side="learning"
          onMarkLearned={handleMarkLearned}
        />
        <CardQueue
          title="Aprendidas"
          cards={learned}
          side="learned"
          onUnmarkLearned={handleUnmarkLearned}
        />
      </div>
    </div>

  );
}
