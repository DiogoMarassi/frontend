'use client';

import { useState, useRef, useEffect } from 'react';
import { completeLesson, Word } from '../lib/api';
import { getUser } from '../lib/auth';
import StoryText from './StoryText';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  content: string;
  words: Word[];
  lessonId: string;
  savedWordIds?: string[];
}

export default function AudioPlayer({ audioUrl, content, words, lessonId, savedWordIds }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [streak, setStreak] = useState<{ currentStreak: number; highestStreak: number } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user) setUserId(user.id);
  }, []);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    setCurrentTime(currentTime);
    if (duration) setProgress((currentTime / duration) * 100);

    if (currentTime >= duration && duration > 0 && !streak) {
      setIsPlaying(false);
      if (userId) {
        completeLesson(userId, lessonId).then(setStreak).catch(console.error);
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const { duration } = audioRef.current;
    if (!duration || !isFinite(duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
  };

  return (
    <>
      {/* Conteúdo da história — fluxo normal */}
      <div className="pb-28">
        {!userId && (
          <p className="mb-4 text-sm text-gray-400 text-center">
            <a href="/login" className="text-blue-500 hover:underline">Entre</a> para salvar seu progresso.
          </p>
        )}
        <StoryText content={content} words={words} lessonId={lessonId} initialSaved={savedWordIds} />
      </div>

      {/* Player fixo no centro inferior */}
      <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} />

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-white border border-gray-200 shadow-xl rounded-2xl px-5 py-3 w-[min(520px,90vw)]">
        <button
          onClick={togglePlay}
          className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition flex-shrink-0 text-sm"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>

        <div
          className="flex-1 h-3 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-xs font-medium text-gray-400 w-10 text-right flex-shrink-0">
          {Math.floor(currentTime)}s
        </span>
      </div>
    </>
  );
}
