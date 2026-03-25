'use client';

import { useState } from 'react';
import CreateLessonModal from './CreateLessonModal';
import { Plus } from 'lucide-react';

export default function CreateLessonButton({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Criar lição
      </button>

      {open && <CreateLessonModal onClose={() => setOpen(false)} onCreated={onCreated} />}
    </>
  );
}
