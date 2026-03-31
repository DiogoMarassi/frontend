'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLesson, getCards, type Lesson, type Card } from '../../../lib/api';
import AudioPlayer from '../../../components/AudioPlayer';
import MiniTranslator from '../../../components/MiniTranslator';
import AuthGuard from '../../../components/AuthGuard';
import { LessonPageSkeleton } from '../../../components/Skeleton';
import Link from 'next/link';
import { ArrowLeft, Sparkles, LayoutGrid } from 'lucide-react';

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-emerald-100 text-emerald-700',
  B1: 'bg-blue-100 text-blue-700',
  B2: 'bg-indigo-100 text-indigo-700',
  C1: 'bg-purple-100 text-purple-700',
  C2: 'bg-rose-100 text-rose-700',
};

function LessonContent() {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getLesson(id).then(setLesson).catch(() => {}),
      getCards(id).then(setCards).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LessonPageSkeleton />;
  if (!lesson) return null;

  const savedOriginals = new Set(cards.map((c) => c.original.toLowerCase()));
  const savedWordIds = (lesson.story?.words ?? [])
    .filter((w) => savedOriginals.has(w.original.toLowerCase()))
    .map((w) => w.id);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-blue-500 hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar para lições
        </Link>
        <Link
          href={`/lesson/${id}/cards`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
        >
          <LayoutGrid className="w-4 h-4" /> Ver cards
        </Link>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          {lesson.level && (
            <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${LEVEL_COLORS[lesson.level] ?? 'bg-gray-100 text-gray-600'}`}>
              {lesson.level}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400">
          Criado em {new Date(lesson.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Leia a história enquanto ouve o áudio. Depois de compreender tudo com as traduções, tente escutar novamente mas sem olhar para o texto.
          Algumas traduções podem não estar tão precisas. Use a tradução rápida para ajudar, mas tente entender o significado das palavras em francês antes de olhar a tradução.
        </p>
      </div>

      {lesson.themeWords?.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Palavras-tema</p>
          <div className="flex flex-wrap gap-2">
            {lesson.themeWords.map((word) => (
              <span key={word} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {lesson.story ? (
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            <AudioPlayer
              content={lesson.story.content}
              words={lesson.story.words}
              audioUrl={lesson.story.audioUrl.startsWith('http') ? lesson.story.audioUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3001'}${lesson.story.audioUrl}`}
              lessonId={lesson.id}
              savedWordIds={savedWordIds}
            />
            {lesson.story.words.length > 0 && (
              <p className="mt-4 text-xs text-gray-400 text-center">
                Clique nas palavras destacadas para ver a tradução.
              </p>
            )}
          </div>
          <div className="w-85 flex-shrink-0">
            <MiniTranslator lessonId={lesson.id} />
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 mt-4">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-500">História ainda não gerada</p>
          <p className="text-sm mt-1">
            Em breve a IA irá criar uma história com nível <strong>{lesson.level}</strong> usando as palavras-tema desta lição.
          </p>
        </div>
      )}
    </main>
  );
}

export default function LessonPage() {
  return (
    <AuthGuard>
      <LessonContent />
    </AuthGuard>
  );
}
