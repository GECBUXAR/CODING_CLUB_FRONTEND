"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AreaChart() {
  // Sample data for the chart
  const data = [
    { month: "Jan", attendance: 65 },
    { month: "Feb", attendance: 59 },
    { month: "Mar", attendance: 80 },
    { month: "Apr", attendance: 81 },
    { month: "May", attendance: 56 },
    { month: "Jun", attendance: 55 },
    { month: "Jul", attendance: 40 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
