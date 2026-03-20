interface StreakBadgeProps {
  currentStreak: number;
  highestStreak: number;
}

export default function StreakBadge({ currentStreak, highestStreak }: StreakBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2">
      <span className="text-xl">🔥</span>
      <div className="text-sm">
        <span className="font-bold text-orange-600">{currentStreak} dias</span>
        <span className="text-gray-400 ml-1">(recorde: {highestStreak})</span>
      </div>
    </div>
  );
}
