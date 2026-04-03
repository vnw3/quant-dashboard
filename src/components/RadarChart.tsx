"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { fundProfiles, getRadarChartData, FUND_COLORS } from "../data/fundProfiles";

export default function RadarChart() {
  const data = getRadarChartData();

  return (
    <div className="bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.06)] p-6">
      <h3
        className="text-[#171c1f] text-base font-semibold mb-1 tracking-tight"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        Strategy DNA Comparison
      </h3>
      <p className="text-[#6b7280] text-xs mb-4">
        6-axis profile across all five fund agents
      </p>
      <div className="w-full" style={{ height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#e8ecf0" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 11, fill: "#42474d" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              tickCount={5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "none",
                borderRadius: 6,
                boxShadow: "0 8px 24px rgba(23,28,31,0.12)",
                fontSize: 12,
              }}
            />
            {fundProfiles.map((fund) => (
              <Radar
                key={fund.id}
                name={fund.shortName}
                dataKey={fund.id}
                stroke={fund.color}
                fill={fund.color}
                fillOpacity={0.08}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
