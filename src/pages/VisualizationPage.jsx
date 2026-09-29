import {
  Activity,
  BarChart3,
  CalendarDays,
  Database,
  FileSpreadsheet,
  Layers3,
  PieChart as PieChartIcon,
  ScatterChart as ScatterIcon,
  TrendingUp,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { useMemo } from "react";

import { useDataset } from "../context/DatasetContext";
import "../styles/visualization.css";

export default function VisualizationPage() {
  const {
    dataset,
    analysis,
    hasDataset,
    analysisLoading,
  } = useDataset();

  const numericColumns =
    analysis?.numericColumns || [];

  const types =
    analysis?.types || [];

  const categoricalColumns =
    types
      .filter(
        (item) =>
          item.type === "categorical"
      )
      .map(getTypeColumn)
      .filter(Boolean);

  const dateColumns =
    types
      .filter(
        (item) =>
          item.type === "date"
      )
      .map(getTypeColumn)
      .filter(Boolean);

  const chartData = useMemo(() => {
    if (!dataset?.data) {
      return {
        category: [],
        trend: [],
        histogram: [],
        scatter: [],
      };
    }

    const categoryColumn =
      categoricalColumns[0];

    const numericColumn =
      numericColumns[0];

    const secondNumeric =
      numericColumns[1];

    const dateColumn =
      dateColumns[0];

    return {
      category: buildCategoryData(
        dataset.data,
        categoryColumn,
        numericColumn
      ),

      trend: buildTrendData(
        dataset.data,
        dateColumn,
        numericColumn
      ),

      histogram: buildHistogramData(
        dataset.data,
        numericColumn
      ),

      scatter: buildScatterData(
        dataset.data,
        numericColumn,
        secondNumeric
      ),
    };
  }, [
    dataset,
    categoricalColumns,
    numericColumns,
    dateColumns,
  ]);

  if (analysisLoading) {
    return (
      <section className="visualization-page">
        <VisualizationState
          title="Preparing visualizations"
          description="Automatically selecting charts and analyzing your dataset..."
          icon={<BarChart3 size={27} />}
        />
      </section>
    );
  }

  if (!hasDataset || !analysis) {
    return (
      <section className="visualization-page">
        <VisualizationState
          title="No dataset available"
          description="Upload a dataset to generate data-driven visualizations."
          icon={<Layers3 size={27} />}
        />
      </section>
    );
  }

  const overview =
    analysis.overview || {};

  const availableCharts = [
    chartData.category.length > 0,
    chartData.trend.length > 0,
    chartData.histogram.length > 0,
    chartData.scatter.length > 0,
  ].filter(Boolean).length;

  return (
    <section className="visualization-page">
      {/* HEADER */}
      <header className="visualization-header">
        <div className="visualization-heading">
          <div className="visualization-title-icon">
            <BarChart3 size={22} />
          </div>

          <div>
            <span className="visualization-eyebrow">
              VISUAL ANALYTICS
            </span>

            <h2>Visualizations</h2>

            <p>
              Explore patterns, distributions, trends,
              and relationships through automatically
              generated charts.
            </p>
          </div>
        </div>

        <div className="visualization-dataset">
          <FileSpreadsheet size={16} />

          <div>
            <strong title={dataset.fileName}>
              {dataset.fileName}
            </strong>

            <span>
              {overview.rowCount?.toLocaleString() ||
                0}{" "}
              rows · {numericColumns.length} numeric
              features
            </span>
          </div>
        </div>
      </header>

      {/* VISUAL SUMMARY */}
      <section className="visualization-summary">
        <div className="visualization-summary-intro">
          <span className="visualization-section-label">
            VISUAL ANALYTICS
          </span>

          <h3>
            Dataset visual overview
          </h3>

          <p>
            Charts are generated from the structure and
            values detected in your uploaded dataset.
          </p>
        </div>

        <div className="visualization-summary-grid">
          <VisualMetric
            icon={<BarChart3 size={17} />}
            label="Charts available"
            value={availableCharts}
            description="Generated automatically"
            type="blue"
          />

          <VisualMetric
            icon={<HashIcon />}
            label="Numeric fields"
            value={numericColumns.length}
            description="Available for analysis"
            type="violet"
          />

          <VisualMetric
            icon={<Layers3 size={17} />}
            label="Categories"
            value={categoricalColumns.length}
            description="Categorical fields"
            type="green"
          />

          <VisualMetric
            icon={<CalendarDays size={17} />}
            label="Date fields"
            value={dateColumns.length}
            description="Available for trends"
            type="orange"
          />
        </div>
      </section>

      {/* CHART WORKSPACE */}
      <section className="visualization-workspace">
        <div className="visualization-workspace-header">
          <div>
            <span className="visualization-section-label">
              GENERATED VISUALS
            </span>

            <h3>
              Explore your data
            </h3>

            <p>
              The charts below are built dynamically
              from the uploaded dataset.
            </p>
          </div>

          <div className="visualization-live-badge">
            <span />
            LIVE DATA
          </div>
        </div>

        <div className="visualization-grid">
          {/* CATEGORY BAR */}
          {chartData.category.length > 0 && (
            <VisualizationCard
              icon={<BarChart3 size={16} />}
              label="CATEGORY COMPARISON"
              title={
                categoricalColumns[0]
                  ? `${categoricalColumns[0]} distribution`
                  : "Category distribution"
              }
              description="Compares the most common categories in the dataset."
            >
              <CategoryBarChart
                data={chartData.category}
              />
            </VisualizationCard>
          )}

          {/* TREND */}
          {chartData.trend.length > 0 && (
            <VisualizationCard
              icon={<TrendingUp size={16} />}
              label="TREND ANALYSIS"
              title={
                dateColumns[0]
                  ? `${numericColumns[0]} over time`
                  : "Trend analysis"
              }
              description="Shows how a numeric measure changes across time."
              wide
            >
              <TrendChart
                data={chartData.trend}
              />
            </VisualizationCard>
          )}

          {/* PIE */}
          {chartData.category.length > 0 && (
            <VisualizationCard
              icon={<PieChartIcon size={16} />}
              label="COMPOSITION"
              title="Category composition"
              description="Shows the proportional contribution of each category."
            >
              <CategoryPieChart
                data={chartData.category}
              />
            </VisualizationCard>
          )}

          {/* HISTOGRAM */}
          {chartData.histogram.length > 0 && (
            <VisualizationCard
              icon={<Activity size={16} />}
              label="DISTRIBUTION"
              title={
                numericColumns[0]
                  ? `${numericColumns[0]} distribution`
                  : "Numeric distribution"
              }
              description="Displays how numeric observations are distributed."
            >
              <HistogramChart
                data={chartData.histogram}
              />
            </VisualizationCard>
          )}

          {/* SCATTER */}
          {chartData.scatter.length > 0 && (
            <VisualizationCard
              icon={<ScatterIcon size={16} />}
              label="RELATIONSHIP"
              title={
                numericColumns.length >= 2
                  ? `${numericColumns[0]} vs ${numericColumns[1]}`
                  : "Numeric relationship"
              }
              description="Explores the relationship between two numeric features."
              wide
            >
              <ScatterRelationshipChart
                data={chartData.scatter}
              />
            </VisualizationCard>
          )}

          {/* DATA PROFILE */}
          <VisualizationCard
            icon={<Database size={16} />}
            label="DATA PROFILE"
            title="Visualization coverage"
            description="Overview of the fields available for chart generation."
          >
            <VisualizationCoverage
              numeric={numericColumns.length}
              categorical={
                categoricalColumns.length
              }
              dates={dateColumns.length}
              rows={
                overview.rowCount || 0
              }
            />
          </VisualizationCard>
        </div>
      </section>

      {/* CHART LEGEND / INFO */}
      <section className="visualization-info">
        <div className="visualization-info-icon">
          <Layers3 size={17} />
        </div>

        <div>
          <strong>
            Automatic chart selection
          </strong>

          <p>
            The platform chooses visualizations based
            on detected data types. Categorical fields
            are used for comparisons and composition,
            numeric fields for distributions and
            relationships, and date fields for trends.
          </p>
        </div>
      </section>
    </section>
  );
}

/* =========================================================
   COMPONENTS
   ========================================================= */

function VisualizationCard({
  icon,
  label,
  title,
  description,
  children,
  wide = false,
}) {
  return (
    <article
      className={`visualization-card ${
        wide
          ? "visualization-card-wide"
          : ""
      }`}
    >
      <div className="visualization-card-header">
        <div className="visualization-card-heading">
          <div className="visualization-card-icon">
            {icon}
          </div>

          <div>
            <span>
              {label}
            </span>

            <h4>{title}</h4>

            <p>
              {description}
            </p>
          </div>
        </div>

        <span className="visualization-auto-badge">
          AUTO
        </span>
      </div>

      <div className="visualization-chart">
        {children}
      </div>
    </article>
  );
}

function VisualMetric({
  icon,
  label,
  value,
  description,
  type,
}) {
  return (
    <div className="visualization-metric">
      <div
        className={`visualization-metric-icon ${type}`}
      >
        {icon}
      </div>

      <div>
        <span>{label}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>
    </div>
  );
}

function CategoryBarChart({
  data,
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <BarChart
        data={data}
        margin={{
          top: 8,
          right: 10,
          left: -15,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#edf0f4"
        />

        <XAxis
          dataKey="name"
          tick={{
            fontSize: 8,
            fill: "#667085",
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          allowDecimals={false}
          tick={{
            fontSize: 8,
            fill: "#667085",
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 10,
          }}
        />

        <Bar
          dataKey="value"
          radius={[5, 5, 0, 0]}
        >
          {data.map(
            (_, index) => (
              <Cell
                key={index}
                fill={
                  CHART_COLORS[
                    index %
                      CHART_COLORS.length
                  ]
                }
              />
            )
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function CategoryPieChart({
  data,
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="47%"
          innerRadius="48%"
          outerRadius="72%"
          paddingAngle={2}
        >
          {data.map(
            (_, index) => (
              <Cell
                key={index}
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

        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 10,
          }}
        />

        <Legend
          wrapperStyle={{
            fontSize: 8,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TrendChart({
  data,
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <AreaChart
        data={data}
        margin={{
          top: 8,
          right: 12,
          left: -15,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient
            id="trendFill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor="#2563eb"
              stopOpacity={0.25}
            />

            <stop
              offset="95%"
              stopColor="#2563eb"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#edf0f4"
        />

        <XAxis
          dataKey="name"
          tick={{
            fontSize: 8,
            fill: "#667085",
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{
            fontSize: 8,
            fill: "#667085",
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 10,
          }}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={2}
          fill="url(#trendFill)"
        />

        <Line
          type="monotone"
          dataKey="value"
          stroke="#7c3aed"
          strokeWidth={1}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function HistogramChart({
  data,
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <BarChart
        data={data}
        margin={{
          top: 8,
          right: 10,
          left: -15,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#edf0f4"
        />

        <XAxis
          dataKey="name"
          tick={{
            fontSize: 7,
            fill: "#667085",
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          allowDecimals={false}
          tick={{
            fontSize: 8,
            fill: "#667085",
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 10,
          }}
        />

        <Bar
          dataKey="value"
          fill="#7c3aed"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ScatterRelationshipChart({
  data,
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <ScatterChart
        margin={{
          top: 8,
          right: 15,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#edf0f4"
        />

        <XAxis
          type="number"
          dataKey="x"
          name="X"
          tick={{
            fontSize: 8,
            fill: "#667085",
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          type="number"
          dataKey="y"
          name="Y"
          tick={{
            fontSize: 8,
            fill: "#667085",
          }}
          axisLine={false}
          tickLine={false}
        />

        <ZAxis
          range={[35, 35]}
        />

        <Tooltip
          cursor={{
            strokeDasharray: "3 3",
          }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 10,
          }}
        />

        <Scatter
          data={data}
          fill="#2563eb"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function VisualizationCoverage({
  numeric,
  categorical,
  dates,
  rows,
}) {
  const total =
    numeric +
    categorical +
    dates;

  return (
    <div className="visualization-coverage">
      <div className="coverage-total">
        <strong>
          {rows.toLocaleString()}
        </strong>

        <span>records analyzed</span>
      </div>

      <CoverageRow
        label="Numeric"
        value={numeric}
        total={total}
        type="numeric"
      />

      <CoverageRow
        label="Categorical"
        value={categorical}
        total={total}
        type="categorical"
      />

      <CoverageRow
        label="Date"
        value={dates}
        total={total}
        type="date"
      />
    </div>
  );
}

function CoverageRow({
  label,
  value,
  total,
  type,
}) {
  const percentage =
    total > 0
      ? (value / total) * 100
      : 0;

  return (
    <div className="coverage-row">
      <div>
        <span>{label}</span>

        <strong>{value}</strong>
      </div>

      <div className="coverage-progress">
        <span
          className={type}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function VisualizationState({
  title,
  description,
  icon,
}) {
  return (
    <div className="visualization-state">
      <div className="visualization-state-icon">
        {icon}
      </div>

      <span className="visualization-eyebrow">
        VISUAL ANALYTICS
      </span>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}

/* =========================================================
   DATA BUILDERS
   ========================================================= */

function buildCategoryData(
  data,
  categoryColumn,
  numericColumn
) {
  if (!categoryColumn) {
    return [];
  }

  const groups = {};

  data.forEach((row) => {
    const raw =
      row?.[categoryColumn];

    if (
      raw === null ||
      raw === undefined ||
      String(raw).trim() === ""
    ) {
      return;
    }

    const key = String(raw);

    if (!groups[key]) {
      groups[key] = {
        name: key,
        value: 0,
      };
    }

    if (numericColumn) {
      const number = Number(
        row?.[numericColumn]
      );

      if (Number.isFinite(number)) {
        groups[key].value += number;
      } else {
        groups[key].value += 1;
      }
    } else {
      groups[key].value += 1;
    }
  });

  return Object.values(groups)
    .sort(
      (a, b) => b.value - a.value
    )
    .slice(0, 8);
}

function buildTrendData(
  data,
  dateColumn,
  numericColumn
) {
  if (!dateColumn || !numericColumn) {
    return [];
  }

  const groups = {};

  data.forEach((row) => {
    const date =
      parseDateValue(
        row?.[dateColumn]
      );

    const value = Number(
      row?.[numericColumn]
    );

    if (
      !date ||
      !Number.isFinite(value)
    ) {
      return;
    }

    const key =
      date.toISOString().slice(0, 10);

    if (!groups[key]) {
      groups[key] = {
        sum: 0,
        count: 0,
      };
    }

    groups[key].sum += value;
    groups[key].count += 1;
  });

  return Object.entries(groups)
    .sort(([a], [b]) =>
      a.localeCompare(b)
    )
    .slice(-20)
    .map(([name, item]) => ({
      name,
      value:
        item.sum / item.count,
    }));
}

function buildHistogramData(
  data,
  numericColumn
) {
  if (!numericColumn) {
    return [];
  }

  const values = data
    .map((row) =>
      Number(row?.[numericColumn])
    )
    .filter(Number.isFinite);

  if (values.length === 0) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return [
      {
        name: formatCompact(min),
        value: values.length,
      },
    ];
  }

  const binCount = Math.min(
    10,
    Math.max(
      5,
      Math.ceil(
        Math.sqrt(values.length)
      )
    )
  );

  const width =
    (max - min) / binCount;

  const bins = Array.from(
    { length: binCount },
    (_, index) => ({
      name: formatCompact(
        min + index * width
      ),
      value: 0,
    })
  );

  values.forEach((value) => {
    let index = Math.floor(
      (value - min) / width
    );

    if (index >= binCount) {
      index = binCount - 1;
    }

    bins[index].value += 1;
  });

  return bins;
}

function buildScatterData(
  data,
  firstColumn,
  secondColumn
) {
  if (
    !firstColumn ||
    !secondColumn
  ) {
    return [];
  }

  return data
    .map((row) => ({
      x: Number(
        row?.[firstColumn]
      ),
      y: Number(
        row?.[secondColumn]
      ),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.x) &&
        Number.isFinite(item.y)
    )
    .slice(0, 500);
}

function getTypeColumn(item) {
  return (
    item?.column ||
    item?.name ||
    item?.feature ||
    null
  );
}

function parseDateValue(value) {
  if (
    value instanceof Date &&
    !Number.isNaN(value.getTime())
  ) {
    return value;
  }

  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}

function formatCompact(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return value.toLocaleString(
    undefined,
    {
      maximumFractionDigits: 1,
    }
  );
}

function HashIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

const CHART_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#16a34a",
  "#ea580c",
  "#0891b2",
  "#db2777",
  "#ca8a04",
  "#4f46e5",
];