const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------------------------------------------------------------------------
// Types for API responses
// ---------------------------------------------------------------------------

export interface MarketTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

export interface SimulationStatus {
  id: string;
  scenario: string;
  status: "running" | "complete" | "error";
  phase: string;
  phases: { name: string; status: "pending" | "running" | "complete" | "error" }[];
  result?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

/** Fetch all fund profiles. */
export async function fetchFunds() {
  return apiFetch<Record<string, unknown>[]>("/api/funds");
}

/** Fetch a single fund by key (e.g. "renaissance"). */
export async function fetchFund(fundKey: string) {
  return apiFetch<Record<string, unknown>>(`/api/funds/${fundKey}`);
}

/** Fetch available scenario definitions. */
export async function fetchScenarios() {
  return apiFetch<{ id: string; name: string; description: string }[]>("/api/scenarios");
}

/** Trigger a new simulation run. Returns a simulation ID for polling. */
export async function runSimulation(scenario: string, customShock?: string) {
  return apiFetch<SimulationStatus>("/api/simulate", {
    method: "POST",
    body: JSON.stringify({ scenario, custom_shock: customShock }),
  });
}

/** Poll simulation status by ID. */
export async function fetchSimulationStatus(id: string) {
  return apiFetch<SimulationStatus>(`/api/simulate/${id}`);
}

/** Fetch live market data (S&P 500, NASDAQ, VIX, Gold, Oil). */
export async function fetchMarketData() {
  return apiFetch<MarketTicker[]>("/api/market");
}

/** Fetch agentic 13F combined positions + sector shifts. */
export async function fetchAgentic13F() {
  return apiFetch<Record<string, unknown>>("/api/agentic-13f");
}

/** Fetch the latest war room debate transcript. */
export async function fetchLatestWarRoom() {
  return apiFetch<Record<string, unknown>>("/api/war-room");
}

/** Fetch consensus data (score, crowded longs, divergent alpha). */
export async function fetchConsensus() {
  return apiFetch<Record<string, unknown>>("/api/consensus");
}
