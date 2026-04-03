"use client";

import ConvictionBadge from "./ConvictionBadge";
import type { Position } from "../data/portfolioData";

interface PositionTableProps {
  positions: Position[];
  compact?: boolean;
}

export default function PositionTable({ positions, compact = false }: PositionTableProps) {
  const getReturnColor = (ret: string) => {
    if (ret.includes("+")) return "text-emerald-600";
    if (ret.includes("-")) return "text-red-600";
    return "text-[#171c1f]";
  };

  const getDirectionStyle = (dir: string) => {
    const d = dir.toUpperCase();
    if (d.includes("SHORT") || d.includes("REDUCE") || d.includes("TRIM")) return "text-red-600";
    if (d.includes("PAIRS")) return "text-amber-600";
    if (d.includes("PROTECTION") || d.includes("VOL")) return "text-purple-600";
    return "text-emerald-600";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#f0f4f8]">
            <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
              Ticker
            </th>
            {!compact && (
              <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                Company
              </th>
            )}
            <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
              Direction
            </th>
            <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-right">
              Weight
            </th>
            <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-right">
              30d Target
            </th>
            <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-right">
              Exp. Return
            </th>
            {!compact && (
              <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                Conviction
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, i) => (
            <tr
              key={pos.ticker + i}
              className="transition-colors hover:bg-[#f6fafe]"
              style={{ borderBottom: "1px solid #f0f4f8" }}
            >
              <td className="px-3 py-3">
                <span
                  className="text-[#171c1f] text-sm font-semibold"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {pos.ticker}
                </span>
              </td>
              {!compact && (
                <td className="px-3 py-3 text-[#42474d] text-xs max-w-[200px] truncate">
                  {pos.company}
                </td>
              )}
              <td className="px-3 py-3">
                <span className={`text-xs font-medium ${getDirectionStyle(pos.direction)}`}>
                  {pos.direction}
                </span>
              </td>
              <td className="px-3 py-3 text-right">
                <span className="text-[#171c1f] text-xs tabular-nums font-medium">
                  {pos.weightPct}%
                </span>
              </td>
              <td className="px-3 py-3 text-right text-[#42474d] text-xs tabular-nums">
                {pos.priceTarget30d}
              </td>
              <td className="px-3 py-3 text-right">
                <span className={`text-xs tabular-nums font-medium ${getReturnColor(pos.expectedReturn)}`}>
                  {pos.expectedReturn}
                </span>
              </td>
              {!compact && pos.conviction && (
                <td className="px-3 py-3">
                  <ConvictionBadge level={pos.conviction} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
