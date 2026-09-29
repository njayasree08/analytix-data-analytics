import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Hash,
  Rows3,
  ShieldCheck,
  Sparkles,
  Table2,
  TrendingUp,
  Type,
} from "lucide-react";

export default function AnalyticsDashboard({ dataset }) {
  if (!dataset) {
    return (
      <section className="dashboard-state">
        <div className="state-icon">
          <FileSpreadsheet size={26} />
        </div>

        <span className="state-label">
          INTELLIGENT DATA ANALYTICS
        </span>

        <h2>Upload a dataset to begin</h2>

        <p>
          Upload a CSV, XLSX, or XLS file and DataSphere will
          automatically profile your data, identify data types,
          evaluate quality, calculate statistics, and generate
          useful insights.
        </p>
      </section>
    );
  }

  const rows = dataset.rowCount || dataset.data?.length || 0;
  const columns =
    dataset.columnCount || dataset.columns?.length || 0;

  const columnNames = dataset.columns || [];

  const numericColumns = columnNames.filter((column) => {
    const values = dataset.data
      .map((row) => row[column])
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== ""
      );

    if (!values.length) return false;

    return values.every(
      (value) =>
        typeof value === "number" &&
        Number.isFinite(value)
    );
  });

  const dateColumns = columnNames.filter((column) => {
    const values = dataset.data
      .map((row) => row[column])
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== ""
      )
      .slice(0, 50);

    if (!values.length) return false;

    return values.filter((value) => {
      if (value instanceof Date) return true;

      if (typeof value !== "string") return false;

      const parsed = Date.parse(value);

      return !Number.isNaN(parsed);
    }).length >= Math.max(1, values.length * 0.8);
  });

  const categoricalColumns = columnNames.filter(
    (column) =>
      !numericColumns.includes(column) &&
      !dateColumns.includes(column)
  );

  const missingCells = columnNames.reduce(
    (total, column) => {
      return (
        total +
        dataset.data.filter((row) => {
          const value = row[column];

          return (
            value === null ||
            value === undefined ||
            value === ""
          );
        }).length
      );
    },
    0
  );

  const totalCells = rows * columns;

  const completeness =
    totalCells > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((totalCells - missingCells) / totalCells) * 100
          )
        )
      : 100;

  const missingPercentage =
    totalCells > 0
      ? (missingCells / totalCells) * 100
      : 0;

  const qualityLevel =
    completeness >= 95
      ? "Excellent"
      : completeness >= 85
        ? "Good"
        : completeness >= 70
          ? "Fair"
          : "Needs attention";

  const typeCounts = [
    {
      label: "Numeric",
      value: numericColumns.length,
      type: "numeric",
    },
    {
      label: "Categorical",
      value: categoricalColumns.length,
      type: "categorical",
    },
    {
      label: "Date",
      value: dateColumns.length,
      type: "date",
    },
  ];

  const importantNumericFeatures = numericColumns
    .map((column) => {
      const values = dataset.data
        .map((row) => Number(row[column]))
        .filter((value) => Number.isFinite(value));

      if (!values.length) {
        return null;
      }

      const mean =
        values.reduce((sum, value) => sum + value, 0) /
        values.length;

      const variance =
        values.reduce(
          (sum, value) =>
            sum + Math.pow(value - mean, 2),
          0
        ) / values.length;

      const standardDeviation = Math.sqrt(variance);

      return {
        column,
        standardDeviation,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        b.standardDeviation -
        a.standardDeviation
    )
    .slice(0, 5);

  const maximumStandardDeviation =
    importantNumericFeatures.length > 0
      ? Math.max(
          ...importantNumericFeatures.map(
            (item) => item.standardDeviation
          )
        )
      : 1;

  return (
    <section className="dashboard">
      {/* DATASET HEADER */}

      <div className="dataset-header">
        <div className="dataset-title">
          <div className="dataset-file-icon">
            <FileSpreadsheet size={21} />
          </div>

          <div>
            <span className="dataset-label">
              ACTIVE DATASET
            </span>

            <h2 title={dataset.fileName}>
              {dataset.fileName}
            </h2>

            <p>
              {rows.toLocaleString()} rows • {columns} columns
            </p>
          </div>
        </div>

        <div className="dataset-status">
          <span className="status-dot" />
          Dataset analyzed
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="dashboard-kpis">
        <KpiCard
          icon={Rows3}
          title="Total Rows"
          value={rows.toLocaleString()}
          description="Records detected"
        />

        <KpiCard
          icon={Table2}
          title="Total Columns"
          value={columns.toLocaleString()}
          description="Features detected"
        />

        <KpiCard
          icon={Hash}
          title="Numeric Features"
          value={numericColumns.length}
          description="Quantitative columns"
        />

        <KpiCard
          icon={ShieldCheck}
          title="Data Quality"
          value={`${completeness.toFixed(1)}%`}
          description={qualityLevel}
          variant={
            completeness >= 85
              ? "positive"
              : completeness >= 70
                ? "warning"
                : "danger"
          }
        />

        <KpiCard
          icon={AlertTriangle}
          title="Missing Cells"
          value={missingCells.toLocaleString()}
          description={`${missingPercentage.toFixed(1)}% of dataset`}
          variant={
            missingCells === 0
              ? "positive"
              : "warning"
          }
        />
      </div>

      {/* MAIN ANALYSIS */}

      <div className="dashboard-main-grid">
        {/* DATA QUALITY */}

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>Data Quality Overview</h3>
              <p>
                Completeness and missing-value assessment
              </p>
            </div>

            <div className="card-header-icon">
              <ShieldCheck size={15} />
            </div>
          </div>

          <div className="quality-content">
            <div
              className="quality-circle"
              style={{
                "--quality": `${completeness * 3.6}deg`,
              }}
            >
              <div>
                <strong>
                  {completeness.toFixed(0)}%
                </strong>

                <span>Complete</span>
              </div>
            </div>

            <div className="quality-details">
              <QualityRow
                label="Complete cells"
                value={`${(
                  totalCells - missingCells
                ).toLocaleString()}`}
              />

              <QualityRow
                label="Missing cells"
                value={missingCells.toLocaleString()}
              />

              <QualityRow
                label="Missing percentage"
                value={`${missingPercentage.toFixed(1)}%`}
              />

              <QualityRow
                label="Quality status"
                value={qualityLevel}
              />
            </div>
          </div>
        </div>

        {/* COLUMN TYPES */}

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>Column Type Distribution</h3>
              <p>
                Automatically detected data categories
              </p>
            </div>

            <div className="card-header-icon">
              <Database size={15} />
            </div>
          </div>

          <div className="type-list">
            {typeCounts.map((item) => (
              <div
                className="type-row"
                key={item.label}
              >
                <div className="type-name">
                  <span
                    className={`type-dot ${item.type}`}
                  />

                  {item.label}
                </div>

                <strong>{item.value}</strong>
              </div>
            ))}

            <div className="type-row">
              <div className="type-name">
                <span className="type-dot text" />
                Other / Text
              </div>

              <strong>
                {Math.max(
                  0,
                  columns -
                    numericColumns.length -
                    dateColumns.length -
                    categoricalColumns.length
                )}
              </strong>
            </div>
          </div>
        </div>

        {/* DATA STRUCTURE */}

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>Dataset Structure</h3>
              <p>
                High-level overview of your dataset
              </p>
            </div>

            <div className="card-header-icon">
              <Activity size={15} />
            </div>
          </div>

          <div className="structure-grid">
            <StructureItem
              icon={Rows3}
              label="Rows"
              value={rows.toLocaleString()}
            />

            <StructureItem
              icon={Table2}
              label="Columns"
              value={columns}
            />

            <StructureItem
              icon={Hash}
              label="Numeric"
              value={numericColumns.length}
            />

            <StructureItem
              icon={Type}
              label="Categorical"
              value={categoricalColumns.length}
            />

            <StructureItem
              icon={TrendingUp}
              label="Date"
              value={dateColumns.length}
            />

            <StructureItem
              icon={CheckCircle2}
              label="Complete"
              value={`${completeness.toFixed(0)}%`}
            />
          </div>
        </div>

        {/* QUICK STATISTICS */}

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>Quick Statistics</h3>
              <p>
                Highest-variation numeric features
              </p>
            </div>

            <div className="card-header-icon">
              <BarChart3 size={15} />
            </div>
          </div>

          {importantNumericFeatures.length === 0 ? (
            <div className="card-empty">
              <Hash size={15} />
              No numeric columns detected
            </div>
          ) : (
            <div className="statistics-list">
              {importantNumericFeatures
                .slice(0, 4)
                .map((item) => (
                  <div
                    className="statistics-row"
                    key={item.column}
                  >
                    <div className="statistics-name">
                      <strong title={item.column}>
                        {item.column}
                      </strong>

                      <span>
                        Standard deviation
                      </span>
                    </div>

                    <div className="stat-range">
                      <span>
                        {item.standardDeviation.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* IMPORTANT FEATURES */}

      <div className="dashboard-card correlation-card">
        <div className="dashboard-card-header">
          <div>
            <h3>Important Numeric Features</h3>

            <p>
              Features with the highest statistical variation
            </p>
          </div>

          <div className="card-header-icon">
            <Sparkles size={15} />
          </div>
        </div>

        {importantNumericFeatures.length === 0 ? (
          <div className="card-empty">
            No numeric features available for analysis.
          </div>
        ) : (
          <div className="feature-ranking">
            {importantNumericFeatures.map(
              (item, index) => {
                const percentage =
                  maximumStandardDeviation > 0
                    ? (item.standardDeviation /
                        maximumStandardDeviation) *
                      100
                    : 0;

                return (
                  <div
                    className="feature-ranking-row"
                    key={item.column}
                  >
                    <div className="feature-rank">
                      {index + 1}
                    </div>

                    <div className="feature-info">
                      <strong title={item.column}>
                        {item.column}
                      </strong>

                      <span>
                        Standard deviation
                      </span>
                    </div>

                    <div className="feature-bar">
                      <span
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="feature-value">
                      {item.standardDeviation.toFixed(2)}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* ANALYSIS NOTE */}

      <div className="analysis-note">
        <div className="analysis-note-icon">
          <Sparkles size={13} />
        </div>

        <div>
          <strong>
            Automatic analysis
          </strong>

          <p>
            The dashboard currently uses the uploaded
            dataset directly in the browser. Statistical
            summaries and data-quality indicators are
            calculated dynamically from the detected
            columns and records.
          </p>
        </div>
      </div>
    </section>
  );
}

function KpiCard({
  icon: Icon,
  title,
  value,
  description,
  variant = "",
}) {
  return (
    <div className={`dashboard-kpi ${variant}`}>
      <div className="kpi-top">
        <div className="kpi-icon">
          <Icon size={14} />
        </div>

        <span className="kpi-title">
          {title}
        </span>
      </div>

      <strong className="kpi-value">
        {value}
      </strong>

      <span className="kpi-description">
        {description}
      </span>
    </div>
  );
}

function QualityRow({ label, value }) {
  return (
    <div className="quality-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StructureItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="structure-item">
      <div className="structure-icon">
        <Icon size={13} />
      </div>

      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}