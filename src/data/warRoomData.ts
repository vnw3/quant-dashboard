// War Room debate data

import { FUND_COLORS } from "./fundProfiles";

export interface DebateEntry {
  fund: string;
  fundId: string;
  color: string;
  type: "statement" | "challenge" | "rebuttal" | "concession";
  target?: string;
  content: string;
}

export const round1: DebateEntry[] = [
  {
    fund: "Bridgewater",
    fundId: "bridgewater",
    color: FUND_COLORS.bridgewater,
    type: "challenge",
    target: "Tiger Global",
    content:
      "Tiger, you are running 140% net long into the worst stagflationary setup since 1974. Your portfolio is 40% Mag 7 -- the most crowded long in the institutional equity market. When the July tariff cliff hits, every fundamental long-only fund on the planet will be selling the same names you own. Your 2% gold allocation is a fig leaf on a naked directional bet. How do you survive a 20-25% NASDAQ drawdown with 1.8x leverage and no systematic hedging infrastructure?",
  },
  {
    fund: "Tiger Global",
    fundId: "tiger",
    color: FUND_COLORS.tiger,
    type: "rebuttal",
    content:
      "This is not 2022, Bridgewater. The discount rate is not the enemy this time -- the Fed is at 3.50-3.75%, not hiking. The tariff regime is legally temporary: Section 122 expires July 24, the SCOTUS ruling permanently constrains executive authority, and Section 301 investigations cannot be completed in the required timeframe. Our Mag 7 holdings generate $300B+ in combined annual free cash flow with 60-80% gross margins. Amazon, Alphabet, and Meta have minimal direct tariff exposure. We are reducing to 1.5x and adding shorts, but the core thesis is that secular growth trajectories are not durably impaired by a 150-day tariff.",
  },
  {
    fund: "Renaissance",
    fundId: "renaissance",
    color: FUND_COLORS.renaissance,
    type: "challenge",
    target: "Millennium",
    content:
      "Millennium, your pairs book is elegant but every pod shop on the street is running some version of 'long domestic / short international.' The EOG/NKE, GM/VWAGY, and IWM/EFA pairs are consensus relative value. When the Engineers Gate SMA got terminated last month, it was partially because of factor crowding in exactly these types of pairs. What happens to your 3.5x gross when correlation spikes to 1.0 and every pair converges?",
  },
  {
    fund: "Millennium",
    fundId: "millennium",
    color: FUND_COLORS.millennium,
    type: "rebuttal",
    content:
      "I appreciate the concern, but my risk infrastructure is purpose-built for exactly this scenario. If correlations spike, I flatten within 24 hours. The 5% drawdown limit is sacrosanct -- capital gets halved, not doubled. At 7.5% I am terminated. I do not negotiate with drawdown limits. The difference between my pairs book and Engineers Gate is that I size each pair at 2-4% of pod capital with documented stop-losses. A 2-sigma adverse move costs me 40-60bps per pair, not the book. And unlike your 15.8x gross in a regime you admit is without precedent, I can be completely flat by end of day tomorrow.",
  },
  {
    fund: "Pershing Square",
    fundId: "pershing",
    color: FUND_COLORS.pershing,
    type: "challenge",
    target: "Renaissance",
    content:
      "Renaissance, you are increasing leverage from 14.5x to 15.8x into a regime your own memo describes as 'without historical precedent in our training data.' Your models have never seen simultaneous SCOTUS tariff constraints, a 150-day statutory clock, Hormuz disruption at this scale, and a US-China summit. You are betting that cross-sectional dispersion will save you, but what if the novel element is that dispersion compresses violently as the market moves to a single-factor risk-on/risk-off regime?",
  },
  {
    fund: "Renaissance",
    fundId: "renaissance",
    color: FUND_COLORS.renaissance,
    type: "rebuttal",
    content:
      "Our models have navigated 2008 (+98.2% gross), 2020 (+76% Medallion), and every regime in between. The increase from 14.5x to 15.8x is a function of elevated cross-sectional dispersion -- our alpha opportunity set is wider, which justifies the additional leverage. We have automated deleveraging triggers: if cross-asset correlations exceed 0.85, gross exposure drops by 20% within 60 minutes. If intraday losses exceed 1.5%, another 15% reduction. We are not taking a directional bet -- we are near market-neutral. The leverage amplifies alpha extraction, not market beta. That said, your point about regime novelty is valid. We are running additional scenario stress tests on correlation assumptions.",
  },
  {
    fund: "Bridgewater",
    fundId: "bridgewater",
    color: FUND_COLORS.bridgewater,
    type: "challenge",
    target: "Pershing Square",
    content:
      "Ackman, you have 72% of your portfolio in five stocks and you are calling it 'simple, predictable, free-cash-flow-generative.' In 2015-2017, Valeant was also 'simple and predictable' until it was not. Your CDX hedge is clever -- I grant you that -- but $75-100M in premium buys you limited upside if spreads widen gradually rather than explosively. The 2020 CDS trade worked because March 2020 was a liquidity crisis with overnight spread dislocation. This is a slow-motion policy crisis. Spreads may widen 50bps over six months, not 200bps in two weeks.",
  },
  {
    fund: "Pershing Square",
    fundId: "pershing",
    color: FUND_COLORS.pershing,
    type: "rebuttal",
    content:
      "The difference between 2015 and 2026 is the quality of the businesses. Valeant was a financial engineering play with no organic growth. Brookfield, Amazon, Alphabet, Meta, and Uber are the five strongest platform businesses in the world with $500B+ combined market cap and dominant competitive positions. Diversification is the admission that you do not know what you own. I know exactly what I own, and I know that these businesses will be worth significantly more in five years regardless of whether Trump and Xi reach a deal this week. As for the CDX: you are right that I need a catalyst. But I count at least three -- the July tariff cliff, Iran escalation risk, and Section 301 determinations -- all concentrating into a 60-day window. The expected value is massively positive.",
  },
];

export const round2: DebateEntry[] = [
  {
    fund: "Millennium",
    fundId: "millennium",
    color: FUND_COLORS.millennium,
    type: "challenge",
    target: "Bridgewater",
    content:
      "Bridgewater, your All Weather portfolio just reduced leverage from 1.8x to 1.5x because cross-asset correlations are elevated. But your Pure Alpha is still running 30-40 uncorrelated macro positions at 3x. In a genuine stagflation -- which you are betting on -- correlations across inflation hedges will also spike. Gold, TIPS, energy, and commodity currencies all rally together, which means they will also correct together when the thesis wobbles. Your 'uncorrelated positions' are actually highly correlated to a single factor: the stagflation bet.",
  },
  {
    fund: "Bridgewater",
    fundId: "bridgewater",
    color: FUND_COLORS.bridgewater,
    type: "rebuttal",
    content:
      "Our economic machine framework does not rely on correlations remaining stable. It relies on understanding the causal relationships between policy, debt cycles, and asset prices. When we say 'falling growth, rising inflation,' we are describing the economic environment, not making a correlation bet. If we are wrong about the environment -- if this is actually 'rising growth, falling inflation' -- we will be wrong on most positions simultaneously. That is the risk we are taking. But we are not wrong about the environment. PCE at 2.7% is going higher with $111 oil and 15% tariffs. GDP growth is decelerating. The economic machine does not lie.",
  },
  {
    fund: "Tiger Global",
    fundId: "tiger",
    color: FUND_COLORS.tiger,
    type: "challenge",
    target: "Pershing Square",
    content:
      "Ackman, we both own Amazon and Alphabet, but I am worried about your concentration risk. You have 55%+ in three tech platforms. If the July tariff resolution triggers a broad tech selloff -- even one that does not permanently impair fundamentals -- your NAV could drop another 15-20% on top of the 19% you have already lost. Your CDX hedge needs a credit event to pay off, not just a selloff. Are you conflating equity drawdown protection with credit tail protection?",
  },
  {
    fund: "Pershing Square",
    fundId: "pershing",
    color: FUND_COLORS.pershing,
    type: "rebuttal",
    content:
      "I have permanent capital. No one can force me to sell. The PSH closed-end structure is my most important risk management tool -- not the CDX. In 2020, we were down significantly before the CDS trade paid off. In 2015-2017, we were down 34% cumulatively and then compounded at 50%+ for two years. The CDX is not equity drawdown protection -- you are right about that. It is a profit center in the tail. If we get a credit event, the CDX generates $1.5-3B, which more than offsets equity losses and funds aggressive buying at distressed prices. The structure is: equities for the base case, CDX for the tail, permanent capital for the patience to hold through drawdowns. I have seen this movie before.",
  },
  {
    fund: "Renaissance",
    fundId: "renaissance",
    color: FUND_COLORS.renaissance,
    type: "concession",
    content:
      "After hearing the cross-examination, I am making one adjustment: reducing our target gross leverage from 15.8x to 15.5x. The 0.3x reduction provides an additional $300M buffer at the fund level while maintaining our core stat-arb strategy. Pershing's point about regime novelty in our training data is valid. The concession is minor in dollar terms but meaningful as a risk acknowledgment. Our automated deleveraging triggers remain at correlation > 0.85.",
  },
  {
    fund: "Millennium",
    fundId: "millennium",
    color: FUND_COLORS.millennium,
    type: "statement",
    content:
      "I am adding one new pairs trade to my book based on this discussion: Long TLT / Short HYG. If Pershing is right about the credit tail risk, high-yield spreads blow out while Treasuries rally on flight-to-quality. If he is wrong, the carry on TLT vs HYG is manageable. This is the anti-consensus trade that this room's debate has surfaced. I would rather be flat and bored than leveraged and fired.",
  },
];
