export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  );
}

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
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </div>
      <Skeleton className="w-[70px] rounded-xl" />
    </div>
  );
}

export function LessonPageSkeleton() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="w-80 h-64 flex-shrink-0 rounded-xl" />
      </div>
    </main>
  );
}

export function CardsPageSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="mb-8 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="w-80 h-64 flex-shrink-0 rounded-xl" />
      </div>
    </main>
  );
}

export function VocabularyPageSkeleton() {
  return (
    <main className="max-w-4xl w-full mx-auto px-4 py-10">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="mb-8 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </main>
  );
}
