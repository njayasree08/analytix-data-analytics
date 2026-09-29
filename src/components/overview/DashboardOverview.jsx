import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  FileWarning,
  Hash,
  Rows3,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import useAnalysis from "../../hooks/useAnalysis";
import "../../styles/dashboard.css";

export default function DashboardOverview() {
  const {
    dataset,
    analysis,
    loading,
    error,
    hasDataset,
    summary,
  } = useAnalysis();

  if (loading) {
    return (
      <section className="dashboard-page">
        <div className="dashboard-state-card">
          <div className="dashboard-state-icon loading">
            <Activity size={24} />
          </div>

          <h2>Analyzing dataset</h2>

          <p>
            Profiling your data and preparing the analytics
            dashboard...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard-page">
        <div className="dashboard-state-card dashboard-state-error">
          <div className="dashboard-state-icon error">
            <AlertTriangle size={24} />
          </div>

          <h2>Analysis could not be completed</h2>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!hasDataset) {
    return (
      <section className="dashboard-page">
        <div className="dashboard-empty-hero">
          <div className="dashboard-empty-content">
            <div className="dashboard-empty-icon">
              <Sparkles size={25} />
            </div>

            <span className="dashboard-eyebrow">
              INTELLIGENT DATA ANALYTICS
            </span>

            <h2>
              Turn your dataset into
              <span> meaningful insights.</span>
            </h2>

            <p>
              Upload a CSV or Excel dataset to automatically
              analyze data quality, statistics, relationships,
              anomalies, and important features.
            </p>

            <div className="dashboard-empty-points">
              <span>
                <CheckCircle2 size={15} />
                Automatic profiling
              </span>

              <span>
                <CheckCircle2 size={15} />
                Data quality analysis
              </span>

              <span>
                <CheckCircle2 size={15} />
                Smart insights
              </span>
            </div>
          </div>

          <div className="dashboard-empty-visual">
            <div className="dashboard-mini-chart">
              <span style={{ height: "35%" }} />
              <span style={{ height: "55%" }} />
              <span style={{ height: "42%" }} />
              <span style={{ height: "78%" }} />
              <span style={{ height: "65%" }} />
              <span style={{ height: "90%" }} />
            </div>

            <div className="dashboard-mini-line">
              <div />
              <div />
              <div />
              <div />
            </div>

            <div className="dashboard-empty-floating">
              <TrendingUp size={15} />
              <div>
                <strong>Smart Analysis</strong>
                <span>Ready when you upload</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-feature-grid">
          <DashboardFeature
            icon={<Database size={18} />}
            title="Automatic profiling"
            description="Identify column types and understand your dataset structure."
          />

          <DashboardFeature
            icon={<BarChart3 size={18} />}
            title="Statistical analysis"
            description="Calculate descriptive statistics for numeric features."
          />

          <DashboardFeature
            icon={<CheckCircle2 size={18} />}
            title="Data quality"
            description="Detect missing values, duplicates, and potential outliers."
          />

          <DashboardFeature
            icon={<TrendingUp size={18} />}
            title="Smart insights"
            description="Generate data-backed findings from your uploaded data."
          />
        </div>
      </section>
    );
  }

  const qualityScore = Math.round(
    summary.completeness ?? 100
  );

  const insightCount =
    analysis?.insights?.length || 0;

  const highPriorityInsights =
    analysis?.insights?.filter(
      (item) => item.priority === "high"
    ).length || 0;

  const outlierValues =
    summary.outlierValues || 0;

  const otherColumns = Math.max(
    summary.columns -
      summary.numericColumns -
      summary.categoricalColumns -
      summary.dateColumns,
    0
  );

  return (
    <section className="dashboard-page">
      {/* PAGE HEADER */}

      <div className="dashboard-page-header">
        <div className="dashboard-header-copy">
          <span className="dashboard-eyebrow">
            ANALYTICS OVERVIEW
          </span>

          <h2>Dataset Dashboard</h2>

          <p>
            Monitor your dataset structure, quality,
            statistics, and automatically generated insights.
          </p>
        </div>

        <div className="dashboard-dataset-status">
          <div className="dashboard-status-dot" />

          <div>
            <strong>Dataset analyzed</strong>

            <span>
              {dataset?.fileName || "Current dataset"}
            </span>
          </div>
        </div>
      </div>

      {/* HERO */}

      <div className="dashboard-main-hero">
        <div className="dashboard-main-hero-content">
          <div className="dashboard-hero-top">
            <div className="dashboard-hero-icon">
              <Sparkles size={20} />
            </div>

            <span>DATA INTELLIGENCE</span>
          </div>

          <h2>
            Your data is ready
            <span> for exploration.</span>
          </h2>

          <p>
            Your dataset has been automatically profiled.
            Explore quality, statistics, features,
            visualizations, and insights from the workspace.
          </p>

          <div className="dashboard-file-info">
            <div className="dashboard-file-icon">
              <FileWarning size={17} />
            </div>

            <div>
              <strong>
                {dataset?.fileName || "Dataset"}
              </strong>

              <span>
                {summary.rows.toLocaleString()} rows
                <b>•</b>
                {summary.columns} columns
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-hero-visual">
          <div className="dashboard-orbit dashboard-orbit-one" />
          <div className="dashboard-orbit dashboard-orbit-two" />

          <div className="dashboard-visual-core">
            <Activity size={30} />
          </div>

          <div className="dashboard-floating-card dashboard-floating-one">
            <CheckCircle2 size={15} />

            <div>
              <strong>{qualityScore}%</strong>
              <span>Completeness</span>
            </div>
          </div>

          <div className="dashboard-floating-card dashboard-floating-two">
            <BarChart3 size={15} />

            <div>
              <strong>{summary.numericColumns}</strong>
              <span>Numeric features</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI SECTION */}

      <div className="dashboard-section-heading">
        <div>
          <span>DATASET SNAPSHOT</span>
          <h3>Key metrics</h3>
        </div>

        <p>
          Automatically calculated from your uploaded dataset.
        </p>
      </div>

      <div className="dashboard-kpi-grid">
        <DashboardKpi
          icon={<Rows3 size={19} />}
          label="Total Rows"
          value={summary.rows.toLocaleString()}
          description="Records analyzed"
          className="blue"
        />

        <DashboardKpi
          icon={<Hash size={19} />}
          label="Total Columns"
          value={summary.columns}
          description="Detected features"
          className="violet"
        />

        <DashboardKpi
          icon={<BarChart3 size={19} />}
          label="Numeric Features"
          value={summary.numericColumns}
          description="Quantitative columns"
          className="cyan"
        />

        <DashboardKpi
          icon={<Database size={19} />}
          label="Categorical"
          value={summary.categoricalColumns}
          description="Categorical columns"
          className="orange"
        />

        <DashboardKpi
          icon={<CheckCircle2 size={19} />}
          label="Data Quality"
          value={`${qualityScore}%`}
          description="Completeness score"
          className="green"
        />

        <DashboardKpi
          icon={<AlertTriangle size={19} />}
          label="Outliers"
          value={outlierValues.toLocaleString()}
          description="Potential unusual values"
          className="red"
        />
      </div>

      {/* ANALYTICS GRID */}

      <div className="dashboard-section-heading dashboard-section-heading-spaced">
        <div>
          <span>DATA ANALYSIS</span>
          <h3>Dataset health & structure</h3>
        </div>

        <p>
          A quick view of the most important dataset characteristics.
        </p>
      </div>

      <div className="dashboard-main-grid">
        {/* DATA HEALTH */}

        <section className="dashboard-card dashboard-health-card">
          <div className="dashboard-card-header">
            <div>
              <span className="dashboard-section-label">
                DATA HEALTH
              </span>

              <h3>Dataset quality</h3>

              <p>
                Overall completeness and quality indicators.
              </p>
            </div>

            <div className="dashboard-card-icon green">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="dashboard-health-layout">
            <div className="dashboard-quality-ring">
              <div>
                <strong>{qualityScore}%</strong>
                <span>Complete</span>
              </div>
            </div>

            <div className="dashboard-health-metrics">
              <HealthMetric
                label="Missing values"
                value={summary.missingValues.toLocaleString()}
                status={
                  summary.missingValues === 0
                    ? "Healthy"
                    : "Review"
                }
              />

              <HealthMetric
                label="Duplicate rows"
                value={summary.duplicateRows.toLocaleString()}
                status={
                  summary.duplicateRows === 0
                    ? "Healthy"
                    : "Review"
                }
              />

              <HealthMetric
                label="Potential outliers"
                value={outlierValues.toLocaleString()}
                status={
                  outlierValues === 0
                    ? "Healthy"
                    : "Detected"
                }
              />
            </div>
          </div>
        </section>

        {/* DATA STRUCTURE */}

        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <span className="dashboard-section-label">
                DATA STRUCTURE
              </span>

              <h3>Feature composition</h3>

              <p>
                Automatically classified column types.
              </p>
            </div>

            <div className="dashboard-card-icon blue">
              <Database size={18} />
            </div>
          </div>

          <div className="dashboard-composition">
            <CompositionRow
              label="Numeric"
              value={summary.numericColumns}
              total={summary.columns}
              type="numeric"
            />

            <CompositionRow
              label="Categorical"
              value={summary.categoricalColumns}
              total={summary.columns}
              type="categorical"
            />

            <CompositionRow
              label="Date"
              value={summary.dateColumns}
              total={summary.columns}
              type="date"
            />

            <CompositionRow
              label="Other"
              value={otherColumns}
              total={summary.columns}
              type="other"
            />
          </div>
        </section>
      </div>

      {/* INSIGHTS + COVERAGE */}

      <div className="dashboard-section-heading dashboard-section-heading-spaced">
        <div>
          <span>INTELLIGENT ANALYSIS</span>
          <h3>Insights & analysis coverage</h3>
        </div>

        <p>
          Findings and analysis modules generated for this dataset.
        </p>
      </div>

      <div className="dashboard-bottom-grid">
        {/* INSIGHTS */}

        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <span className="dashboard-section-label">
                GENERATED INSIGHTS
              </span>

              <h3>Data findings</h3>

              <p>
                Findings automatically generated from your data.
              </p>
            </div>

            <div className="dashboard-insight-count">
              {insightCount}
            </div>
          </div>

          <div className="dashboard-insight-summary">
            <div>
              <span>Total insights</span>
              <strong>{insightCount}</strong>
            </div>

            <div>
              <span>High priority</span>
              <strong>{highPriorityInsights}</strong>
            </div>

            <div>
              <span>Data quality</span>
              <strong>{qualityScore}%</strong>
            </div>
          </div>

          {analysis?.insights?.length > 0 ? (
            <div className="dashboard-insight-list">
              {analysis.insights
                .slice(0, 3)
                .map((insight, index) => (
                  <div
                    className="dashboard-insight-item"
                    key={`${insight.title || "insight"}-${index}`}
                  >
                    <div className="dashboard-insight-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <strong>
                        {insight.title ||
                          "Dataset insight"}
                      </strong>

                      <p>
                        {insight.description ||
                          "An analytical observation was generated from the dataset."}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="dashboard-no-insights">
              <Sparkles size={18} />

              <span>
                No additional insights were generated for
                this dataset.
              </span>
            </div>
          )}
        </section>

        {/* ANALYSIS COVERAGE */}

        <section className="dashboard-card dashboard-quick-card">
          <div className="dashboard-card-header">
            <div>
              <span className="dashboard-section-label">
                ANALYTICS WORKSPACE
              </span>

              <h3>Analysis coverage</h3>

              <p>
                Available analysis areas for this dataset.
              </p>
            </div>

            <div className="dashboard-card-icon violet">
              <Activity size={18} />
            </div>
          </div>

          <div className="dashboard-coverage-list">
            <CoverageRow
              label="Data profiling"
              value="Complete"
              icon={<Database size={15} />}
            />

            <CoverageRow
              label="Statistics"
              value={`${summary.numericColumns} features`}
              icon={<BarChart3 size={15} />}
            />

            <CoverageRow
              label="Quality analysis"
              value={`${qualityScore}%`}
              icon={<CheckCircle2 size={15} />}
            />

            <CoverageRow
              label="Insight generation"
              value={`${insightCount} findings`}
              icon={<Sparkles size={15} />}
            />
          </div>
        </section>
      </div>
    </section>
  );
}

function DashboardKpi({
  icon,
  label,
  value,
  description,
  className,
}) {
  return (
    <div className="dashboard-kpi-card">
      <div className={`dashboard-kpi-icon ${className}`}>
        {icon}
      </div>

      <div className="dashboard-kpi-content">
        <span>{label}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>
    </div>
  );
}

function HealthMetric({
  label,
  value,
  status,
}) {
  return (
    <div className="dashboard-health-metric">
      <div>
        <span>{label}</span>

        <strong>{value}</strong>
      </div>

      <small
        className={
          status === "Healthy"
            ? "healthy"
            : "attention"
        }
      >
        {status}
      </small>
    </div>
  );
}

function CompositionRow({
  label,
  value,
  total,
  type,
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div className="dashboard-composition-row">
      <div className="dashboard-composition-top">
        <div>
          <span
            className={`dashboard-composition-dot ${type}`}
          />

          <strong>{label}</strong>
        </div>

        <span>
          {value} · {percentage}%
        </span>
      </div>

      <div className="dashboard-composition-bar">
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

function DashboardFeature({
  icon,
  title,
  description,
}) {
  return (
    <div className="dashboard-feature-card">
      <div className="dashboard-feature-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>
    </div>
  );
}

function CoverageRow({
  label,
  value,
  icon,
}) {
  return (
    <div className="dashboard-coverage-row">
      <div className="dashboard-coverage-icon">
        {icon}
      </div>

      <div>
        <strong>{label}</strong>

        <span>{value}</span>
      </div>

      <CheckCircle2
        size={15}
        className="dashboard-coverage-check"
      />
    </div>
  );
}