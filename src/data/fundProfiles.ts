// Fund profile data for radar charts and fund cards
// Axes: Leverage, Growth Tilt, Concentration, Turnover, Risk Tolerance, Market Beta
// All values normalized to 0-100 scale

export interface FundProfile {
  id: string;
  name: string;
  shortName: string;
  archetype: string;
  color: string;
  fidelityScore: number;
  netExposure: string;
  netExposureNum: number;
  grossLeverage: string;
  aum: string;
  totalPositions: number | string;
  projectedReturn: { bull: string; base: string; bear: string };
  radarData: {
    leverage: number;
    growthTilt: number;
    concentration: number;
    turnover: number;
    riskTolerance: number;
    marketBeta: number;
  };
  strategySummary: string;
  keyThemes: string[];
}

export const FUND_COLORS: Record<string, string> = {
  renaissance: "#6366f1",    // indigo
  bridgewater: "#f59e0b",    // amber
  millennium: "#10b981",     // emerald / mint green
  pershing: "#ef4444",       // red
  tiger: "#3b82f6",          // blue
};

export const fundProfiles: FundProfile[] = [
  {
    id: "renaissance",
    name: "Renaissance Technologies",
    shortName: "RenTech",
    archetype: "The Quant",
    color: FUND_COLORS.renaissance,
    fidelityScore: 82,
    netExposure: "-0.05",
    netExposureNum: -0.05,
    grossLeverage: "15.8x",
    aum: "$10B (Medallion)",
    totalPositions: 3185,
    projectedReturn: { bull: "+4.8%", base: "+2.9%", bear: "-1.2%" },
    radarData: {
      leverage: 95,       // 15.8x -- highest
      growthTilt: 30,     // factor-agnostic
      concentration: 10,  // 3,185 positions -- extremely diversified
      turnover: 95,       // stat arb, very high turnover
      riskTolerance: 85,  // increasing leverage into novel regime
      marketBeta: 5,      // near-zero net exposure
    },
    strategySummary:
      "Statistical arbitrage across 3,185+ positions with extreme leverage. Exploiting elevated cross-sectional dispersion via mean-reversion, momentum decay, and factor-relative-value signals.",
    keyThemes: [
      "Long energy (CVX, XOM)",
      "Short NKE / consumer discretionary",
      "Long gold miners (KGC, FNV)",
      "Long defense (LMT, RTX)",
      "Short VIX Nov / Long SPX Jul puts",
    ],
  },
  {
    id: "bridgewater",
    name: "Bridgewater Associates",
    shortName: "Bridgewater",
    archetype: "The Macro Systematist",
    color: FUND_COLORS.bridgewater,
    fidelityScore: 88,
    netExposure: "-0.20",
    netExposureNum: -0.20,
    grossLeverage: "3.0x PA / 1.5x AW",
    aum: "$92B total",
    totalPositions: 1040,
    projectedReturn: { bull: "-2.5%", base: "+3.2%", bear: "+7.5%" },
    radarData: {
      leverage: 45,       // moderate (Pure Alpha 3x, AW 1.5x)
      growthTilt: 15,     // anti-growth (stagflation positioning)
      concentration: 25,  // 35-40 macro positions, diversified
      turnover: 40,       // systematic rebalancing, moderate
      riskTolerance: 60,  // reducing AW leverage as precaution
      marketBeta: 15,     // net short equities
    },
    strategySummary:
      "Systematic macro positioning for the stagflation quadrant. Increasing allocation to inflation-linked assets, gold, and energy while reducing broad equity beta.",
    keyThemes: [
      "Long TIPS (5-10Y)",
      "Long gold / gold miners (NEM)",
      "Long Brent crude",
      "Short DXY vs commodity currencies",
      "Reducing SPY/IVV 25-30%",
      "Buy VIX calls (Jun/Jul)",
    ],
  },
  {
    id: "millennium",
    name: "Millennium Management",
    shortName: "Millennium",
    archetype: "The Pod Shop",
    color: FUND_COLORS.millennium,
    fidelityScore: 91,
    netExposure: "+0.07",
    netExposureNum: 0.07,
    grossLeverage: "3.5x",
    aum: "$83.4B",
    totalPositions: "5,978",
    projectedReturn: { bull: "+0.8%", base: "+1.5%", bear: "+0.9%" },
    radarData: {
      leverage: 50,       // 3.5x moderate
      growthTilt: 40,     // sector neutral, slight domestic tilt
      concentration: 15,  // 6,000 positions, ultra-diversified
      turnover: 80,       // pairs rotation, high turnover
      riskTolerance: 25,  // 5% hard drawdown limit, ultra-disciplined
      marketBeta: 10,     // near-zero net via pairs
    },
    strategySummary:
      "Pure relative value via sector-neutral pairs trades exploiting tariff-driven dispersion. Strict 5% drawdown limit is sacrosanct. Every position is hedged; net exposure sub-10%.",
    keyThemes: [
      "EOG/NKE -- Energy vs Consumer",
      "NVDA/INTC -- AI vs Legacy Semi",
      "GM/VWAGY -- Domestic vs EU Auto",
      "LMT/BA -- Defense vs Commercial Aero",
      "IWM/EFA -- Domestic vs International",
      "GDX/TLT -- Gold vs Treasuries",
    ],
  },
  {
    id: "pershing",
    name: "Pershing Square Capital",
    shortName: "Pershing Sq",
    archetype: "The Activist",
    color: FUND_COLORS.pershing,
    fidelityScore: 93,
    netExposure: "+0.85",
    netExposureNum: 0.85,
    grossLeverage: "1.3x",
    aum: "$18.4B",
    totalPositions: 11,
    projectedReturn: { bull: "+6.5%", base: "+2.8%", bear: "-4.0%" },
    radarData: {
      leverage: 15,       // 1.3x, very low
      growthTilt: 75,     // concentrated in tech platforms
      concentration: 95,  // 11 positions, extremely concentrated
      turnover: 15,       // buy and hold compounder
      riskTolerance: 70,  // high conviction, asymmetric hedging
      marketBeta: 75,     // +0.85 net long
    },
    strategySummary:
      "Concentrated portfolio of 11 high-quality businesses with asymmetric CDX hedges. Core thesis: tariff regime is temporary, platform businesses are mispriced, CDX provides 30-50x convexity in the tail.",
    keyThemes: [
      "Brookfield (BN) 18.15%",
      "Uber (UBER) 15.90%",
      "Amazon (AMZN) 14.28%",
      "CDX IG/HY protection -- 30-50x convexity",
      "Trim QSR to fund hedges",
    ],
  },
  {
    id: "tiger",
    name: "Tiger Global Management",
    shortName: "Tiger Global",
    archetype: "The Growth Crossover",
    color: FUND_COLORS.tiger,
    fidelityScore: 79,
    netExposure: "+1.15",
    netExposureNum: 1.15,
    grossLeverage: "1.5x",
    aum: "$69.6B total",
    totalPositions: 54,
    projectedReturn: { bull: "+8.5%", base: "+3.2%", bear: "-6.5%" },
    radarData: {
      leverage: 20,       // 1.5x, low
      growthTilt: 95,     // pure growth, Mag 7 heavy
      concentration: 65,  // 54 positions, moderate concentration
      turnover: 45,       // selective, moderate
      riskTolerance: 80,  // highest net long, willing to ride drawdowns
      marketBeta: 95,     // +1.15 net long, highest
    },
    strategySummary:
      "Concentrated growth portfolio with ~40% Mag 7 exposure, drifting toward 35-37%. Adding domestic, tariff-immune growth names (Block, Zillow, Flutter). Core thesis: tariffs are temporary and secular growth is mispriced.",
    keyThemes: [
      "Alphabet (GOOGL) 11.2% anchor",
      "Adding Block (XYZ), Zillow (Z)",
      "NVDA hedged with put spreads",
      "Short consumer discretionary overlay",
      "Tactical gold (GLD) 2%",
    ],
  },
];

export const radarAxes = [
  { key: "leverage", label: "Leverage" },
  { key: "growthTilt", label: "Growth Tilt" },
  { key: "concentration", label: "Concentration" },
  { key: "turnover", label: "Turnover" },
  { key: "riskTolerance", label: "Risk Tolerance" },
  { key: "marketBeta", label: "Market Beta" },
];

// Transform radar data for Recharts
export function getRadarChartData() {
  return radarAxes.map((axis) => {
    const point: Record<string, string | number> = { axis: axis.label };
    fundProfiles.forEach((fund) => {
      point[fund.id] =
        fund.radarData[axis.key as keyof typeof fund.radarData];
    });
    return point;
  });
}
