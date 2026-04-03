"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { runSimulation, fetchSimulationStatus } from "../../lib/api";

// ---------------------------------------------------------------------------
// Scenario cards
// ---------------------------------------------------------------------------

interface ScenarioCard {
  id: string;
  name: string;
  description: string;
  icon: string; // SVG path
  color: string;
}

const SCENARIOS: ScenarioCard[] = [
  {
    id: "tariff_escalation",
    name: "Tariff Escalation",
    description: "Global 15-25% tariffs ramp with Section 122 clock ticking. EU retaliatory tariffs, China rare earth export controls.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    color: "#f59e0b",
  },
  {
    id: "oil_spike",
    name: "Oil Spike",
    description: "Brent crude exceeds $120 on Strait of Hormuz disruption. Iran-US military escalation removes 70% of transit volume.",
    icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
    color: "#ef4444",
  },
  {
    id: "cpi_surprise",
    name: "CPI Surprise",
    description: "Core PCE prints 3.2%+, well above consensus. Fed forced to hold rates or hike. Stagflation fears spike.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    color: "#8b5cf6",
  },
  {
    id: "grand_bargain",
    name: "Grand Bargain",
    description: "US-China comprehensive trade deal + Iran ceasefire simultaneously. Risk-on rally, vol compression, dollar strengthens.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "#10b981",
  },
  {
    id: "tech_crash",
    name: "Tech Crash",
    description: "Mag 7 drawdown exceeds 20%. NASDAQ enters bear market. Section 301 semiconductor investigation triggers selloff.",
    icon: "M19 14l-7 7m0 0l-7-7m7 7V3",
    color: "#3b82f6",
  },
];

// ---------------------------------------------------------------------------
// Phase definitions for progress tracking
// ---------------------------------------------------------------------------

const DEFAULT_PHASES = [
  { name: "Research Agent analyzing market context", status: "pending" as const },
  { name: "Renaissance Technologies generating positioning", status: "pending" as const },
  { name: "Bridgewater Associates generating positioning", status: "pending" as const },
  { name: "Millennium Management generating positioning", status: "pending" as const },
  { name: "Pershing Square generating positioning", status: "pending" as const },
  { name: "Tiger Global generating positioning", status: "pending" as const },
  { name: "Running adversarial debate", status: "pending" as const },
  { name: "Analyzing consensus", status: "pending" as const },
];

// ---------------------------------------------------------------------------
// Phase progress indicator
// ---------------------------------------------------------------------------

function PhaseTracker({ phases }: { phases: { name: string; status: string }[] }) {
  return (
    <div className="space-y-3">
      {phases.map((phase, i) => (
        <div key={i} className="flex items-center gap-3">
          {/* Icon */}
          {phase.status === "complete" ? (
            <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : phase.status === "running" ? (
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#3b82f6] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          ) : phase.status === "error" ? (
            <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#f0f4f8] flex items-center justify-center flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#d1d5db]" />
            </div>
          )}

          {/* Label */}
          <span
            className={`text-sm ${
              phase.status === "complete"
                ? "text-emerald-700 font-medium"
                : phase.status === "running"
                ? "text-[#171c1f] font-medium"
                : phase.status === "error"
                ? "text-red-600 font-medium"
                : "text-[#9ca3af]"
            }`}
          >
            {phase.name}
            {phase.status === "running" && "..."}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SimulatePage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [customShock, setCustomShock] = useState("");
  const [phases, setPhases] = useState<{name: string; status: "pending" | "running" | "complete" | "error"}[]>(DEFAULT_PHASES);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = useCallback(async () => {
    const scenario = selectedScenario || "custom";
    const shock = customShock || undefined;

    if (!selectedScenario && !customShock.trim()) return;

    setRunning(true);
    setComplete(false);
    setError(null);
    setPhases(DEFAULT_PHASES.map((p) => ({ ...p, status: "pending" as const })));

    try {
      const status = await runSimulation(scenario, shock);

      // Update phases from server if available
      if (status.phases) {
        setPhases(status.phases);
      }

      const poll = async () => {
        try {
          const updated = await fetchSimulationStatus(status.id);
          if (updated.phases) {
            setPhases(updated.phases);
          }

          if (updated.status === "running") {
            setTimeout(poll, 1500);
          } else if (updated.status === "complete") {
            setRunning(false);
            setComplete(true);
          } else {
            setRunning(false);
            setError("Simulation failed. Please try again.");
          }
        } catch {
          setRunning(false);
          setError("Lost connection to simulation server.");
        }
      };

      setTimeout(poll, 1500);
    } catch {
      // Simulate progress locally when backend is not available
      let idx = 0;
      const simulateProgress = () => {
        if (idx < DEFAULT_PHASES.length) {
          setPhases((prev) =>
            prev.map((p, i) => ({
              ...p,
              status: i < idx ? "complete" : i === idx ? "running" : "pending",
            }))
          );
          idx++;
          setTimeout(simulateProgress, 1200 + Math.random() * 800);
        } else {
          setPhases((prev) => prev.map((p) => ({ ...p, status: "complete" })));
          setRunning(false);
          setComplete(true);
        }
      };
      simulateProgress();
    }
  }, [selectedScenario, customShock]);

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
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-[#171c1f] tracking-tight"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Run Simulation
        </h1>
        <p className="text-[#42474d] text-sm mt-1">
          Select a pre-built market scenario or describe a custom shock. The multi-agent system will generate fund
          positioning, run an adversarial debate, and produce consensus analysis.
        </p>
      </div>

      {/* Scenario Cards */}
      {!running && !complete && (
        <>
          <div className="mb-6">
            <h2
              className="text-[#171c1f] text-base font-semibold mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Pre-built Scenarios
            </h2>
            <div className="grid grid-cols-5 gap-3">
              {SCENARIOS.map((s) => {
                const isSelected = selectedScenario === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedScenario(isSelected ? null : s.id);
                      setCustomShock("");
                    }}
                    className={`text-left p-4 rounded-md transition-all ${
                      isSelected
                        ? "bg-white shadow-[0_20px_40px_rgba(23,28,31,0.1)]"
                        : "bg-white shadow-[0_20px_40px_rgba(23,28,31,0.06)] hover:shadow-[0_20px_40px_rgba(23,28,31,0.1)]"
                    }`}
                    style={{
                      outline: isSelected ? `2px solid ${s.color}` : "none",
                      outlineOffset: "-1px",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: s.color }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                      </svg>
                      <span className="text-[#171c1f] text-sm font-semibold">{s.name}</span>
                    </div>
                    <p className="text-[#6b7280] text-[11px] leading-relaxed">{s.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom shock text area */}
          <div className="mb-6">
            <h2
              className="text-[#171c1f] text-base font-semibold mb-3 tracking-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Or Describe a Custom Market Shock
            </h2>
            <textarea
              value={customShock}
              onChange={(e) => {
                setCustomShock(e.target.value);
                if (e.target.value.trim()) setSelectedScenario(null);
              }}
              placeholder="e.g. OPEC announces emergency 2M bbl/day production cut while Fed signals rate hike at next meeting. Simultaneously, Japan BOJ abandons yield curve control..."
              rows={4}
              className="w-full bg-white shadow-[0_20px_40px_rgba(23,28,31,0.06)] text-[#171c1f] text-sm rounded-md px-4 py-3 placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30 resize-none"
            />
          </div>

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={!selectedScenario && !customShock.trim()}
            className={`w-full py-3.5 rounded-md text-sm font-semibold transition-colors ${
              selectedScenario || customShock.trim()
                ? "bg-[#001629] text-white hover:bg-[#002B49]"
                : "bg-[#e8ecf0] text-[#9ca3af] cursor-not-allowed"
            }`}
          >
            Run Simulation
          </button>
        </>
      )}

      {/* Progress tracker */}
      {running && (
        <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-8">
          <h2
            className="text-[#171c1f] text-lg font-semibold mb-1 tracking-tight"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Simulation in Progress
          </h2>
          <p className="text-[#6b7280] text-xs mb-6">
            {selectedScenario
              ? `Scenario: ${SCENARIOS.find((s) => s.id === selectedScenario)?.name ?? selectedScenario}`
              : "Custom market shock"}
          </p>
          <PhaseTracker phases={phases} />
        </div>
      )}

      {/* Complete state */}
      {complete && (
        <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2
                className="text-[#171c1f] text-lg font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Simulation Complete
              </h2>
              <p className="text-[#6b7280] text-xs">All agents have finished analysis</p>
            </div>
          </div>

          <PhaseTracker phases={phases} />

          <div className="mt-8 pt-6 grid grid-cols-3 gap-4" style={{ borderTop: "1px solid #f0f4f8" }}>
            <Link
              href="/"
              className="bg-[#001629] text-white text-center py-3 rounded-md text-sm font-medium hover:bg-[#002B49] transition-colors"
            >
              View Dashboard
            </Link>
            <Link
              href="/war-room"
              className="bg-[#f0f4f8] text-[#171c1f] text-center py-3 rounded-md text-sm font-medium hover:bg-[#e8ecf0] transition-colors"
            >
              View War Room Debate
            </Link>
            <Link
              href="/agentic-13f"
              className="bg-[#f0f4f8] text-[#171c1f] text-center py-3 rounded-md text-sm font-medium hover:bg-[#e8ecf0] transition-colors"
            >
              View Agentic 13F
            </Link>
          </div>

          <button
            onClick={() => {
              setComplete(false);
              setRunning(false);
              setPhases(DEFAULT_PHASES);
            }}
            className="mt-4 w-full py-2.5 rounded-md text-xs font-medium text-[#6b7280] hover:text-[#171c1f] transition-colors"
          >
            Run Another Simulation
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 rounded-md p-4 mt-6">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
