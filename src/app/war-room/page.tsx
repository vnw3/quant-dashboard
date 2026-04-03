"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { round1 as staticRound1, round2 as staticRound2, type DebateEntry } from "../../data/warRoomData";
import { fetchLatestWarRoom, fetchScenarios, runSimulation, fetchSimulationStatus } from "../../lib/api";

// ---------------------------------------------------------------------------

function DebateCard({ entry }: { entry: DebateEntry }) {
  const typeLabels: Record<string, string> = {
    statement: "STATEMENT",
    challenge: "CROSS-EXAMINATION",
    rebuttal: "REBUTTAL",
    concession: "CONCESSION",
  };

  const typeBg: Record<string, string> = {
    statement: "bg-slate-50 text-slate-600",
    challenge: "bg-red-50 text-red-700",
    rebuttal: "bg-blue-50 text-blue-700",
    concession: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-5 mb-4">
      <div className="flex items-start gap-4">
        {/* Fund indicator */}
        <div className="flex flex-col items-center gap-1 pt-0.5 min-w-[80px]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
            style={{ backgroundColor: entry.color }}
          >
            {entry.fund.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
          <span className="text-[10px] text-[#42474d] font-medium text-center leading-tight">
            {entry.fund}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[9px] font-medium uppercase px-1.5 py-0.5 rounded ${typeBg[entry.type]}`}>
              {typeLabels[entry.type]}
            </span>
            {entry.target && (
              <span className="text-[11px] text-[#6b7280]">
                <svg className="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                targeting <span className="font-medium text-[#42474d]">{entry.target}</span>
              </span>
            )}
          </div>
          <p className="text-[#42474d] text-sm leading-relaxed">
            {entry.content}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fund "thinking" skeleton
// ---------------------------------------------------------------------------

const FUND_AVATARS = [
  { name: "Renaissance", color: "#6366f1" },
  { name: "Bridgewater", color: "#f59e0b" },
  { name: "Millennium", color: "#10b981" },
  { name: "Pershing Sq", color: "#ef4444" },
  { name: "Tiger Global", color: "#3b82f6" },
];

function ThinkingState() {
  return (
    <div className="flex flex-col items-center py-16 gap-6">
      <p
        className="text-[#171c1f] text-lg font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        Agents are debating...
      </p>
      <div className="flex items-center gap-6">
        {FUND_AVATARS.map((f) => (
          <div key={f.name} className="flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse"
              style={{ backgroundColor: f.color }}
            >
              {f.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <span className="text-[10px] text-[#6b7280]">{f.name}</span>
          </div>
        ))}
      </div>
      <svg className="w-6 h-6 text-[#3b82f6] animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WarRoomPage() {
  const [round1, setRound1] = useState<DebateEntry[]>(staticRound1);
  const [round2, setRound2] = useState<DebateEntry[]>(staticRound2);
  const [loading, setLoading] = useState(true);
  const [rerunning, setRerunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("tariff_escalation");
  const [scenarios, setScenarios] = useState<{ id: string; name: string; description: string }[]>([]);

  // Load debate data from API, fall back to static
  const loadDebate = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLatestWarRoom();
      if (data.round1) setRound1(data.round1 as DebateEntry[]);
      if (data.round2) setRound2(data.round2 as DebateEntry[]);
    } catch {
      // Keep static fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDebate();
    fetchScenarios()
      .then((s) => {
        if (s && s.length > 0) setScenarios(s);
      })
      .catch(() => {});
  }, [loadDebate]);

  // Re-run debate with a different scenario
  const handleRerun = useCallback(async () => {
    setRerunning(true);
    try {
      const status = await runSimulation(selectedScenario);

      const poll = async () => {
        try {
          const updated = await fetchSimulationStatus(status.id);
          if (updated.status === "running") {
            setTimeout(poll, 2000);
          } else {
            setRerunning(false);
            if (updated.status === "complete") {
              loadDebate();
            }
          }
        } catch {
          setRerunning(false);
        }
      };
      setTimeout(poll, 2000);
    } catch {
      setRerunning(false);
    }
  }, [selectedScenario, loadDebate]);

  return (
    <div className="p-8 max-w-[1000px] mx-auto">
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
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#171c1f] tracking-tight"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            War Room Debate
          </h1>
          <p className="text-[#42474d] text-sm mt-1">
            Cross-examination and rebuttals between the five fund agents. March 31, 2026.
          </p>
        </div>

        {/* Re-run controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {scenarios.length > 0 && (
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="bg-[#f6fafe] text-[#171c1f] text-xs rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleRerun}
            disabled={rerunning}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
              rerunning
                ? "bg-[#e8ecf0] text-[#6b7280] cursor-not-allowed"
                : "bg-[#001629] text-white hover:bg-[#002B49]"
            }`}
          >
            {rerunning ? "Generating..." : "Re-run Debate"}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-4 mb-6">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-[10px] text-[#6b7280] uppercase tracking-wider">Participants:</span>
          {FUND_AVATARS.map((f) => (
            <div key={f.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
              <span className="text-xs text-[#42474d]">{f.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content or Thinking state */}
      {rerunning ? (
        <ThinkingState />
      ) : loading ? (
        <div className="flex justify-center py-16">
          <svg className="w-6 h-6 text-[#3b82f6] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      ) : (
        <>
          {/* Round 1: Cross-Examination */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#001629] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                Round 1
              </div>
              <span className="text-[#42474d] text-sm font-medium">Cross-Examination</span>
            </div>
            {round1.map((entry, i) => (
              <DebateCard key={`r1-${i}`} entry={entry} />
            ))}
          </div>

          {/* Round 2: Rebuttals & Concessions */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#002B49] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                Round 2
              </div>
              <span className="text-[#42474d] text-sm font-medium">Rebuttals & Concessions</span>
            </div>
            {round2.map((entry, i) => (
              <DebateCard key={`r2-${i}`} entry={entry} />
            ))}
          </div>

          {/* Outcome Summary */}
          <div className="bg-[#f0f4f8] rounded-md p-6">
            <h3
              className="text-[#171c1f] text-base font-semibold mb-3 tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Debate Outcomes
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-md p-4">
                <p className="text-[10px] text-[#6b7280] uppercase mb-2">Concessions Made</p>
                <p className="text-sm text-[#42474d]">
                  <span className="font-semibold text-[#6366f1]">Renaissance</span> reduced target gross leverage from 15.8x to 15.5x after Pershing challenged regime novelty.
                </p>
              </div>
              <div className="bg-white rounded-md p-4">
                <p className="text-[10px] text-[#6b7280] uppercase mb-2">New Positions Added</p>
                <p className="text-sm text-[#42474d]">
                  <span className="font-semibold text-[#10b981]">Millennium</span> added Long TLT / Short HYG pairs trade based on Pershing&apos;s credit tail risk thesis.
                </p>
              </div>
              <div className="bg-white rounded-md p-4">
                <p className="text-[10px] text-[#6b7280] uppercase mb-2">Unresolved Disputes</p>
                <p className="text-sm text-[#42474d]">
                  <span className="font-semibold text-[#f59e0b]">Bridgewater</span> vs <span className="font-semibold text-[#6366f1]">Renaissance</span> on post-July volatility direction remains unresolved.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
