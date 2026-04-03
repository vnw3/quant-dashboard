"use client";

interface FidelityScoreProps {
  score: number;
  size?: number;
}

export default function FidelityScore({ score = 0, size = 56 }: FidelityScoreProps) {
  const safeScore = Number.isFinite(score) ? score : 0;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const getColor = () => {
    if (safeScore >= 90) return "#10b981";
    if (safeScore >= 80) return "#3b82f6";
    if (safeScore >= 70) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e8ecf0"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span
        className="absolute text-[#171c1f] font-semibold"
        style={{
          fontSize: size < 50 ? 11 : 14,
          fontFamily: "var(--font-inter)",
        }}
      >
        {safeScore}
      </span>
    </div>
  );
}
