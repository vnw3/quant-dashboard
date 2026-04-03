"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchMarketData, type MarketTicker } from "../lib/api";

const navItems = [
  { href: "/", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/agentic-13f", label: "Agentic 13F", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href: "/war-room", label: "War Room", icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" },
  { href: "/simulate", label: "Simulate", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const fundLinks = [
  { href: "/funds/renaissance", label: "RenTech", color: "#6366f1" },
  { href: "/funds/bridgewater", label: "Bridgewater", color: "#f59e0b" },
  { href: "/funds/millennium", label: "Millennium", color: "#10b981" },
  { href: "/funds/pershing", label: "Pershing Sq", color: "#ef4444" },
  { href: "/funds/tiger", label: "Tiger Global", color: "#3b82f6" },
];

// Mini market ticker for the sidebar
function SidebarMarketTicker({ tickers }: { tickers: MarketTicker[] }) {
  if (tickers.length === 0) return null;

  return (
    <div className="px-3 mb-3">
      <div className="bg-[#002B49] rounded-md px-3 py-2.5">
        <p className="text-[10px] text-[#5a6e82] uppercase tracking-widest mb-2">
          Market Data
        </p>
        <div className="space-y-1.5">
          {tickers.slice(0, 5).map((t) => {
            const isUp = t.changePct >= 0;
            return (
              <div key={t.symbol} className="flex items-center justify-between">
                <span className="text-[#8b9bb0] text-[10px]">{t.symbol}</span>
                <span
                  className={`text-[10px] tabular-nums font-medium ${
                    isUp ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isUp ? "+" : ""}
                  {t.changePct.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [marketData, setMarketData] = useState<MarketTicker[]>([]);

  // Fetch market data for sidebar
  useEffect(() => {
    fetchMarketData()
      .then(setMarketData)
      .catch(() => {});

    const interval = setInterval(() => {
      fetchMarketData()
        .then(setMarketData)
        .catch(() => {});
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed left-0 top-0 h-full w-[220px] bg-[#001629] flex flex-col z-50">
      <div className="px-5 py-6">
        <h1
          className="text-white text-lg tracking-tight"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Stitch
        </h1>
        <p className="text-[#8b9bb0] text-xs mt-0.5">
          Multi-Agent Simulation
        </p>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[#002B49] text-white"
                  : "text-[#8b9bb0] hover:text-white hover:bg-[#002B49]/50"
              }`}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={item.icon}
                />
              </svg>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 pb-2 px-3">
          <p className="text-[#5a6e82] text-[10px] uppercase tracking-widest">
            Fund Agents
          </p>
        </div>
        {fundLinks.map((fund) => {
          const isActive = pathname === fund.href;
          return (
            <Link
              key={fund.href}
              href={fund.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[#002B49] text-white"
                  : "text-[#8b9bb0] hover:text-white hover:bg-[#002B49]/50"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: fund.color }}
              />
              <span>{fund.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Market data in sidebar */}
      <SidebarMarketTicker tickers={marketData} />

      <div className="px-5 py-4">
        <p className="text-[#5a6e82] text-[10px]">
          March 31, 2026
        </p>
        <p className="text-[#5a6e82] text-[10px]">
          Global Tariff Escalation
        </p>
      </div>
    </nav>
  );
}
