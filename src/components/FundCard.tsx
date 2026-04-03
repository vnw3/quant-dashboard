"use client";

import Link from "next/link";
import FidelityScore from "./FidelityScore";
import type { FundProfile } from "../data/fundProfiles";

interface FundCardProps {
  fund: FundProfile;
}

export default function FundCard({ fund }: FundCardProps) {
  const isPositiveNet = fund.netExposureNum >= 0;

  return (
    <Link href={`/funds/${fund.id}`}>
      <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-5 hover:shadow-[0_20px_40px_rgba(23,28,31,0.1)] transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: fund.color }}
            />
            <h3
              className="text-[#171c1f] text-sm font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {fund.shortName}
            </h3>
          </div>
          <FidelityScore score={fund.fidelityScore} size={44} />
        </div>

        <p className="text-[#42474d] text-[11px] mb-4">{fund.archetype}</p>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#6b7280] text-[11px]">Net Exposure</span>
            <span
              className={`text-xs font-medium tabular-nums ${
                isPositiveNet ? "text-emerald-600" : "text-red-600"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {fund.netExposure}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6b7280] text-[11px]">Gross Leverage</span>
            <span
              className="text-[#171c1f] text-xs font-medium tabular-nums"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {fund.grossLeverage}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6b7280] text-[11px]">Positions</span>
            <span
              className="text-[#171c1f] text-xs font-medium tabular-nums"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {fund.totalPositions}
            </span>
          </div>
        </div>

        {fund.projectedReturn && (
        <div className="mt-4 pt-3 flex gap-2" style={{ borderTop: "1px solid #f0f4f8" }}>
          <div className="flex-1 text-center">
            <p className="text-[9px] text-[#6b7280] uppercase">Bull</p>
            <p className="text-emerald-600 text-xs font-medium tabular-nums">{fund.projectedReturn.bull}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-[9px] text-[#6b7280] uppercase">Base</p>
            <p className="text-[#171c1f] text-xs font-medium tabular-nums">{fund.projectedReturn.base}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-[9px] text-[#6b7280] uppercase">Bear</p>
            <p className="text-red-600 text-xs font-medium tabular-nums">{fund.projectedReturn.bear}</p>
          </div>
        </div>
        )}
      </div>
    </Link>
  );
}
