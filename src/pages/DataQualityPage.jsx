import {
  AlertCircle,
  CheckCircle2,
  Database,
  FileWarning,
  ShieldCheck,
  Sparkles,
  Table2,
  XCircle,
} from "lucide-react";

import { useDataset } from "../context/DatasetContext";
import "../styles/data-quality.css";

export default function DataQualityPage() {
  const {
    dataset,
    analysis,
    hasDataset,
    analysisLoading,
  } = useDataset();

  if (analysisLoading) {
    return (
      <section className="quality-page">
        <div className="quality-state">
          <div className="quality-state-icon">
            <ShieldCheck size={25} />
          </div>

          <h2>Checking data quality</h2>

          <p>
            Evaluating completeness, duplicates, missing
            values, and potential anomalies...
          </p>
        </div>
      </section>
    );
  }

  if (!hasDataset || !analysis) {
    return (
      <section className="quality-page">
        <div className="quality-state">
          <div className="quality-state-icon">
            <Database size={26} />
          </div>

          <span className="quality-eyebrow">
            DATA HEALTH
          </span>

          <h2>No dataset available</h2>

          <p>
            Upload a dataset to generate a detailed data
            quality assessment.
          </p>
        </div>
      </section>
    );
  }

  const missing =
    analysis.missingValues || {};

  const duplicate =
    analysis.duplicates || {};

  const outliers =
    analysis.outliers || {};

  const qualityScore = Math.round(
    missing.completeness ?? 100
  );

  const totalMissing =
    missing.totalMissing || 0;

  const duplicateCount =
    duplicate.duplicateCount || 0;

  const outlierCount = Object.values(
    outliers
  ).reduce(
    (total, item) =>
      total + (item?.outlierCount || 0),
    0
  );

  const totalRows =
    dataset?.data?.length ||
    analysis.overview?.rowCount ||
    0;

  const totalColumns =
    dataset?.columns?.length ||
    analysis.overview?.columnCount ||
    0;

  const cleanRows = Math.max(
    totalRows - duplicateCount,
    0
  );

  const columnQuality =
    getColumnQuality(
      dataset?.data || [],
      dataset?.columns || [],
      missing
    );

  const qualityLabel =
    getQualityLabel(qualityScore);

  return (
    <section className="quality-page">
      {/* HEADER */}
      <header className="quality-header">
        <div className="quality-title-area">
          <div className="quality-title-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <span className="quality-eyebrow">
              DATA HEALTH MONITOR
            </span>

            <h2>Data Quality</h2>

            <p>
              Evaluate the reliability, completeness, and
              structural health of your dataset.
            </p>
          </div>
        </div>

        <div className="quality-dataset">
          <span className="quality-live-dot" />

          <div>
            <strong>
              {dataset?.fileName || "Current dataset"}
            </strong>

            <span>
              {totalRows.toLocaleString()} records
              {" • "}
              {totalColumns} columns
            </span>
          </div>
        </div>
      </header>

      {/* HEALTH HERO */}
      <section className="quality-health-hero">
        <div className="quality-score-section">
          <span className="quality-section-label">
            OVERALL DATA HEALTH
          </span>

          <div className="quality-score-layout">
            <div
              className="quality-score-ring"
              style={{
                "--quality-score": `${qualityScore}%`,
              }}
            >
              <div>
                <strong>
                  {qualityScore}
                </strong>

                <span>%</span>
              </div>
            </div>

            <div className="quality-score-copy">
              <div
                className={`quality-status-pill ${getQualityClass(
                  qualityScore
                )}`}
              >
                {qualityScore >= 90 ? (
                  <CheckCircle2 size={13} />
                ) : qualityScore >= 70 ? (
                  <AlertCircle size={13} />
                ) : (
                  <XCircle size={13} />
                )}

                {qualityLabel}
              </div>

              <h3>
                {getQualityMessage(
                  qualityScore
                )}
              </h3>

              <p>
                The score is primarily based on dataset
                completeness. Additional health indicators
                below show missing records, duplicates,
                and potential outliers.
              </p>
            </div>
          </div>
        </div>

        <div className="quality-health-summary">
          <HealthSummary
            icon={<Table2 size={17} />}
            label="Rows analyzed"
            value={totalRows.toLocaleString()}
            note="Records evaluated"
            type="blue"
          />

          <HealthSummary
            icon={<CheckCircle2 size={17} />}
            label="Complete rows"
            value={cleanRows.toLocaleString()}
            note="Without duplicate rows"
            type="green"
          />

          <HealthSummary
            icon={<AlertCircle size={17} />}
            label="Issues detected"
            value={(
              totalMissing +
              duplicateCount +
              outlierCount
            ).toLocaleString()}
            note="Across quality checks"
            type="orange"
          />
        </div>
      </section>

      {/* KPI GRID */}
      <div className="quality-kpi-grid">
        <QualityKpi
          icon={<FileWarning size={18} />}
          label="Missing values"
          value={totalMissing.toLocaleString()}
          description={
            totalMissing === 0
              ? "No missing values detected"
              : "Values requiring attention"
          }
          type={
            totalMissing === 0
              ? "good"
              : "warning"
          }
        />

        <QualityKpi
          icon={<CopyIcon />}
          label="Duplicate rows"
          value={duplicateCount.toLocaleString()}
          description={
            duplicateCount === 0
              ? "No duplicate records"
              : "Potential duplicate records"
          }
          type={
            duplicateCount === 0
              ? "good"
              : "warning"
          }
        />

        <QualityKpi
          icon={<AlertCircle size={18} />}
          label="Potential outliers"
          value={outlierCount.toLocaleString()}
          description={
            outlierCount === 0
              ? "No IQR outliers detected"
              : "Values outside IQR bounds"
          }
          type={
            outlierCount === 0
              ? "good"
              : "warning"
          }
        />

        <QualityKpi
          icon={<Database size={18} />}
          label="Columns checked"
          value={totalColumns}
          description="All detected features"
          type="neutral"
        />
      </div>

      {/* MAIN QUALITY GRID */}
      <div className="quality-main-grid">
        {/* COLUMN QUALITY */}
        <section className="quality-card">
          <div className="quality-card-header">
            <div>
              <span className="quality-section-label">
                COLUMN HEALTH
              </span>

              <h3>Column quality overview</h3>

              <p>
                Completeness level for each dataset column.
              </p>
            </div>

            <div className="quality-card-icon blue">
              <Database size={17} />
            </div>
          </div>

          <div className="quality-column-list">
            {columnQuality.length > 0 ? (
              columnQuality.map((column) => (
                <ColumnQualityRow
                  key={column.name}
                  column={column}
                />
              ))
            ) : (
              <div className="quality-no-data">
                No column quality information available.
              </div>
            )}
          </div>
        </section>

        {/* QUALITY BREAKDOWN */}
        <section className="quality-card">
          <div className="quality-card-header">
            <div>
              <span className="quality-section-label">
                QUALITY BREAKDOWN
              </span>

              <h3>Health indicators</h3>

              <p>
                Summary of the main quality checks.
              </p>
            </div>

            <div className="quality-card-icon green">
              <Sparkles size={17} />
            </div>
          </div>

          <div className="quality-breakdown">
            <BreakdownItem
              label="Completeness"
              value={`${qualityScore}%`}
              percentage={qualityScore}
              type="green"
              description="Non-missing data coverage"
            />

            <BreakdownItem
              label="Duplicate-free"
              value={`${getDuplicateFreePercentage(
                totalRows,
                duplicateCount
              )}%`}
              percentage={getDuplicateFreePercentage(
                totalRows,
                duplicateCount
              )}
              type="blue"
              description="Records without duplicates"
            />

            <BreakdownItem
              label="Columns analyzed"
              value={`${totalColumns}`}
              percentage={100}
              type="violet"
              description="Columns included in profiling"
            />
          </div>
        </section>
      </div>

      {/* ISSUES */}
      <section className="quality-card quality-issues-card">
        <div className="quality-card-header">
          <div>
            <span className="quality-section-label">
              QUALITY REVIEW
            </span>

            <h3>Detected issues</h3>

            <p>
              Items that may require attention before
              further analysis.
            </p>
          </div>

          <div className="quality-issue-count">
            {getIssueCount(
              totalMissing,
              duplicateCount,
              outlierCount
            )}
          </div>
        </div>

        <div className="quality-issue-list">
          <QualityIssue
            icon={<FileWarning size={16} />}
            title="Missing values"
            value={totalMissing}
            description={
              totalMissing > 0
                ? "Some fields contain missing values."
                : "No missing values were detected."
            }
            positive={totalMissing === 0}
          />

          <QualityIssue
            icon={<Database size={16} />}
            title="Duplicate records"
            value={duplicateCount}
            description={
              duplicateCount > 0
                ? "Potential duplicate rows were identified."
                : "No duplicate rows were detected."
            }
            positive={duplicateCount === 0}
          />

          <QualityIssue
            icon={<AlertCircle size={16} />}
            title="Potential outliers"
            value={outlierCount}
            description={
              outlierCount > 0
                ? "Some numeric values fall outside IQR boundaries."
                : "No IQR-based outliers were detected."
            }
            positive={outlierCount === 0}
          />
        </div>
      </section>
    </section>
  );
}

function HealthSummary({
  icon,
  label,
  value,
  note,
  type,
}) {
  return (
    <div className="quality-health-summary-item">
      <div
        className={`quality-summary-icon ${type}`}
      >
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

function QualityKpi({
  icon,
  label,
  value,
  description,
  type,
}) {
  return (
    <div className="quality-kpi">
      <div
        className={`quality-kpi-icon ${type}`}
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

function ColumnQualityRow({
  column,
}) {
  const percentage =
    column.completeness;

  return (
    <div className="quality-column-row">
      <div className="quality-column-info">
        <strong title={column.name}>
          {column.name}
        </strong>

        <span>
          {column.type}
        </span>
      </div>

      <div className="quality-column-progress">
        <div>
          <span>
            {percentage}%
          </span>
        </div>

        <div className="quality-progress-track">
          <span
            className={getQualityBarClass(
              percentage
            )}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      <div
        className={`quality-column-status ${getQualityClass(
          percentage
        )}`}
      >
        {percentage >= 95
          ? "Healthy"
          : percentage >= 80
          ? "Review"
          : "Attention"}
      </div>
    </div>
  );
}

function BreakdownItem({
  label,
  value,
  percentage,
  type,
  description,
}) {
  return (
    <div className="quality-breakdown-item">
      <div className="quality-breakdown-top">
        <div>
          <strong>{label}</strong>
          <span>{description}</span>
        </div>

        <b>{value}</b>
      </div>

      <div className="quality-breakdown-track">
        <span
          className={type}
          style={{
            width: `${Math.min(
              percentage,
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function QualityIssue({
  icon,
  title,
  value,
  description,
  positive,
}) {
  return (
    <div
      className={`quality-issue ${
        positive
          ? "positive"
          : "attention"
      }`}
    >
      <div className="quality-issue-icon">
        {positive ? (
          <CheckCircle2 size={16} />
        ) : (
          icon
        )}
      </div>

      <div className="quality-issue-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <b>{value.toLocaleString()}</b>
    </div>
  );
}

function getColumnQuality(
  data,
  columns,
  missing
) {
  return columns.map((column) => {
    const values = data.map(
      (row) => row[column]
    );

    const missingCount = values.filter(
      (value) =>
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ).length;

    const completeness =
      values.length > 0
        ? Math.round(
            ((values.length -
              missingCount) /
              values.length) *
              100
          )
        : 100;

    const type =
      missing?.columns?.find(
        (item) =>
          item.column === column
      )?.type ||
      "column";

    return {
      name: column,
      type,
      completeness,
      missingCount,
    };
  });
}

function getQualityLabel(score) {
  if (score >= 95) {
    return "Excellent";
  }

  if (score >= 85) {
    return "Good";
  }

  if (score >= 70) {
    return "Needs review";
  }

  return "Needs attention";
}

function getQualityMessage(score) {
  if (score >= 95) {
    return "Your dataset has strong overall completeness.";
  }

  if (score >= 85) {
    return "Your dataset is generally ready for analysis.";
  }

  if (score >= 70) {
    return "Some data-quality improvements may be useful.";
  }

  return "The dataset contains quality issues that deserve attention.";
}

function getQualityClass(score) {
  if (score >= 90) {
    return "good";
  }

  if (score >= 70) {
    return "warning";
  }

  return "critical";
}

function getQualityBarClass(score) {
  if (score >= 90) {
    return "good";
  }

  if (score >= 70) {
    return "warning";
  }

  return "critical";
}

function getDuplicateFreePercentage(
  rows,
  duplicates
) {
  if (!rows) {
    return 100;
  }

  return Math.round(
    ((rows - duplicates) /
      rows) *
      100
  );
}

function getIssueCount(
  missing,
  duplicates,
  outliers
) {
  let count = 0;

  if (missing > 0) count += 1;
  if (duplicates > 0) count += 1;
  if (outliers > 0) count += 1;

  return count;
}

function CopyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        width="13"
        height="13"
        x="9"
        y="9"
        rx="2"
      />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}