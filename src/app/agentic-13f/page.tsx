"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { agentic13FPositions as staticPositions, sectorShifts as staticSectorShifts, type Agentic13FPosition } from "../../data/agentic13f";
import { fundProfiles as staticFundProfiles } from "../../data/fundProfiles";
import { fetchAgentic13F, fetchFunds } from "../../lib/api";
import type { FundProfile } from "../../data/fundProfiles";

export default function Agentic13FPage() {
  const [allPositions, setAllPositions] = useState<Agentic13FPosition[]>(staticPositions);
  const [sectorShifts, setSectorShifts] = useState(staticSectorShifts);
  const [fundProfiles, setFundProfiles] = useState<FundProfile[]>(staticFundProfiles);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [agentic, funds] = await Promise.allSettled([
        fetchAgentic13F(),
        fetchFunds(),
      ]);

      if (agentic.status === "fulfilled") {
        const data = agentic.value as Record<string, unknown>;
        if (data.positions) setAllPositions(data.positions as Agentic13FPosition[]);
        if (data.sectorShifts) setSectorShifts(data.sectorShifts as typeof staticSectorShifts);
        setLastUpdated(new Date());
      }

      if (funds.status === "fulfilled" && Array.isArray(funds.value)) {
        setFundProfiles(funds.value as unknown as FundProfile[]);
      }
    } catch {
      // Keep static fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const crowded = allPositions.filter((p) => p.isCrowded);
  const divergent = allPositions.filter((p) => p.isDivergent);
  const rest = allPositions.filter((p) => !p.isCrowded && !p.isDivergent);

  return (
    <div className="p-8 max-w-[1300px] mx-auto">
      {/* Back link */}
      <Link
        href="/"
        className="text-[#6b7280] text-sm hover:text-[#171c1f] transition-colors inline-flex items-center gap-1 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Overview
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#171c1f] tracking-tight"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Agentic 13F Tracker
          </h1>
          <p className="text-[#42474d] text-sm mt-1">
            Projected combined portfolio from all 5 fund agents. Conviction-weighted directionality.
          </p>
          {lastUpdated && (
            <p className="text-[#9ca3af] text-[11px] mt-1">
              Last generated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
              refreshing
                ? "bg-[#e8ecf0] text-[#6b7280] cursor-not-allowed"
                : "bg-[#001629] text-white hover:bg-[#002B49]"
            }`}
          >
            {refreshing ? (
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Refreshing...
              </span>
            ) : (
              "Refresh Projections"
            )}
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-md">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-amber-700 text-xs font-medium">Crowded: {crowded.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-md">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-purple-700 text-xs font-medium">Divergent: {divergent.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="w-6 h-6 text-[#3b82f6] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      ) : (
        <>
          {/* Crowded Longs Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h2
                className="text-lg font-semibold text-[#171c1f] tracking-tight"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Crowded Positions
              </h2>
              <span className="text-[#6b7280] text-xs">(3+ funds agree)</span>
            </div>
            <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-amber-50/50">
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Asset</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Direction</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-center"># Funds</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-center">Conviction</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Breakdown</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {crowded.map((pos) => (
                    <tr key={pos.asset} className="hover:bg-amber-50/30" style={{ borderBottom: "1px solid #f0f4f8" }}>
                      <td className="px-4 py-3 text-sm font-semibold text-[#171c1f]">{pos.asset}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${pos.netDirection.includes("SHORT") ? "text-red-600" : "text-emerald-600"}`}>
                          {pos.netDirection}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-amber-700">{pos.numFunds}</td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-[#171c1f] tabular-nums">{pos.weightedConviction}</td>
                      <td className="px-4 py-3 text-xs text-[#6b7280] tabular-nums">{pos.convictionBreakdown}</td>
                      <td className="px-4 py-3 text-xs text-[#42474d] max-w-[300px]">{pos.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Divergent Alpha Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <h2
                className="text-lg font-semibold text-[#171c1f] tracking-tight"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Divergent Alpha
              </h2>
              <span className="text-[#6b7280] text-xs">(Single-fund unique signals)</span>
            </div>
            <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-purple-50/50">
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Asset</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Direction</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-center"># Funds</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-center">Conviction</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {divergent.map((pos) => (
                    <tr key={pos.asset} className="hover:bg-purple-50/30" style={{ borderBottom: "1px solid #f0f4f8" }}>
                      <td className="px-4 py-3 text-sm font-semibold text-[#171c1f]">{pos.asset}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${pos.netDirection.includes("SHORT") ? "text-red-600" : "text-emerald-600"}`}>
                          {pos.netDirection}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-purple-700">{pos.numFunds}</td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-[#171c1f] tabular-nums">{pos.weightedConviction}</td>
                      <td className="px-4 py-3 text-xs text-[#42474d] max-w-[350px]">{pos.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* All Other Positions */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              <h2
                className="text-lg font-semibold text-[#171c1f] tracking-tight"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                All Positions
              </h2>
            </div>
            <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f0f4f8]">
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Asset</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Direction</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-center"># Funds</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-center">Conviction</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Breakdown</th>
                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((pos) => {
                    const dirColor = pos.netDirection.includes("SHORT") || pos.netDirection === "REDUCE"
                      ? "text-red-600"
                      : pos.netDirection === "CONTESTED"
                      ? "text-amber-600"
                      : pos.netDirection.includes("weakening")
                      ? "text-yellow-600"
                      : "text-emerald-600";
                    return (
                      <tr key={pos.asset} className="hover:bg-[#f6fafe]" style={{ borderBottom: "1px solid #f0f4f8" }}>
                        <td className="px-4 py-3 text-sm font-medium text-[#171c1f]">{pos.asset}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${dirColor}`}>{pos.netDirection}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-medium text-[#171c1f] tabular-nums">{pos.numFunds}</td>
                        <td className="px-4 py-3 text-center text-sm text-[#42474d] tabular-nums">
                          {pos.weightedConviction > 0 ? pos.weightedConviction : "--"}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6b7280] tabular-nums">{pos.convictionBreakdown}</td>
                        <td className="px-4 py-3 text-xs text-[#42474d] max-w-[300px]">{pos.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sector Shift Visualizations */}
          <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
            <h3
              className="text-[#171c1f] text-base font-semibold mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Sector Shifts by Fund
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {fundProfiles.map((fund) => {
                const shifts = sectorShifts[fund.id as keyof typeof sectorShifts];
                if (!shifts) return null;
                return (
                  <div key={fund.id} className="bg-[#f6fafe] rounded-md p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fund.color }} />
                      <span className="text-xs font-semibold text-[#171c1f]">{fund.shortName}</span>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(shifts).map(([sector, data]) => {
                        const isPositive = typeof data === "object" && "change" in data && !data.change.startsWith("-");
                        return (
                          <div key={sector} className="flex justify-between items-center">
                            <span className="text-[10px] text-[#6b7280] truncate flex-1 mr-2">
                              {sector.replace(/_/g, " ")}
                            </span>
                            <span
                              className={`text-[10px] font-medium tabular-nums ${
                                isPositive ? "text-emerald-600" : "text-red-600"
                              }`}
                            >
                              {typeof data === "object" && "change" in data ? data.change : String(data)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
