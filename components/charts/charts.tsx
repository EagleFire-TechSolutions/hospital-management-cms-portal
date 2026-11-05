
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "@/styles/patient.css";
export default function PatientChart() {
  const data = [
    { month: "Jan", appointments: 1 },
    { month: "Feb", appointments: 2 },
    { month: "Mar", appointments: 1 },
    { month: "Apr", appointments: 3 },
    { month: "May", appointments: 2 },
    { month: "Jun", appointments: 4 },
  ];

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#8b5cf6",
    "#0d9488",
    "#f59e0b",
    "#64748b",
  ];

  return (
    <div className="patient-pie-chart">
      <h2>My Appointments Overview</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="appointments"
            nameKey="month"
            cx="50%"
            cy="45%"
            outerRadius={100}
            innerRadius={55}
            paddingAngle={3}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
