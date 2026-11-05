
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Pending", value: 5, color: "#E6A23C" },
  { name: "Approved", value: 8, color: "#06066b" },
  { name: "Completed", value: 12, color: "#25671e" },
  { name: "Rejected", value: 2, color: "#DC5A62" },
];

export default function DoctorChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="doctor-chart-card">
      <div className="doctor-chart-header">
        <div>
          <span className="doctor-chart-eyebrow">
            APPOINTMENT ANALYTICS
          </span>
          <h2>Appointment Overview</h2>
          <p>Monitor the status of your appointments.</p>
        </div>

        <span className="doctor-chart-badge">
          Status Breakdown
        </span>
      </div>

      <div className="doctor-pie-layout">
        <div className="doctor-pie-visual">
          <ResponsiveContainer width="100%" height={290}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={108}
                paddingAngle={4}
                cornerRadius={6}
                stroke="none"
                isAnimationActive={true}
              >
                {data.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                    style={{ cursor: "pointer", outline: "none" }}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `${value} appointments`,
                  name,
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5eaf0",
                  boxShadow: "0 8px 24px rgba(6,6,107,0.12)",
                  fontSize: "13px",
                }}
              />

              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>

          <div className="doctor-pie-center">
            <span>Total</span>
            <strong>{total}</strong>
            <small>Appointments</small>
          </div>
        </div>

        <div className="doctor-pie-details">
          <h3>Appointment Status</h3>
          <p className="doctor-pie-description">
            A breakdown of appointments by current status.
          </p>

          {data.map((item) => (
            <div className="doctor-pie-stat" key={item.name}>
              <div className="doctor-pie-stat-label">
                <span
                  className="doctor-pie-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>

              <div className="doctor-pie-stat-value">
                <strong>{item.value}</strong>
                <span>
                  {total > 0
                    ? `${Math.round((item.value / total) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="doctor-chart-footer">
        <span>Appointment status summary</span>
        <strong>EverCare HMS</strong>
      </div>
    </section>
  );
}
