import {
  BarChart3,
  Calculator,
  Database,
  FileSpreadsheet,
  Hash,
  Sigma,
  TrendingUp,
} from "lucide-react";

import { useDataset } from "../context/DatasetContext";
import "../styles/statistics.css";

export default function StatisticsPage() {
  const {
    dataset,
    analysis,
    hasDataset,
    analysisLoading,
  } = useDataset();

  if (analysisLoading) {
    return (
      <section className="statistics-page">
        <div className="statistics-state">
          <div className="statistics-state-icon">
            <Calculator size={26} />
          </div>

          <h2>Calculating statistics</h2>

          <p>
            Computing descriptive statistics for the
            numeric columns in your dataset...
          </p>
        </div>
      </section>
    );
  }

  if (!hasDataset || !analysis) {
    return (
      <section className="statistics-page">
        <div className="statistics-state">
          <div className="statistics-state-icon">
            <BarChart3 size={26} />
          </div>

          <span className="statistics-eyebrow">
            STATISTICAL ANALYSIS
          </span>

          <h2>No dataset available</h2>

          <p>
            Upload a dataset to calculate descriptive
            statistics and numerical distributions.
          </p>
        </div>
      </section>
    );
  }

  const statistics =
    analysis.statistics || {};

  const numericColumns =
    analysis.numericColumns || [];

  const statisticEntries =
    Object.entries(statistics);

  const overview =
    analysis.overview || {};

  const averageMean =
    getAverage(
      statisticEntries.map(
        ([, item]) => item?.mean
      )
    );

  const averageMedian =
    getAverage(
      statisticEntries.map(
        ([, item]) => item?.median
      )
    );

  const averageStd =
    getAverage(
      statisticEntries.map(
        ([, item]) =>
          item?.standardDeviation
      )
    );

  const totalNumericColumns =
    numericColumns.length;

  return (
    <section className="statistics-page">
      {/* HEADER */}
      <header className="statistics-header">
        <div className="statistics-heading">
          <div className="statistics-title-icon">
            <Calculator size={22} />
          </div>

          <div>
            <span className="statistics-eyebrow">
              STATISTICAL ANALYSIS
            </span>

            <h2>Statistics</h2>

            <p>
              Understand the numerical characteristics
              and distribution of your dataset.
            </p>
          </div>
        </div>

        <div className="statistics-dataset-badge">
          <FileSpreadsheet size={16} />

          <div>
            <strong>
              {dataset.fileName}
            </strong>

            <span>
              {overview.rowCount?.toLocaleString() ||
                0}{" "}
              rows · {overview.columnCount || 0}{" "}
              columns
            </span>
          </div>
        </div>
      </header>

      {/* TOP SUMMARY */}
      <section className="statistics-summary">
        <div className="statistics-summary-intro">
          <span className="statistics-section-label">
            NUMERICAL OVERVIEW
          </span>

          <h3>
            Descriptive statistics
          </h3>

          <p>
            Automatically calculated measures for the
            numeric features detected in your dataset.
          </p>
        </div>

        <div className="statistics-summary-grid">
          <SummaryMetric
            icon={<Hash size={17} />}
            label="Numeric features"
            value={totalNumericColumns}
            description="Columns analyzed"
            type="blue"
          />

          <SummaryMetric
            icon={<Sigma size={17} />}
            label="Average mean"
            value={formatNumber(
              averageMean
            )}
            description="Across numeric features"
            type="violet"
          />

          <SummaryMetric
            icon={<TrendingUp size={17} />}
            label="Average median"
            value={formatNumber(
              averageMedian
            )}
            description="Across numeric features"
            type="green"
          />

          <SummaryMetric
            icon={<BarChart3 size={17} />}
            label="Average std. dev."
            value={formatNumber(
              averageStd
            )}
            description="Measure of spread"
            type="orange"
          />
        </div>
      </section>

      {/* MAIN STATISTICS TABLE */}
      <section className="statistics-card">
        <div className="statistics-card-header">
          <div>
            <span className="statistics-section-label">
              DESCRIPTIVE TABLE
            </span>

            <h3>
              Numerical feature statistics
            </h3>

            <p>
              Detailed statistical measures for every
              numeric column.
            </p>
          </div>

          <div className="statistics-card-icon">
            <TableIcon />
          </div>
        </div>

        {statisticEntries.length > 0 ? (
          <div className="statistics-table-wrapper">
            <table className="statistics-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Count</th>
                  <th>Mean</th>
                  <th>Median</th>
                  <th>Std. Dev.</th>
                  <th>Variance</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Range</th>
                  <th>Q1</th>
                  <th>Q3</th>
                  <th>IQR</th>
                </tr>
              </thead>

              <tbody>
                {statisticEntries.map(
                  ([column, stats]) => (
                    <tr key={column}>
                      <td>
                        <div className="statistics-feature">
                          <span className="statistics-feature-icon">
                            <Hash size={12} />
                          </span>

                          <strong
                            title={column}
                          >
                            {column}
                          </strong>
                        </div>
                      </td>

                      <td>
                        {formatNumber(
                          stats?.count
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.mean
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.median
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.standardDeviation
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.variance
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.min
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.max
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.range
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.q1
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.q3
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          stats?.iqr
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="statistics-no-numeric">
            <Hash size={22} />

            <strong>
              No numeric columns detected
            </strong>

            <span>
              Statistical calculations require at least
              one numeric feature.
            </span>
          </div>
        )}
      </section>

      {/* FEATURE STATISTICS */}
      {statisticEntries.length > 0 && (
        <section className="statistics-feature-section">
          <div className="statistics-section-heading">
            <div>
              <span className="statistics-section-label">
                FEATURE DETAILS
              </span>

              <h3>
                Statistical profile by feature
              </h3>

              <p>
                Inspect the central tendency and spread
                of each numeric variable.
              </p>
            </div>
          </div>

          <div className="statistics-feature-grid">
            {statisticEntries.map(
              ([column, stats]) => (
                <FeatureStatisticsCard
                  key={column}
                  column={column}
                  stats={stats}
                />
              )
            )}
          </div>
        </section>
      )}
    </section>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
  description,
  type,
}) {
  return (
    <div className="statistics-summary-metric">
      <div
        className={`statistics-summary-icon ${type}`}
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

function FeatureStatisticsCard({
  column,
  stats,
}) {
  const min = Number(stats?.min);
  const max = Number(stats?.max);
  const mean = Number(stats?.mean);
  const median = Number(stats?.median);

  const range =
    Number.isFinite(min) &&
    Number.isFinite(max)
      ? max - min
      : 0;

  const meanPosition =
    range > 0
      ? ((mean - min) / range) * 100
      : 50;

  const medianPosition =
    range > 0
      ? ((median - min) / range) * 100
      : 50;

  return (
    <article className="statistics-feature-card">
      <div className="statistics-feature-card-header">
        <div className="statistics-feature-card-icon">
          <Hash size={15} />
        </div>

        <div>
          <strong title={column}>
            {column}
          </strong>

          <span>
            Numeric feature
          </span>
        </div>
      </div>

      <div className="statistics-central">
        <div>
          <span>Mean</span>
          <strong>
            {formatNumber(stats?.mean)}
          </strong>
        </div>

        <div>
          <span>Median</span>
          <strong>
            {formatNumber(stats?.median)}
          </strong>
        </div>
      </div>

      <div className="statistics-distribution">
        <div className="statistics-distribution-header">
          <span>Value distribution</span>

          <small>
            {formatNumber(stats?.min)} –{" "}
            {formatNumber(stats?.max)}
          </small>
        </div>

        <div className="statistics-range">
          <div className="statistics-range-line" />

          <span
            className="statistics-marker mean"
            style={{
              left: `${clamp(
                meanPosition
              )}%`,
            }}
            title="Mean"
          />

          <span
            className="statistics-marker median"
            style={{
              left: `${clamp(
                medianPosition
              )}%`,
            }}
            title="Median"
          />
        </div>

        <div className="statistics-range-labels">
          <span>Min</span>
          <span>Max</span>
        </div>

        <div className="statistics-legend">
          <span>
            <i className="mean-dot" />
            Mean
          </span>

          <span>
            <i className="median-dot" />
            Median
          </span>
        </div>
      </div>

      <div className="statistics-mini-grid">
        <MiniStatistic
          label="Std. Dev."
          value={stats?.standardDeviation}
        />

        <MiniStatistic
          label="Variance"
          value={stats?.variance}
        />

        <MiniStatistic
          label="Q1"
          value={stats?.q1}
        />

        <MiniStatistic
          label="Q3"
          value={stats?.q3}
        />

        <MiniStatistic
          label="IQR"
          value={stats?.iqr}
        />

        <MiniStatistic
          label="Range"
          value={stats?.range}
        />
      </div>
    </article>
  );
}

function MiniStatistic({
  label,
  value,
}) {
  return (
    <div className="statistics-mini">
      <span>{label}</span>

      <strong>
        {formatNumber(value)}
      </strong>
    </div>
  );
}

function getAverage(values) {
  const valid = values.filter(
    (value) =>
      typeof value === "number" &&
      Number.isFinite(value)
  );

  if (!valid.length) {
    return 0;
  }

  return (
    valid.reduce(
      (sum, value) => sum + value,
      0
    ) / valid.length
  );
}

function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  if (Number.isInteger(number)) {
    return number.toLocaleString();
  }

  return number.toLocaleString(
    undefined,
    {
      maximumFractionDigits: 3,
    }
  );
}

function clamp(value) {
  return Math.max(
    0,
    Math.min(100, value)
  );
}

function TableIcon() {
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
      <rect
        width="18"
        height="18"
        x="3"
        y="3"
        rx="2"
      />

      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}