export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

// ── Lesson list ───────────────────────────────────────────────────────────────

export function LessonCardSkeleton() {
  return (
    <div className="flex gap-2">
      <div className="flex-1 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-8 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1 px-4 bg-white border border-gray-100 rounded-xl min-w-[70px]">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

// ── Lesson page ───────────────────────────────────────────────────────────────

export function LessonPageSkeleton() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* back link */}
      <Skeleton className="h-4 w-36 mb-6" />

      {/* header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* theme words */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>

      {/* audio player + mini translator */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 space-y-2">
          {/* player controls */}
          <Skeleton className="h-14 w-full rounded-2xl" />
          {/* story text */}
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
          ))}
        </div>
        {/* mini translator */}
        <div className="w-80 flex-shrink-0 space-y-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}

// ── Cards page ────────────────────────────────────────────────────────────────

function CardQueueSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-10" />
      </div>
      {/* card */}
      <Skeleton className="h-52 w-full rounded-2xl" />
      {/* nav buttons */}
      <div className="flex gap-2">
        <Skeleton className="flex-1 h-10 rounded-xl" />
        <Skeleton className="flex-1 h-10 rounded-xl" />
      </div>
      {/* action button */}
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}

export function CardsPageSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Skeleton className="h-4 w-36 mb-6" />
      <div className="mb-8 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex gap-6 items-start">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-8">
            <CardQueueSkeleton />
            <CardQueueSkeleton />
          </div>
        </div>
        <div className="w-80 flex-shrink-0 space-y-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}

// ── Vocabulary page ───────────────────────────────────────────────────────────

export function VocabularyPageSkeleton() {
  return (
    <main className="max-w-4xl w-full mx-auto px-4 py-10">
      <Skeleton className="h-4 w-36 mb-6" />
      <div className="mb-8 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
      {/* search + actions bar */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      {/* table rows */}
      <div className="space-y-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-20 rounded-full ml-auto" />
            <Skeleton className="h-4 w-6" />
          </div>
        ))}
      </div>
    </main>
  );
}
