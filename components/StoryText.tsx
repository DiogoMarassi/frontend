'use client';

import { useState, useEffect, useRef } from 'react';
import { saveCard } from '../lib/api';

interface Word {
  id: string;
  original: string;
  translation: string;
}

interface Props {
  content: string;
  words: Word[];
  lessonId: string;
}

type Segment = { type: 'text'; value: string } | { type: 'word'; value: string; word: Word };

function buildSegments(content: string, words: Word[]): Segment[] {
  if (!words.length) return [{ type: 'text', value: content }];

  const sorted = [...words].sort((a, b) => b.original.length - a.original.length);
  const pattern = sorted.map((w) => w.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(?<![a-zàâçéèêëîïôûùüÿœæ])(${pattern})(?![a-zàâçéèêëîïôûùüÿœæ])`, 'gi');

  const parts = content.split(regex);
  const wordMap = new Map(words.map((w) => [w.original.toLowerCase(), w]));

  return parts.map((part) => {
    const matched = wordMap.get(part.toLowerCase());
    if (matched) return { type: 'word', value: part, word: matched };
    return { type: 'text', value: part };
  });
}

export default function StoryText({ content, words, lessonId }: Props) {
  const [activeWord, setActiveWord] = useState<Word | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const segments = buildSegments(content, words);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveWord(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleWordClick(e: React.MouseEvent<HTMLSpanElement>, word: Word) {
    e.stopPropagation();
    if (activeWord?.id === word.id) {
      setActiveWord(null);
      setTooltipPos(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current!.getBoundingClientRect();
    setTooltipPos({
      top: rect.top - containerRect.top - 8,
      left: rect.left - containerRect.left + rect.width / 2,
    });
    setActiveWord(word);
  }

  async function handleSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (!activeWord || saving) return;
    setSaving(true);
    try {
      await saveCard(lessonId, activeWord.id);
      setSaved((prev) => new Set(prev).add(activeWord.id));
      setActiveWord(null);
    } catch {
      // silently ignore duplicates
    } finally {
      setSaving(false);
    }
  }

  return (
    <div ref={containerRef} className="relative leading-8 text-gray-800 text-base whitespace-pre-wrap">
      {activeWord && tooltipPos && (
        <div
          className="absolute z-20 bg-white border border-gray-100 rounded-2xl shadow-xl pointer-events-auto overflow-hidden"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: 'translate(-50%, calc(-100% - 10px))',
            minWidth: '220px',
          }}
        >
          <div className="flex divide-x divide-gray-100">
            {/* Esquerda: palavra + tradução */}
            <div className="flex-1 px-4 py-4 flex flex-col justify-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{activeWord.original}</p>
              <p className="text-base font-semibold text-gray-800 mt-0.5">{activeWord.translation}</p>
            </div>

            {/* Direita: botão */}
            <button
              onClick={handleSave}
              disabled={saving || saved.has(activeWord.id)}
              className={`px-4 py-4 flex flex-col items-center justify-center text-xs font-semibold text-center leading-snug transition w-24 flex-shrink-0 disabled:opacity-50 ${
                saved.has(activeWord.id)
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saved.has(activeWord.id) ? (
                <>✓<br />Adicionado</>
              ) : saving ? (
                '...'
              ) : (
                <>Adicionar ao<br />vocabulário</>
              )}
            </button>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white drop-shadow-sm" />
        </div>
      )}

      {segments.map((seg, i) =>
        seg.type === 'word' ? (
          <span
            key={i}
            onClick={(e) => handleWordClick(e, seg.word)}
            className={`cursor-pointer rounded px-0.5 transition-colors ${saved.has(seg.word.id)
                ? 'bg-green-100 text-green-800'
                : activeWord?.id === seg.word.id
                  ? 'bg-blue-200 text-blue-900'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
          >
            {seg.value}
          </span>
        ) : (
          <span key={i}>{seg.value}</span>
        ),
      )}
    </div>
  );
}
