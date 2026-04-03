"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FidelityScore from "../../../components/FidelityScore";
import PositionTable from "../../../components/PositionTable";
import { fundProfiles as staticFundProfiles } from "../../../data/fundProfiles";
import { portfolios as staticPortfolios } from "../../../data/portfolioData";
import { fetchFund } from "../../../lib/api";
import type { FundProfile } from "../../../data/fundProfiles";
import type { FundPortfolio } from "../../../data/portfolioData";

export default function FundPageClient({ fundId }: { fundId: string }) {
  const staticProfile = staticFundProfiles.find((f) => f.id === fundId) ?? null;
  const staticPortfolio = staticPortfolios[fundId] ?? null;

  const [profile, setProfile] = useState<FundProfile | null>(staticProfile);
  const [portfolio, setPortfolio] = useState<FundPortfolio | null>(staticPortfolio);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFund(fundId);
      if (data.profile) setProfile(data.profile as unknown as FundProfile);
      if (data.portfolio) setPortfolio(data.portfolio as unknown as FundPortfolio);
      setLastUpdated(new Date());
    } catch {
      // Keep static fallback
    } finally {
      setLoading(false);
    }
  }, [fundId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!profile || !portfolio) {
    return (
      <div className="p-8">
        <h1 className="text-xl text-[#171c1f]">Fund not found</h1>
        <Link href="/" className="text-blue-600 text-sm mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <Link
        href="/"
        className="text-[#6b7280] text-sm hover:text-[#171c1f] transition-colors inline-flex items-center gap-1 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Overview
      </Link>

      <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className="w-3 h-12 rounded-full mt-1"
              style={{ backgroundColor: profile.color }}
            />
            <div>
              <h1
                className="text-2xl font-bold text-[#171c1f] tracking-tight"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {profile.name}
              </h1>
              <p className="text-[#42474d] text-sm mt-1">{profile.archetype}</p>
              {lastUpdated && (
                <p className="text-[#9ca3af] text-[11px] mt-1">
                  Data as of: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            {loading && (
              <svg className="w-4 h-4 text-[#3b82f6] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            <div className="text-center">
              <p className="text-[10px] text-[#6b7280] uppercase mb-1">Fidelity Score</p>
              <FidelityScore score={profile.fidelityScore} size={64} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mt-6 pt-6" style={{ borderTop: "1px solid #f0f4f8" }}>
          <div>
            <p className="text-[10px] text-[#6b7280] uppercase mb-1">AUM</p>
            <p className="text-[#171c1f] text-sm font-semibold">{profile.aum}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6b7280] uppercase mb-1">Net Exposure</p>
            <p className={`text-sm font-semibold ${profile.netExposureNum >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {profile.netExposure}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#6b7280] uppercase mb-1">Gross Leverage</p>
            <p className="text-[#171c1f] text-sm font-semibold">{profile.grossLeverage}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6b7280] uppercase mb-1">Positions</p>
            <p className="text-[#171c1f] text-sm font-semibold">{profile.totalPositions}</p>
          </div>
          {profile.projectedReturn && (
          <div>
            <p className="text-[10px] text-[#6b7280] uppercase mb-1">30d Returns (B/Ba/Be)</p>
            <div className="flex gap-2 items-center">
              <span className="text-emerald-600 text-xs font-medium">{profile.projectedReturn.bull}</span>
              <span className="text-[#171c1f] text-xs font-medium">{profile.projectedReturn.base}</span>
              <span className="text-red-600 text-xs font-medium">{profile.projectedReturn.bear}</span>
            </div>
          </div>
          )}
        </div>
      </div>

      <div className="bg-[#f0f4f8] rounded-md p-4 mb-6">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-[#3b82f6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#42474d] text-xs">
            <span className="font-medium text-[#171c1f]">Portfolio Comparison:</span> Showing
            projected 30-day positions generated by the AI agent. Connect a live portfolio feed at{" "}
            <code className="text-[#3b82f6] bg-white px-1 py-0.5 rounded text-[11px]">
              /api/funds/{fundId}/live
            </code>{" "}
            for real-time vs projected delta tracking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
          <h3
            className="text-[#171c1f] text-base font-semibold mb-3 tracking-tight"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Strategy Summary
          </h3>
          <p className="text-[#42474d] text-sm leading-relaxed mb-4">
            {profile.strategySummary}
          </p>
          <h4 className="text-[#171c1f] text-xs font-semibold uppercase tracking-wider mb-2">
            Key Themes
          </h4>
          <div className="space-y-1.5">
            {profile.keyThemes.map((theme) => (
              <div key={theme} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#6b7280]" />
                <span className="text-[#42474d] text-xs">{theme}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
            <h3
              className="text-[#171c1f] text-base font-semibold mb-3 tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Risk Metrics
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-[10px] text-[#6b7280] uppercase mb-1">Max Drawdown</p>
                <p className="text-red-600 text-sm font-semibold">{portfolio.riskMetrics.maxDrawdown}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6b7280] uppercase mb-1">Sharpe Target</p>
                <p className="text-[#171c1f] text-sm font-semibold">{portfolio.riskMetrics.sharpeTarget}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6b7280] uppercase mb-1">VaR (95%)</p>
                <p className="text-red-600 text-sm font-semibold">{portfolio.riskMetrics.var95}</p>
              </div>
            </div>
            <p className="text-[#6b7280] text-xs leading-relaxed">
              <span className="text-[#42474d] font-medium">Key Risk: </span>
              {portfolio.riskMetrics.keyRisk}
            </p>
          </div>

          <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
            <h3
              className="text-[#171c1f] text-base font-semibold mb-3 tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              30-Day Catalysts
            </h3>
            <div className="space-y-2">
              {portfolio.catalysts.map((cat) => (
                <div key={cat} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span className="text-[#42474d] text-xs leading-relaxed">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6 mb-6">
        <h3
          className="text-[#171c1f] text-base font-semibold mb-4 tracking-tight"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Sector Allocation
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(portfolio.sectorAllocation).map(([sector, pct]) => (
            <div key={sector} className="bg-[#f6fafe] rounded-md p-3">
              <p className="text-[#42474d] text-[11px] mb-1 truncate" title={sector}>
                {sector}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#e8ecf0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(Math.abs(pct), 50) * 2}%`,
                      backgroundColor: pct >= 0 ? profile.color : "#ef4444",
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-medium tabular-nums ${
                    pct >= 0 ? "text-[#171c1f]" : "text-red-600"
                  }`}
                >
                  {pct > 0 ? "+" : ""}
                  {pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
        <h3
          className="text-[#171c1f] text-base font-semibold mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          30-Day Projected Portfolio
        </h3>
        <p className="text-[#6b7280] text-xs mb-4">
          Key positions with price targets and expected returns
        </p>
        <PositionTable positions={portfolio.positions} />
      </div>
    </div>
  );
}
