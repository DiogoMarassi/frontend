'use client';

import { useState, useRef } from 'react';
import { saveManualVocabulary } from '../lib/api';
import { ArrowLeftRight, Check } from 'lucide-react';

type Direction = 'fr-pt' | 'pt-fr';

const LANGS: Record<Direction, { from: string; to: string; fromCode: string; toCode: string; placeholder: string }> = {
  'fr-pt': { from: 'Francês', to: 'Português', fromCode: 'fr', toCode: 'pt-BR', placeholder: 'Digite em francês...' },
  'pt-fr': { from: 'Português', to: 'Francês', fromCode: 'pt-BR', toCode: 'fr', placeholder: 'Digite em português...' },
};

export default function MiniTranslator({ lessonId }: { lessonId?: string } = {}) {
  const [direction, setDirection] = useState<Direction>('fr-pt');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Manual add state
  const [manualFr, setManualFr] = useState('');
  const [manualPt, setManualPt] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  const lang = LANGS[direction];

  function handleInput(value: string) {
    setInput(value);
    setResult('');
    if (debounce.current) clearTimeout(debounce.current);
    if (!value.trim()) return;
    debounce.current = setTimeout(() => translate(value.trim()), 600);
  }

  async function translate(text: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${lang.fromCode}|${lang.toCode}`
      );
      const data = await res.json();
      setResult(data?.responseData?.translatedText ?? '—');
    } catch {
      setResult('Erro ao traduzir.');
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    setDirection((d) => (d === 'fr-pt' ? 'pt-fr' : 'fr-pt'));
    setInput('');
    setResult('');
  }

  async function handleSave() {
    if (!manualFr.trim() || !manualPt.trim()) return;
    setSaving(true);
    setSaveStatus('idle');
    try {
      await saveManualVocabulary(manualFr.trim(), manualPt.trim(), lessonId);
      setSaveStatus('ok');
      setManualFr('');
      setManualPt('');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('err');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">Tradução rápida</span>
      </div>

      {/* Language bar */}
      <div className="flex items-center border-b border-gray-100">
        <div className="flex-1 px-4 py-2 text-xs font-semibold text-blue-600">{lang.from}</div>
        <button
          onClick={swap}
          className="px-3 py-2 text-gray-400 hover:text-gray-700 transition"
          title="Inverter idiomas"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
        <div className="flex-1 px-4 py-2 text-xs font-semibold text-gray-500 text-right">{lang.to}</div>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        placeholder={lang.placeholder}
        rows={4}
        className="w-full px-4 py-3 text-sm text-gray-800 resize-none outline-none placeholder:text-gray-300 border-b border-gray-100"
      />

      {/* Output */}
      <div className="px-4 py-3 min-h-[72px] bg-gray-50 border-b border-gray-100">
        {loading ? (
          <span className="text-gray-300 text-sm animate-pulse">Traduzindo...</span>
        ) : result ? (
          <span className="text-gray-800 text-sm font-medium">{result}</span>
        ) : (
          <span className="text-gray-300 text-sm">Tradução aparece aqui</span>
        )}
      </div>

      {/* Manual add section */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Adicionar ao vocabulário</p>
        <input
          type="text"
          value={manualFr}
          onChange={(e) => setManualFr(e.target.value)}
          placeholder="Palavra em francês"
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400 transition placeholder:text-gray-300"
        />
        <input
          type="text"
          value={manualPt}
          onChange={(e) => setManualPt(e.target.value)}
          placeholder="Tradução em português"
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400 transition placeholder:text-gray-300"
        />
        <button
          onClick={handleSave}
          disabled={saving || !manualFr.trim() || !manualPt.trim()}
          className={`w-full py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
            saveStatus === 'ok'
              ? 'bg-emerald-100 text-emerald-700'
              : saveStatus === 'err'
              ? 'bg-red-100 text-red-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {saveStatus === 'ok' ? <span className="flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> Adicionada!</span> : saveStatus === 'err' ? 'Erro ao salvar' : saving ? '...' : 'Adicionar'}
        </button>
      </div>

      <div className="px-4 py-2 border-t border-gray-100 text-right">
        <span className="text-xs text-gray-300">powered by MyMemory</span>
      </div>
    </div>
  );
}
