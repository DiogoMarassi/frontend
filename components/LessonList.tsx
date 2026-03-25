'use client';

import { useState, useMemo } from 'react';
import { type Lesson } from '../lib/api';
import LessonCard from './LessonCard';
import CreateLessonButton from './CreateLessonButton';
import { BookOpen } from 'lucide-react';

const LEVEL_ORDER: Record<string, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };

type SortBy = 'date' | 'level';
type Direction = 'asc' | 'desc';

export default function LessonList({ lessons, onCreated }: { lessons: Lesson[]; onCreated?: () => void }) {
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [direction, setDirection] = useState<Direction>('desc');

  const sorted = useMemo(() => {
    return [...lessons].sort((a, b) => {
      let diff = 0;
      if (sortBy === 'date') {
        diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (diff === 0) diff = (LEVEL_ORDER[a.level ?? ''] ?? 99) - (LEVEL_ORDER[b.level ?? ''] ?? 99);
      } else {
        diff = (LEVEL_ORDER[a.level ?? ''] ?? 99) - (LEVEL_ORDER[b.level ?? ''] ?? 99);
        if (diff === 0) diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return direction === 'asc' ? diff : -diff;
    });
  }, [lessons, sortBy, direction]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Lições</h1>
        <CreateLessonButton onCreated={onCreated} />
      </div>

      <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 whitespace-nowrap">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white outline-none focus:border-blue-400 transition cursor-pointer"
          >
            <option value="date">Data</option>
            <option value="level">Nível</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 whitespace-nowrap">Ordem</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as Direction)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white outline-none focus:border-blue-400 transition cursor-pointer"
          >
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((lesson) => (
          <LessonCard
            key={lesson.id}
            id={lesson.id}
            title={lesson.title}
            level={lesson.level}
            createdAt={lesson.createdAt}
            cardStats={lesson.cardStats}
          />
        ))}

        {lessons.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-gray-500">Nenhuma lição ainda.</p>
            <p className="text-sm mt-1">Clique em "Criar lição" para começar.</p>
          </div>
        )}
      </div>
    </>
  );
}
