'use client';

import { useEffect, useRef, useState } from 'react';
import { getLessons, type Lesson } from '../lib/api';
import LessonList from './LessonList';
import { LessonCardSkeleton } from './Skeleton';

const POLL_INTERVAL_MS = 4000;

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLessons = (showLoading = true) => {
    if (showLoading) setLoading(true);
    return getLessons()
      .then((data) => {
        setLessons(data);
        return data;
      })
      .catch(() => [] as Lesson[])
      .finally(() => { if (showLoading) setLoading(false); });
  };

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const data = await fetchLessons(false);
      if (!data.some((l) => l.status === 'PENDING')) stopPolling();
    }, POLL_INTERVAL_MS);
  };

  useEffect(() => {
    fetchLessons().then((data) => {
      if (data.some((l) => l.status === 'PENDING')) startPolling();
    });
    return () => stopPolling();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        onCreated={() => { fetchLessons(false); startPolling(); }}
        onDeleted={(id) => setLessons((prev) => prev.filter((l) => l.id !== id))}
      />
    </main>
  );
}
