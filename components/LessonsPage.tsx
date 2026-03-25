'use client';

import { useEffect, useState } from 'react';
import { getLessons, type Lesson } from '../lib/api';
import LessonList from './LessonList';
import { LessonCardSkeleton } from './Skeleton';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = () => {
    setLoading(true);
    getLessons().then(setLessons).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLessons(); }, []);

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-24 animate-pulse bg-gray-200 rounded-lg" />
          <div className="h-9 w-28 animate-pulse bg-gray-200 rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => <LessonCardSkeleton key={i} />)}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <LessonList
        lessons={lessons}
        onCreated={fetchLessons}
        onDeleted={(id) => setLessons((prev) => prev.filter((l) => l.id !== id))}
      />
    </main>
  );
}
