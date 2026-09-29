import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  buildCategoryData,
  buildTimeSeriesData,
  buildScatterData,
  buildHistogramData,
} from "../../utils/chartUtils";

const CHART_COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#f97316",
  "#e11d74",
  "#10b981",
  "#8b5cf6",
  "#0ea5e9",
  "#f59e0b",
  "#14b8a6",
  "#ec4899",
];

export default function ChartRenderer({
  data = [],
  recommendation,
}) {
  if (!recommendation) {
    return (
      <div className="visual-renderer-empty">
        <p>
          Select a visualization to
          display your data.
        </p>
      </div>
    );
  }

  const {
    type,
    category,
    value,
    x,
    y,
  } = recommendation;

  if (type === "bar") {
    const chartData =
      buildCategoryData(
        data,
        category,
        value
      );

    return (
      <ChartContainer>
        <ResponsiveContainer
          width="100%"
          height={420}
        >
          <BarChart
            data={chartData}
            margin={{
              top: 15,
              right: 20,
              left: 5,
              bottom: 45,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
              angle={
                chartData.length > 6
                  ? -25
                  : 0
              }
              textAnchor={
                chartData.length > 6
                  ? "end"
                  : "middle"
              }
              height={65}
            />

            <YAxis
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border:
                  "1px solid #e5e7eb",
                boxShadow:
                  "0 10px 30px rgba(15,23,42,0.10)",
              }}
            />

            <Legend />

            <Bar
              dataKey="value"
              name={value}
              fill="#4f46e5"
              radius={[
                7,
                7,
                0,
                0,
              ]}
              maxBarSize={55}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  if (type === "distribution") {
    const chartData =
      buildCategoryData(
        data,
        category
      );

    return (
      <ChartContainer>
        <ResponsiveContainer
          width="100%"
          height={420}
        >
          <RechartsPieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="48%"
              outerRadius={145}
              innerRadius={65}
              paddingAngle={3}
              label
            >
              {chartData.map(
                (_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      CHART_COLORS[
                        index %
                          CHART_COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              height={40}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  if (type === "line") {
    const chartData =
      buildTimeSeriesData(
        data,
        category,
        value
      );

    return (
      <ChartContainer>
        <ResponsiveContainer
          width="100%"
          height={420}
        >
          <LineChart
            data={chartData}
            margin={{
              top: 15,
              right: 20,
              left: 5,
              bottom: 15,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 10,
                fill: "#64748b",
              }}
            />

            <YAxis
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="value"
              name={value}
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                r: 3,
                fill: "#2563eb",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  if (type === "scatter") {
    const chartData =
      buildScatterData(
        data,
        x,
        y
      );

    return (
      <ChartContainer>
        <ResponsiveContainer
          width="100%"
          height={420}
        >
          <ScatterChart
            margin={{
              top: 15,
              right: 20,
              bottom: 15,
              left: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis
              type="number"
              dataKey="x"
              name={x}
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
            />

            <YAxis
              type="number"
              dataKey="y"
              name={y}
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
            />

            <Tooltip />

            <Scatter
              name={`${x} vs ${y}`}
              data={chartData}
              fill="#f97316"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  if (type === "histogram") {
    const chartData =
      buildHistogramData(
        data,
        value
      );

    return (
      <ChartContainer>
        <ResponsiveContainer
          width="100%"
          height={420}
        >
          <BarChart
            data={chartData}
            margin={{
              top: 15,
              right: 20,
              left: 5,
              bottom: 45,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="range"
              tick={{
                fontSize: 9,
                fill: "#64748b",
              }}
              angle={-25}
              textAnchor="end"
              height={65}
            />

            <YAxis
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="count"
              name="Frequency"
              fill="#06b6d4"
              radius={[
                6,
                6,
                0,
                0,
              ]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  if (type === "area") {
    const chartData =
      buildTimeSeriesData(
        data,
        category,
        value
      );

    return (
      <ChartContainer>
        <ResponsiveContainer
          width="100%"
          height={420}
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 15,
              right: 20,
              left: 5,
              bottom: 15,
            }}
          >
            <defs>
              <linearGradient
                id="visualAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#8b5cf6"
                  stopOpacity={0.45}
                />

                <stop
                  offset="100%"
                  stopColor="#8b5cf6"
                  stopOpacity={0.04}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 10,
                fill: "#64748b",
              }}
            />

            <YAxis
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              name={value}
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#visualAreaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  return (
    <div className="visual-renderer-empty">
      <p>
        This chart type is not available
        for the current dataset.
      </p>
    </div>
  );
}

function ChartContainer({
  children,
}) {
  return (
    <div className="visual-chart-renderer">
      {children}
    </div>
  );
}