'use client';

import { useEffect, useState } from 'react';
import { getLessons, type Lesson } from '../lib/api';
import LessonList from './LessonList';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    getLessons().then(setLessons).catch(() => {});
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <LessonList lessons={lessons} />
    </main>
  );
}
