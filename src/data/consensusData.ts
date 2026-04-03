// Consensus analysis data extracted from consensus_analysis.md

export interface CrowdedLong {
  asset: string;
  tickers: string;
  fundsAgreeing: string[];
  direction: "LONG" | "SHORT";
  avgConviction: string;
  signalStrength: string;
  description: string;
}

export interface DivergentAlpha {
  asset: string;
  fund: string;
  direction: string;
  conviction: string;
  whyUnique: string;
}

export const consensusScore = {
  overall: 42,
  breakdown: {
    directionalAgreement: 75,
    instrumentSelection: 30,
    leverageRiskAppetite: 20,
    timeHorizon: 25,
    netExposure: 35,
  },
};

export const crowdedLongs: CrowdedLong[] = [
  {
    asset: "Gold / Gold Miners",
    tickers: "XAU, GDX, KGC, FNV, NEM, GLD",
    fundsAgreeing: ["Renaissance", "Bridgewater", "Millennium", "Tiger"],
    direction: "LONG",
    avgConviction: "HIGH (4/4)",
    signalStrength: "VERY STRONG",
    description:
      "4 of 5 funds are long gold or gold miners. $4,550 after -14% drawdown is a buy; de-dollarization structural bid intact.",
  },
  {
    asset: "Short Consumer Disc. / Nike",
    tickers: "NKE",
    fundsAgreeing: ["Renaissance", "Bridgewater", "Millennium", "Tiger"],
    direction: "SHORT",
    avgConviction: "HIGH (4/4)",
    signalStrength: "VERY STRONG",
    description:
      "Vietnam/China manufacturing + tariff + oil shipping cost triple headwind is universal consensus.",
  },
  {
    asset: "Long Energy / Oil Beneficiaries",
    tickers: "CVX, XOM, EOG, LNG",
    fundsAgreeing: ["Renaissance", "Bridgewater", "Millennium"],
    direction: "LONG",
    avgConviction: "HIGH (3/4)",
    signalStrength: "STRONG",
    description:
      "Strait of Hormuz disruption removing 70% of transit volume. Bridgewater and Renaissance both see $100+ floor on Brent.",
  },
  {
    asset: "Long Amazon (AMZN)",
    tickers: "AMZN",
    fundsAgreeing: ["Pershing", "Tiger"],
    direction: "LONG",
    avgConviction: "HIGH (2 funds)",
    signalStrength: "MODERATE",
    description:
      "AWS/AI thesis shared across Pershing and Tiger. 14.28% of Pershing portfolio.",
  },
  {
    asset: "Long Alphabet (GOOGL)",
    tickers: "GOOGL/GOOG",
    fundsAgreeing: ["Pershing", "Tiger"],
    direction: "LONG",
    avgConviction: "HIGH (both)",
    signalStrength: "MODERATE",
    description:
      "Cheapest Mag 7 name. Minimal tariff exposure, AI/Cloud optionality, 18-20x forward.",
  },
  {
    asset: "Short Dollar (DXY)",
    tickers: "DXY",
    fundsAgreeing: ["Renaissance", "Bridgewater"],
    direction: "SHORT",
    avgConviction: "MED (both)",
    signalStrength: "MODERATE",
    description:
      "De-dollarization thesis (reserve share 57-58%) shared by both.",
  },
  {
    asset: "Long Defense / Aerospace",
    tickers: "LMT, RTX",
    fundsAgreeing: ["Renaissance", "Millennium"],
    direction: "LONG",
    avgConviction: "HIGH/MED",
    signalStrength: "MODERATE",
    description:
      "Iran conflict + defense spending ratchet. Domestic supply chains = zero tariff exposure.",
  },
  {
    asset: "Short European Equities / Autos",
    tickers: "EFA, VWAGY, STM",
    fundsAgreeing: ["Bridgewater", "Millennium"],
    direction: "SHORT",
    avgConviction: "MED",
    signalStrength: "MODERATE",
    description:
      "EU faces 20% reciprocal tariff. German auto sector directly targeted.",
  },
];

export const divergentAlpha: DivergentAlpha[] = [
  {
    asset: "CDX IG/HY Credit Protection",
    fund: "Pershing",
    direction: "LONG protection",
    conviction: "HIGH",
    whyUnique:
      "$75-100M premium for 30-50x convexity if spreads blow out. Replicates 2020 CDS trade. No other fund plays credit.",
  },
  {
    asset: "TIPS (5-10Y)",
    fund: "Bridgewater",
    direction: "LONG",
    conviction: "HIGH",
    whyUnique:
      "Only fund explicitly long inflation-linked bonds. Core stagflation instrument.",
  },
  {
    asset: "Uber (UBER)",
    fund: "Pershing",
    direction: "LONG (15.90%)",
    conviction: "HIGH",
    whyUnique:
      "Domestic platform with 80%+ tariff-immune revenue. Autonomous vehicle optionality.",
  },
  {
    asset: "Brookfield Corp (BN)",
    fund: "Pershing",
    direction: "LONG (18.15%)",
    conviction: "HIGH",
    whyUnique:
      "Largest single position across all 5 funds. Alt asset management completely off other funds' radar.",
  },
  {
    asset: "Block/Square (XYZ)",
    fund: "Tiger",
    direction: "LONG",
    conviction: "HIGH",
    whyUnique:
      "Highest-conviction new capital deployment for Tiger. Domestic fintech with near-zero tariff exposure.",
  },
  {
    asset: "Zillow (Z)",
    fund: "Tiger",
    direction: "LONG",
    conviction: "HIGH",
    whyUnique:
      "Domestic housing digitization play. Zero tariff exposure. 3-5 year secular thesis.",
  },
  {
    asset: "Universal Music Group (UMG)",
    fund: "Pershing",
    direction: "LONG (~17%)",
    conviction: "HIGH",
    whyUnique:
      'Music royalties as "ultimate tariff-proof asset." Digital streaming, zero physical supply chain.',
  },
  {
    asset: "VIX Term Structure Trade",
    fund: "Renaissance",
    direction: "SELL Nov VIX / BUY Jul SPX puts",
    conviction: "MED",
    whyUnique:
      "Only fund trading vol term structure. Exploiting kink around July 24 Section 122 expiration.",
  },
  {
    asset: "TLT/HYG Pair (post-debate)",
    fund: "Millennium",
    direction: "Long TLT / Short HYG",
    conviction: "MED",
    whyUnique:
      "Added during war room debate. Anti-consensus safe-haven rotation through fixed income pairs.",
  },
  {
    asset: "Sea Limited (SE)",
    fund: "Tiger",
    direction: "LONG (6.62%)",
    conviction: "MED",
    whyUnique:
      "Most contrarian position. Betting on SE Asian e-commerce that every other fund is avoiding.",
  },
];

export const keyDisagreements = [
  {
    title: "Stagflation: Certain or Priced In?",
    sides: [
      { fund: "Bridgewater", position: "All-in on stagflation thesis" },
      {
        fund: "Tiger / Pershing",
        position: "Tariff regime is temporary, growth is mispriced",
      },
    ],
    crux: "Is the July 24 Section 122 expiration a policy cliff or forcing function for resolution?",
  },
  {
    title: "Leverage in a Novel Regime",
    sides: [
      { fund: "Renaissance", position: "Increasing gross to 15.5x (dispersion = opportunity)" },
      { fund: "Millennium", position: "3.3x with 5% hard drawdown limit" },
      { fund: "Bridgewater", position: "Reducing AW leverage from 1.8x to 1.5x" },
    ],
    crux: "Does elevated dispersion create opportunity (RenTech) or risk (everyone else)?",
  },
  {
    title: "Volatility: Buy It or Sell It?",
    sides: [
      { fund: "Bridgewater", position: "Buying VIX calls -- long vol through policy cliff" },
      {
        fund: "Renaissance",
        position: "Selling VIX futures (Nov) -- post-resolution vol compression",
      },
    ],
    crux: "These two are on opposite sides of the post-July vol question. One of them is wrong.",
  },
  {
    title: "Mag 7: Quality or Crowded?",
    sides: [
      { fund: "Tiger (40%) / Pershing (55%+)", position: "Concentrated in Big Tech platforms" },
      { fund: "Bridgewater", position: "Underweighting equities broadly" },
      { fund: "Renaissance", position: "Trimming TSLA, reducing semi exposure" },
    ],
    crux: "If July tariff resolution is bearish, Mag 7 leads the drawdown because it is where the money is.",
  },
];
