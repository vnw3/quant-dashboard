interface ConvictionBadgeProps {
  level: string;
}

export default function ConvictionBadge({ level }: ConvictionBadgeProps) {
  const normalized = level.toUpperCase();

  let bgColor: string;
  let textColor: string;

  if (normalized.includes("HIGH") || normalized === "H") {
    bgColor = "bg-emerald-50";
    textColor = "text-emerald-700";
  } else if (normalized.includes("MED") || normalized === "M") {
    bgColor = "bg-amber-50";
    textColor = "text-amber-700";
  } else {
    bgColor = "bg-slate-100";
    textColor = "text-slate-600";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase ${bgColor} ${textColor}`}
    >
      {level}
    </span>
  );
}
