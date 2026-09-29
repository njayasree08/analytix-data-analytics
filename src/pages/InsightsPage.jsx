import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Info,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useMemo } from "react";

import { useDataset } from "../context/DatasetContext";
import "../styles/insights.css";

export default function InsightsPage() {
  const {
    dataset,
    analysis,
    hasDataset,
    analysisLoading,
  } = useDataset();

  const insights = analysis?.insights || [];

  const overview = analysis?.overview || {};

  const summary = useMemo(
    () => getInsightSummary(insights),
    [insights]
  );

  const groupedInsights = useMemo(
    () => groupInsights(insights),
    [insights]
  );

  if (analysisLoading) {
    return (
      <section className="insights-page">
        <InsightsState
          icon={<Sparkles size={27} />}
          title="Generating insights"
          description="Reviewing your dataset for patterns, quality issues, relationships, and useful findings..."
        />
      </section>
    );
  }

  if (!hasDataset || !analysis) {
    return (
      <section className="insights-page">
        <InsightsState
          icon={<Lightbulb size={27} />}
          eyebrow="ANALYTICAL FINDINGS"
          title="No dataset available"
          description="Upload a dataset to generate data-backed analytical insights."
        />
      </section>
    );
  }

  return (
    <section className="insights-page">
      {/* HEADER */}
      <header className="insights-header">
        <div className="insights-heading">
          <div className="insights-title-icon">
            <Lightbulb size={22} />
          </div>

          <div>
            <span className="insights-eyebrow">
              ANALYTICAL FINDINGS
            </span>

            <h2>Insights</h2>

            <p>
              Discover meaningful findings automatically
              generated from your dataset.
            </p>
          </div>
        </div>

        <div className="insights-dataset">
          <FileSpreadsheet size={16} />

          <div>
            <strong title={dataset?.fileName || "Dataset"}>
              {dataset?.fileName || "Dataset"}
            </strong>

            <span>
              {(overview.rowCount || 0).toLocaleString()}{" "}
              rows · {overview.columnCount || 0} columns
            </span>
          </div>
        </div>
      </header>

      {/* INSIGHT SUMMARY */}
      <section className="insights-overview">
        <div className="insights-overview-copy">
          <span className="insights-section-label">
            INSIGHT SUMMARY
          </span>

          <h3>What the analysis found</h3>

          <p>
            Findings are generated from the uploaded
            data using statistical, quality, relationship,
            and feature-level analysis.
          </p>
        </div>

        <div className="insights-summary-grid">
          <InsightMetric
            icon={<Lightbulb size={17} />}
            label="Total findings"
            value={summary.total}
            description="Generated insights"
            type="blue"
          />

          <InsightMetric
            icon={<AlertTriangle size={17} />}
            label="High priority"
            value={summary.high}
            description="Requires attention"
            type="red"
          />

          <InsightMetric
            icon={<TrendingUp size={17} />}
            label="Medium priority"
            value={summary.medium}
            description="Worth reviewing"
            type="orange"
          />

          <InsightMetric
            icon={<CheckCircle2 size={17} />}
            label="Informational"
            value={summary.low}
            description="Useful observations"
            type="green"
          />
        </div>
      </section>

      {/* KEY FINDINGS */}
      <section className="insights-key-section">
        <div className="insights-section-heading">
          <div>
            <span className="insights-section-label">
              KEY FINDINGS
            </span>

            <h3>Important observations</h3>

            <p>
              Prioritized findings from the current
              analysis.
            </p>
          </div>

          <div className="insights-analysis-badge">
            <span />
            ANALYSIS COMPLETE
          </div>
        </div>

        {insights.length > 0 ? (
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <InsightCard
                key={
                  insight?.id ||
                  `${insight?.title || "insight"}-${index}`
                }
                insight={insight}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyInsights />
        )}
      </section>

      {/* PRIORITY AND TYPE BREAKDOWN */}
      <section className="insights-two-column">
        <section className="insights-card">
          <div className="insights-card-header">
            <div>
              <span className="insights-section-label">
                PRIORITY BREAKDOWN
              </span>

              <h3>Finding distribution</h3>
            </div>

            <div className="insights-card-icon">
              <BarChart3 size={16} />
            </div>
          </div>

          <PriorityBreakdown summary={summary} />
        </section>

        <section className="insights-card">
          <div className="insights-card-header">
            <div>
              <span className="insights-section-label">
                FINDING TYPES
              </span>

              <h3>Analysis coverage</h3>
            </div>

            <div className="insights-card-icon purple">
              <Database size={16} />
            </div>
          </div>

          <InsightTypeBreakdown
            groupedInsights={groupedInsights}
          />
        </section>
      </section>

      {/* ANALYSIS METHODS */}
      <section className="insights-methods">
        <div className="insights-methods-icon">
          <ShieldCheck size={18} />
        </div>

        <div className="insights-methods-content">
          <span className="insights-section-label">
            ANALYSIS METHODS
          </span>

          <h3>How these insights are generated</h3>

          <p>
            The platform derives findings from the
            dataset profile, descriptive statistics,
            missing-value analysis, duplicate detection,
            IQR-based outlier detection, Pearson
            correlation, and feature relevance analysis.
          </p>

          <div className="insights-method-tags">
            <MethodTag text="Data profiling" />
            <MethodTag text="Statistics" />
            <MethodTag text="Data quality" />
            <MethodTag text="IQR outliers" />
            <MethodTag text="Pearson correlation" />
            <MethodTag text="Feature relevance" />
          </div>
        </div>
      </section>
    </section>
  );
}

/* =========================================================
   INSIGHT CARD
   ========================================================= */

function InsightCard({ insight, index }) {
  const priority = normalizePriority(
    insight?.priority
  );

  const config = getPriorityConfig(priority);

  const icon =
    priority === "high" ? (
      <AlertTriangle size={16} />
    ) : priority === "medium" ? (
      <TrendingUp size={16} />
    ) : (
      <Info size={16} />
    );

  const category = getInsightCategory(insight);

  return (
    <article
      className={`insight-result-card ${priority}`}
    >
      <div className="insight-result-top">
        <div
          className={`insight-result-icon ${priority}`}
        >
          {icon}
        </div>

        <div className="insight-result-meta">
          <span
            className={`insight-priority ${priority}`}
          >
            {config.label}
          </span>

          <span className="insight-category">
            {category}
          </span>
        </div>

        <span className="insight-number">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h4>
        {insight?.title ||
          insight?.heading ||
          insight?.name ||
          "Dataset observation"}
      </h4>

      <p>
        {insight?.description ||
          insight?.message ||
          insight?.text ||
          "An analytical observation was detected in the dataset."}
      </p>

      {insight?.metric !== undefined &&
        insight?.metric !== null && (
          <div className="insight-result-metric">
            <span>Detected metric</span>

            <strong>
              {formatMetric(insight.metric)}
            </strong>
          </div>
        )}

      {insight?.recommendation && (
        <div className="insight-recommendation">
          <Lightbulb size={13} />

          <span>
            {insight.recommendation}
          </span>
        </div>
      )}
    </article>
  );
}

/* =========================================================
   SUMMARY
   ========================================================= */

function InsightMetric({
  icon,
  label,
  value,
  description,
  type,
}) {
  return (
    <div className="insights-summary-metric">
      <div
        className={`insights-summary-icon ${type}`}
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

/* =========================================================
   PRIORITY BREAKDOWN
   ========================================================= */

function PriorityBreakdown({ summary }) {
  const total = summary.total || 1;

  const items = [
    {
      label: "High priority",
      value: summary.high,
      type: "high",
    },
    {
      label: "Medium priority",
      value: summary.medium,
      type: "medium",
    },
    {
      label: "Informational",
      value: summary.low,
      type: "low",
    },
  ];

  return (
    <div className="priority-breakdown">
      {items.map((item) => {
        const percentage =
          (item.value / total) * 100;

        return (
          <div
            className="priority-row"
            key={item.type}
          >
            <div className="priority-row-header">
              <span>
                <i
                  className={`priority-dot ${item.type}`}
                />

                {item.label}
              </span>

              <strong>{item.value}</strong>
            </div>

            <div className="priority-progress">
              <span
                className={item.type}
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   INSIGHT TYPE BREAKDOWN
   ========================================================= */

function InsightTypeBreakdown({
  groupedInsights,
}) {
  const entries = Object.entries(
    groupedInsights || {}
  );

  if (!entries.length) {
    return (
      <div className="insight-type-empty">
        No insight categories available.
      </div>
    );
  }

  const max = Math.max(
    ...entries.map(([, value]) => value)
  );

  return (
    <div className="insight-type-list">
      {entries.map(([type, count]) => {
        const percentage =
          max > 0
            ? (count / max) * 100
            : 0;

        return (
          <div
            className="insight-type-row"
            key={type}
          >
            <div className="insight-type-label">
              <span>
                {formatCategory(type)}
              </span>

              <strong>{count}</strong>
            </div>

            <div className="insight-type-progress">
              <span
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   METHOD TAG
   ========================================================= */

function MethodTag({ text }) {
  return (
    <span className="insight-method-tag">
      {text}
    </span>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyInsights() {
  return (
    <div className="insights-empty">
      <div className="insights-empty-icon">
        <CheckCircle2 size={23} />
      </div>

      <h3>No significant findings detected</h3>

      <p>
        The current analysis did not generate any
        notable observations from the available data.
      </p>
    </div>
  );
}

/* =========================================================
   PAGE STATE
   ========================================================= */

function InsightsState({
  icon,
  eyebrow = "ANALYTICAL FINDINGS",
  title,
  description,
}) {
  return (
    <div className="insights-state">
      <div className="insights-state-icon">
        {icon}
      </div>

      <span className="insights-eyebrow">
        {eyebrow}
      </span>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function getInsightSummary(insights) {
  return insights.reduce(
    (result, insight) => {
      const priority = normalizePriority(
        insight?.priority
      );

      result.total += 1;

      if (priority === "high") {
        result.high += 1;
      } else if (priority === "medium") {
        result.medium += 1;
      } else {
        result.low += 1;
      }

      return result;
    },
    {
      total: 0,
      high: 0,
      medium: 0,
      low: 0,
    }
  );
}

function groupInsights(insights) {
  return insights.reduce(
    (result, insight) => {
      const category =
        getInsightCategory(insight);

      result[category] =
        (result[category] || 0) + 1;

      return result;
    },
    {}
  );
}

function getInsightCategory(insight) {
  if (insight?.category) {
    return String(insight.category);
  }

  if (insight?.type) {
    return String(insight.type);
  }

  const title = `${insight?.title || ""} ${
    insight?.description || ""
  }`.toLowerCase();

  if (
    title.includes("missing") ||
    title.includes("quality") ||
    title.includes("complete")
  ) {
    return "Data Quality";
  }

  if (title.includes("duplicate")) {
    return "Duplicates";
  }

  if (
    title.includes("outlier") ||
    title.includes("anomal")
  ) {
    return "Anomalies";
  }

  if (
    title.includes("correlation") ||
    title.includes("relationship")
  ) {
    return "Relationships";
  }

  if (title.includes("feature")) {
    return "Features";
  }

  if (
    title.includes("variability") ||
    title.includes("standard deviation")
  ) {
    return "Statistics";
  }

  return "General";
}

function normalizePriority(priority) {
  const value = String(
    priority || "low"
  ).toLowerCase();

  if (value === "high") {
    return "high";
  }

  if (value === "medium") {
    return "medium";
  }

  return "low";
}

function getPriorityConfig(priority) {
  if (priority === "high") {
    return {
      label: "HIGH PRIORITY",
    };
  }

  if (priority === "medium") {
    return {
      label: "MEDIUM PRIORITY",
    };
  }

  return {
    label: "INFORMATIONAL",
  };
}

function formatCategory(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatMetric(value) {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value.toLocaleString(
      undefined,
      {
        maximumFractionDigits: 3,
      }
    );
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    return JSON.stringify(value);
  }

  return String(value);
}