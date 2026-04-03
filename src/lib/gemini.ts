/**
 * Client-side Gemini API integration.
 * Calls the Gemini REST API directly from the browser — no backend needed.
 * API key is stored in localStorage and never leaves the browser.
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const API_KEY_STORAGE_KEY = "gemini_api_key";

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function setApiKey(key: string) {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

export async function generateContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("No API key configured");

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      err?.error?.message || `Gemini API error ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ---------------------------------------------------------------------------
// Fund agent persona prompts
// ---------------------------------------------------------------------------

const FUND_PERSONAS: Record<
  string,
  { name: string; systemPrompt: string }
> = {
  renaissance: {
    name: "Renaissance Technologies",
    systemPrompt: `You are a senior portfolio manager at Renaissance Technologies' Medallion Fund. You think in terms of statistical arbitrage, factor exposures, and mean-reversion signals. You run 15-16x gross leverage with near-zero net exposure. You never take directional macro bets — everything is hedged. Your edge comes from short-term patterns in price, volume, and alternative data. You speak in precise, quantitative language and cite specific metrics. You are skeptical of narrative-driven investing.`,
  },
  bridgewater: {
    name: "Bridgewater Associates",
    systemPrompt: `You are a senior investment strategist at Bridgewater Associates. You think through Ray Dalio's "economic machine" framework — analyzing the interplay of credit cycles, debt dynamics, and the four economic environments (rising/falling growth × rising/falling inflation). You manage risk parity portfolios with 1.5-3x leverage. You are deeply macro-focused and think in terms of regime shifts, not individual stocks. You speak in systematic, first-principles language and frequently reference historical parallels.`,
  },
  millennium: {
    name: "Millennium Management",
    systemPrompt: `You are a pod leader at Millennium Management. You think in relative value and pairs trades — always hedged, always market-neutral. Your hard risk limit is a 5% drawdown before the pod is cut. You run 3-4x gross leverage but sub-10% net exposure. You look for sector-neutral alpha through long/short pairs within the same industry. You never take directional macro risk. You speak in terms of spread compression, catalyst timing, and position-level risk/reward.`,
  },
  pershing: {
    name: "Pershing Square Capital Management",
    systemPrompt: `You are Bill Ackman, founder of Pershing Square Capital Management. You run a concentrated portfolio of 8-12 high-conviction positions. You think like an activist — you understand the business deeply and are willing to push for change. You are known for asymmetric hedges (like your famous CDS trades in 2020). You speak in confident, first-person language with strong conviction. You prefer companies with durable competitive advantages and are willing to hold through volatility.`,
  },
  tiger: {
    name: "Tiger Global Management",
    systemPrompt: `You are a portfolio manager at Tiger Global Management. You are a growth-focused investor who believes in secular technology trends. You run concentrated positions in the "Magnificent 7" and high-growth tech names. You typically run 120-150% net long with 1.5-1.8x gross leverage. You think in terms of TAM expansion, margin improvement, and free cash flow compounding. You are willing to endure significant drawdowns for long-term compounding. You've been reducing concentration from 40% Mag 7 toward 35%.`,
  },
};

// ---------------------------------------------------------------------------
// Simulation runner
// ---------------------------------------------------------------------------

export interface SimPhase {
  name: string;
  status: "pending" | "running" | "complete" | "error";
}

export interface SimulationResult {
  marketContext: string;
  memos: Record<string, string>;
  debate: string;
  consensus: string;
}

/**
 * Run a full War Room simulation using Gemini directly from the browser.
 * Calls onPhaseUpdate after each step so the UI can show progress.
 */
export async function runLiveSimulation(
  scenario: string,
  customShock: string | undefined,
  onPhaseUpdate: (phases: SimPhase[]) => void
): Promise<SimulationResult> {
  const shockDescription = customShock || scenario;

  const phases: SimPhase[] = [
    { name: "Analyzing market context", status: "pending" },
    { name: "Renaissance Technologies", status: "pending" },
    { name: "Bridgewater Associates", status: "pending" },
    { name: "Millennium Management", status: "pending" },
    { name: "Pershing Square", status: "pending" },
    { name: "Tiger Global", status: "pending" },
    { name: "Running adversarial debate", status: "pending" },
    { name: "Synthesizing consensus", status: "pending" },
  ];

  const update = (idx: number, status: SimPhase["status"]) => {
    phases[idx] = { ...phases[idx], status };
    onPhaseUpdate([...phases]);
  };

  const result: SimulationResult = {
    marketContext: "",
    memos: {},
    debate: "",
    consensus: "",
  };

  // Phase 1: Market context
  update(0, "running");
  try {
    result.marketContext = await generateContent(
      "You are a macro research analyst. Provide a concise market briefing.",
      `Analyze the following market shock scenario and provide a 300-word situation summary covering: current market conditions, immediate implications, affected sectors, and key risks.\n\nScenario: ${shockDescription}`
    );
    update(0, "complete");
  } catch (e) {
    update(0, "error");
    throw e;
  }

  // Phases 2-6: Fund memos (run sequentially to respect rate limits)
  const fundKeys = ["renaissance", "bridgewater", "millennium", "pershing", "tiger"];
  for (let i = 0; i < fundKeys.length; i++) {
    const key = fundKeys[i];
    const persona = FUND_PERSONAS[key];
    update(i + 1, "running");
    try {
      result.memos[key] = await generateContent(
        persona.systemPrompt,
        `Given this market scenario, provide your fund's positioning memo in 200-300 words.\n\nMarket Context:\n${result.marketContext}\n\nScenario: ${shockDescription}\n\nInclude:\n1. Your top 5 positions (asset, direction LONG/SHORT, conviction HIGH/MED/LOW)\n2. Key risk you're hedging against\n3. Your expected 30-day return range (bull/base/bear)\n4. One contrarian view you hold that other funds would disagree with`
      );
      update(i + 1, "complete");
    } catch (e) {
      update(i + 1, "error");
      throw e;
    }
  }

  // Phase 7: Debate
  update(6, "running");
  try {
    const memoSummaries = fundKeys
      .map((k) => `**${FUND_PERSONAS[k].name}:**\n${result.memos[k]}`)
      .join("\n\n---\n\n");

    result.debate = await generateContent(
      "You are moderating an adversarial debate between 5 hedge fund managers. Each manager should challenge one other manager's positioning with specific, data-driven critiques. Then each challenged manager responds.",
      `Here are the positioning memos from 5 hedge funds responding to: ${shockDescription}\n\n${memoSummaries}\n\nGenerate a structured debate with:\n1. Round 1: Each fund challenges one other fund (5 challenges)\n2. Round 2: Each challenged fund responds (5 rebuttals)\n\nMake it sharp, specific, and confrontational. Reference specific positions and metrics.`
    );
    update(6, "complete");
  } catch (e) {
    update(6, "error");
    throw e;
  }

  // Phase 8: Consensus
  update(7, "running");
  try {
    result.consensus = await generateContent(
      "You are a meta-analyst synthesizing hedge fund positioning.",
      `Based on these 5 fund memos and their debate, provide a consensus analysis:\n\nMemos:\n${Object.entries(result.memos).map(([k, v]) => `${FUND_PERSONAS[k].name}: ${v}`).join("\n\n")}\n\nDebate:\n${result.debate}\n\nProvide:\n1. Consensus Score (0-100, where 100 = complete agreement)\n2. Crowded Longs: Assets where 3+ funds agree\n3. Divergent Alpha: Unique positions only 1 fund holds\n4. Key disagreements between funds\n5. The single highest-alpha signal from the divergent positions`
    );
    update(7, "complete");
  } catch (e) {
    update(7, "error");
    throw e;
  }

  return result;
}
