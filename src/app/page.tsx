"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FundCard from "../components/FundCard";
import RadarChart from "../components/RadarChart";
import ConvictionBadge from "../components/ConvictionBadge";

// Static fallback data
import { fundProfiles as staticFundProfiles } from "../data/fundProfiles";
import {
  consensusScore as staticConsensus,
  crowdedLongs as staticCrowded,
  divergentAlpha as staticDivergent,
} from "../data/consensusData";
import { agentic13FPositions as staticPositions } from "../data/agentic13f";

// API client
import {
  fetchFunds,
  fetchConsensus,
  fetchAgentic13F,
  fetchMarketData,
  fetchScenarios,
  runSimulation,
  fetchSimulationStatus,
  type MarketTicker,
  type SimulationStatus,
} from "../lib/api";

import type { FundProfile } from "../data/fundProfiles";
import type { CrowdedLong, DivergentAlpha } from "../data/consensusData";
import type { Agentic13FPosition } from "../data/agentic13f";

// ---------------------------------------------------------------------------
// Market Data Bar
// ---------------------------------------------------------------------------

function MarketDataBar({ tickers }: { tickers: MarketTicker[] }) {
  if (tickers.length === 0) return null;

  return (
    <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] px-5 py-3 mb-6 flex items-center gap-6 overflow-x-auto">
      <span className="text-[10px] text-[#6b7280] uppercase tracking-widest whitespace-nowrap">
        Live Market
      </span>
      {tickers.map((t) => {
        const isUp = t.changePct >= 0;
        return (
          <div key={t.symbol} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[#171c1f] text-xs font-semibold">{t.symbol}</span>
            <span className="text-[#171c1f] text-xs tabular-nums font-medium">
              {t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`text-[11px] tabular-nums font-medium ${
                isUp ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isUp ? "+" : ""}
              {t.changePct.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Simulation Launcher (inline)
// ---------------------------------------------------------------------------

interface ScenarioOption {
  id: string;
  name: string;
  description: string;
}

const DEFAULT_SCENARIOS: ScenarioOption[] = [
  { id: "tariff_escalation", name: "Tariff Escalation", description: "Global 15-25% tariffs ramp" },
  { id: "oil_spike", name: "Oil Spike", description: "Brent >$120 on Hormuz disruption" },
  { id: "cpi_surprise", name: "CPI Surprise", description: "Core PCE prints 3.2%+" },
  { id: "grand_bargain", name: "Grand Bargain", description: "US-China deal + Iran ceasefire" },
  { id: "tech_crash", name: "Tech Crash", description: "Mag 7 drawdown 20%+" },
];

function SimulationLauncher({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [scenarios, setScenarios] = useState<ScenarioOption[]>(DEFAULT_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState(DEFAULT_SCENARIOS[0].id);
  const [customShock, setCustomShock] = useState("");
  const [simStatus, setSimStatus] = useState<SimulationStatus | null>(null);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    fetchScenarios()
      .then((s) => {
        if (s && s.length > 0) {
          // API returns "key" field, normalize to "id"
          setScenarios(s.map((sc: Record<string, string>) => ({
            id: sc.id || sc.key,
            name: sc.name,
            description: (sc.description || "").slice(0, 80),
          })));
        }
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  const handleLaunch = useCallback(async () => {
    setLaunching(true);
    try {
      const status = await runSimulation(selectedScenario, customShock || undefined);
      setSimStatus(status);

      // Poll until complete
      const poll = async () => {
        try {
          const updated = await fetchSimulationStatus(status.id);
          setSimStatus(updated);
          if (updated.status === "running") {
            setTimeout(poll, 2000);
          } else {
            setLaunching(false);
            if (updated.status === "complete") {
              onComplete();
            }
          }
        } catch {
          setLaunching(false);
        }
      };
      setTimeout(poll, 2000);
    } catch {
      setLaunching(false);
    }
  }, [selectedScenario, customShock, onComplete]);

  return (
    <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6 mb-8">
      <h3
        className="text-[#171c1f] text-base font-semibold mb-1 tracking-tight"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        Run New Simulation
      </h3>
      <p className="text-[#6b7280] text-xs mb-4">
        Select a pre-built scenario or describe a custom market shock
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Scenario picker */}
        <div>
          <label className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1.5 block">
            Scenario
          </label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="w-full bg-[#f6fafe] text-[#171c1f] text-sm rounded-md px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} -- {s.description}
              </option>
            ))}
          </select>
        </div>

        {/* Custom shock */}
        <div>
          <label className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1.5 block">
            Custom Shock (optional)
          </label>
          <input
            type="text"
            value={customShock}
            onChange={(e) => setCustomShock(e.target.value)}
            placeholder="e.g. OPEC cuts output 2M bbl/day..."
            className="w-full bg-[#f6fafe] text-[#171c1f] text-sm rounded-md px-3 py-2.5 placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
          />
        </div>
      </div>

      {/* Launch button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLaunch}
          disabled={launching}
          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
            launching
              ? "bg-[#e8ecf0] text-[#6b7280] cursor-not-allowed"
              : "bg-[#001629] text-white hover:bg-[#002B49]"
          }`}
        >
          {launching ? "Agents are analyzing..." : "Launch War Room"}
        </button>

        <Link
          href="/simulate"
          className="text-[#3b82f6] text-sm font-medium hover:underline"
        >
          Open full simulation page
        </Link>
      </div>

      {/* Progress indicators */}
      {simStatus && simStatus.phases && (
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid #f0f4f8" }}>
          <div className="grid grid-cols-5 gap-3">
            {simStatus.phases.map((phase) => (
              <div key={phase.name} className="flex items-center gap-2">
                {phase.status === "complete" ? (
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : phase.status === "running" ? (
                  <svg className="w-4 h-4 text-[#3b82f6] animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[#e8ecf0] flex-shrink-0" />
                )}
                <span className="text-[11px] text-[#42474d] truncate">{phase.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [fundProfiles, setFundProfiles] = useState(staticFundProfiles);
  const [consensusScore, setConsensusScore] = useState(staticConsensus);
  const [crowdedLongs, setCrowdedLongs] = useState<CrowdedLong[]>(staticCrowded);
  const [divergentAlpha, setDivergentAlpha] = useState<DivergentAlpha[]>(staticDivergent);
  const [positions, setPositions] = useState<Agentic13FPosition[]>(staticPositions);
  const [marketData, setMarketData] = useState<MarketTicker[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data from API (fall back to static)
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [fundsRes, consensusRes, agentic13fRes, marketRes] = await Promise.allSettled([
        fetchFunds(),
        fetchConsensus(),
        fetchAgentic13F(),
        fetchMarketData(),
      ]);

      // Fund profiles are static metadata — only merge fidelity scores from API
      if (fundsRes.status === "fulfilled" && Array.isArray(fundsRes.value)) {
        const apiScores = new Map(
          (fundsRes.value as {fund_key: string; fidelity_score: number}[])
            .map(f => [f.fund_key, f.fidelity_score])
        );
        setFundProfiles(prev => prev.map(f => ({
          ...f,
          fidelityScore: apiScores.get(f.id) ?? f.fidelityScore,
        })));
      }
      if (consensusRes.status === "fulfilled") {
        const c = consensusRes.value as Record<string, unknown>;
        if (c.score) setConsensusScore(c.score as typeof staticConsensus);
        if (c.crowdedLongs) setCrowdedLongs(c.crowdedLongs as CrowdedLong[]);
        if (c.divergentAlpha) setDivergentAlpha(c.divergentAlpha as DivergentAlpha[]);
      }
      if (agentic13fRes.status === "fulfilled") {
        const a = agentic13fRes.value as Record<string, unknown>;
        if (a.positions) setPositions(a.positions as Agentic13FPosition[]);
      }
      if (marketRes.status === "fulfilled") {
        setMarketData(marketRes.value as MarketTicker[]);
      }
    } catch {
      // Keep static fallback data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auto-refresh market data every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketData()
        .then(setMarketData)
        .catch(() => {});
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Market Data Bar */}
      <MarketDataBar tickers={marketData} />

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#171c1f] tracking-tight"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Dashboard Overview
          </h1>
          <p className="text-[#42474d] text-sm mt-1">
            Global Tariff Escalation Scenario -- March 31, 2026
          </p>
        </div>
        <div className="flex items-center gap-4">
          {loading && (
            <div className="flex items-center gap-2 px-3 py-2">
              <svg className="w-4 h-4 text-[#3b82f6] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-[#6b7280] text-xs">Syncing...</span>
            </div>
          )}
          <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] px-4 py-2.5 flex items-center gap-3">
            <span className="text-[#6b7280] text-xs">Consensus Score</span>
            <span
              className="text-xl font-bold tabular-nums text-[#f59e0b]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {consensusScore.overall}
            </span>
            <span className="text-[#6b7280] text-xs">/ 100</span>
          </div>
          <div className="bg-[#001629] rounded-md px-4 py-2.5">
            <span className="text-white text-xs font-medium">
              5 Fund Agents Active
            </span>
          </div>
        </div>
      </div>

      {/* Simulation Launcher */}
      <SimulationLauncher onComplete={refreshData} />

      {/* Fund Cards Row */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {fundProfiles.map((fund) => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </div>

      {/* Radar Chart + Consensus Score Breakdown */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <RadarChart />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
            <h3
              className="text-[#171c1f] text-base font-semibold mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Consensus Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(consensusScore.breakdown).map(([key, value]) => {
                const labels: Record<string, string> = {
                  directionalAgreement: "Directional Agreement",
                  instrumentSelection: "Instrument Selection",
                  leverageRiskAppetite: "Leverage & Risk",
                  timeHorizon: "Time Horizon",
                  netExposure: "Net Exposure",
                };
                return (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#42474d] text-xs">{labels[key]}</span>
                      <span className="text-[#171c1f] text-xs font-medium tabular-nums">
                        {value}/100
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#f0f4f8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${value}%`,
                          backgroundColor:
                            value >= 70 ? "#10b981" : value >= 40 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
            <h3
              className="text-[#171c1f] text-base font-semibold mb-3 tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Net Exposure Spectrum
            </h3>
            <div className="space-y-2.5">
              {[...fundProfiles]
                .sort((a, b) => a.netExposureNum - b.netExposureNum)
                .map((fund) => {
                  const pct = ((fund.netExposureNum + 0.25) / 1.4) * 100;
                  return (
                    <div key={fund.id} className="flex items-center gap-2">
                      <span className="text-[#42474d] text-[11px] w-20 truncate">
                        {fund.shortName}
                      </span>
                      <div className="flex-1 h-2 bg-[#f0f4f8] rounded-full relative overflow-hidden">
                        <div
                          className="absolute top-0 h-full rounded-full"
                          style={{
                            left: `${Math.min(Math.max(pct, 2), 98)}%`,
                            width: 8,
                            backgroundColor: fund.color,
                          }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-medium tabular-nums w-12 text-right ${
                          fund.netExposureNum >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {fund.netExposure}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Crowded Longs + Divergent Alpha */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Crowded Longs */}
        <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3
              className="text-[#171c1f] text-base font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Crowded Longs
            </h3>
            <span className="text-[#6b7280] text-xs">(3+ Funds Agree)</span>
          </div>
          <div className="space-y-3">
            {crowdedLongs
              .filter((c) => c.fundsAgreeing.length >= 3)
              .map((item) => (
                <div key={item.asset} className="bg-[#f6fafe] rounded-md p-3">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-[#171c1f] text-sm font-semibold">
                        {item.asset}
                      </span>
                      <span className={`ml-2 text-xs font-medium ${item.direction === "LONG" ? "text-emerald-600" : "text-red-600"}`}>
                        {item.direction}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {item.signalStrength}
                    </span>
                  </div>
                  <p className="text-[#6b7280] text-[11px] mb-1.5">{item.tickers}</p>
                  <div className="flex gap-1 flex-wrap">
                    {item.fundsAgreeing.map((f) => (
                      <span
                        key={f}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-[#f0f4f8] text-[#42474d]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Divergent Alpha */}
        <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <h3
              className="text-[#171c1f] text-base font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Divergent Alpha
            </h3>
            <span className="text-[#6b7280] text-xs">(Unique Signals)</span>
          </div>
          <div className="space-y-3 max-h-[380px] overflow-y-auto">
            {divergentAlpha.slice(0, 8).map((item) => (
              <div key={item.asset} className="bg-[#f6fafe] rounded-md p-3">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[#171c1f] text-sm font-semibold">
                    {item.asset}
                  </span>
                  <ConvictionBadge level={item.conviction} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-purple-600 font-medium">
                    {item.fund}
                  </span>
                  <span className="text-[11px] text-[#6b7280]">{item.direction}</span>
                </div>
                <p className="text-[#6b7280] text-[11px] leading-relaxed">
                  {item.whyUnique}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agentic 13F Projected Positions Table */}
      <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
        <h3
          className="text-[#171c1f] text-base font-semibold mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Agentic 13F -- Projected Combined Portfolio
        </h3>
        <p className="text-[#6b7280] text-xs mb-4">
          Conviction-weighted directionality across all 5 fund agents
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f0f4f8]">
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                  Asset / Theme
                </th>
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                  Direction
                </th>
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-center">
                  # Funds
                </th>
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-center">
                  Weighted Conv.
                </th>
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                  Notes
                </th>
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] text-center">
                  Signal
                </th>
              </tr>
            </thead>
            <tbody>
              {positions.slice(0, 12).map((pos, i) => {
                const dirColor = pos.netDirection.includes("SHORT") || pos.netDirection === "REDUCE"
                  ? "text-red-600"
                  : pos.netDirection === "CONTESTED"
                  ? "text-amber-600"
                  : "text-emerald-600";

                return (
                  <tr
                    key={pos.asset + i}
                    className="transition-colors hover:bg-[#f6fafe]"
                    style={{ borderBottom: "1px solid #f0f4f8" }}
                  >
                    <td className="px-3 py-2.5">
                      <span className="text-[#171c1f] text-sm font-medium">
                        {pos.asset}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-medium ${dirColor}`}>
                        {pos.netDirection}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-[#171c1f] text-sm tabular-nums font-medium">
                        {pos.numFunds}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-[#42474d] text-xs tabular-nums">
                        {pos.weightedConviction > 0 ? pos.weightedConviction : "--"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[#42474d] text-xs max-w-[300px]">
                      {pos.notes}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {pos.isCrowded && (
                        <span className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          CROWDED
                        </span>
                      )}
                      {pos.isDivergent && (
                        <span className="text-[9px] font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          UNIQUE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
