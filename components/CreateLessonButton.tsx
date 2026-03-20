'use client';

import { useState } from 'react';
import CreateLessonModal from './CreateLessonModal';

export default function CreateLessonButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        <span className="text-lg leading-none">+</span>
        Criar lição
      </button>

      {open && <CreateLessonModal onClose={() => setOpen(false)} />}
    </>
  );
}
