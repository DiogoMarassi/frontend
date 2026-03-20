'use client';

import { useState, useRef, useEffect } from 'react';
import { completeLesson, Word } from '../lib/api';
import { getUser } from '../lib/auth';
import StreakBadge from './StreakBadge';
import StoryText from './StoryText';

interface AudioPlayerProps {
  audioUrl: string;
  content: string;
  words: Word[];
  lessonId: string;
}

export default function AudioPlayer({ audioUrl, content, words, lessonId }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [streak, setStreak] = useState<{ currentStreak: number; highestStreak: number } | null>(
    null,
  );
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
        completeLesson(userId, lessonId)
          .then(setStreak)
          .catch(console.error);
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
    const bar = e.currentTarget;
    const pct = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">História do Dia</h2>
        <StoryText content={content} words={words} lessonId={lessonId} />
      </div>

      {!userId && (
        <p className="mb-4 text-sm text-gray-400 text-center">
          <a href="/login" className="text-blue-500 hover:underline">Entre</a> para salvar seu progresso.
        </p>
      )}

      <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} />

      <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700 transition flex-shrink-0"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div
          className="flex-1 h-4 bg-gray-300 rounded-full cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-sm font-medium text-gray-500 w-12 text-right flex-shrink-0">
          {Math.floor(currentTime)}s
        </div>
      </div>
    </div>
  );
}
