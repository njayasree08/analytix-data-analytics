import { useMemo } from "react";

import {
  Activity,
  Database,
  Rows3,
  Columns3,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Hash,
  Type,
  CalendarDays,
  ToggleLeft,
  KeyRound,
  FileText,
  Sparkles,
  ArrowUpRight,
  Info,
} from "lucide-react";

import { useDataset } from "../context/DatasetContext";

export default function Dashboard() {
  const { dataset } = useDataset();

  const analysis = useMemo(() => {
    if (!dataset?.data?.length) {
      return null;
    }

    return analyzeDataset(
      dataset.data,
      dataset.columns || []
    );
  }, [dataset]);

  if (!dataset) {
    return <EmptyDashboard />;
  }

  if (!analysis) {
    return <LoadingDashboard />;
  }

  return (
    <div className="dashboard">
      {/* =====================================================
          DATASET HEADER
      ===================================================== */}

      <section className="dataset-header">
        <div className="dataset-title">
          <div className="dataset-file-icon">
            <FileText size={22} />
          </div>

          <div>
            <span className="dataset-label">
              ACTIVE DATASET
            </span>

            <h2>{dataset.fileName}</h2>

            <p>
              {dataset.fileType} · Uploaded{" "}
              {formatUploadDate(
                dataset.uploadedAt
              )}
            </p>
          </div>
        </div>

        <div className="dataset-status">
          <span className="status-dot" />
          Analysis ready
        </div>
      </section>

      {/* =====================================================
          KPI SECTION
      ===================================================== */}

      <section className="dashboard-kpis">
        <DashboardKPI
          icon={Rows3}
          title="Total Rows"
          value={formatNumber(
            analysis.rows
          )}
          description="Records analyzed"
        />

        <DashboardKPI
          icon={Columns3}
          title="Total Columns"
          value={formatNumber(
            analysis.columns
          )}
          description="Features detected"
        />

        <DashboardKPI
          icon={ShieldCheck}
          title="Quality Score"
          value={`${analysis.qualityScore}%`}
          description="Overall data quality"
          variant={
            analysis.qualityScore >= 90
              ? "positive"
              : analysis.qualityScore >= 70
              ? "warning"
              : "danger"
          }
        />

        <DashboardKPI
          icon={AlertTriangle}
          title="Missing Values"
          value={formatNumber(
            analysis.missingValues
          )}
          description="Empty cells detected"
          variant={
            analysis.missingValues === 0
              ? "positive"
              : "warning"
          }
        />

        <DashboardKPI
          icon={BarChart3}
          title="Numeric Features"
          value={formatNumber(
            analysis.typeCounts.numeric
          )}
          description="Analysis-ready columns"
        />
      </section>

      {/* =====================================================
          MAIN ANALYSIS GRID
      ===================================================== */}

      <section className="dashboard-main-grid">
        {/* DATA QUALITY */}

        <DashboardCard
          title="Data Quality"
          description="Overall health of the uploaded dataset"
          icon={ShieldCheck}
        >
          <div className="quality-content">
            <div
              className="quality-circle"
              style={{
                "--quality": `${analysis.qualityScore * 3.6}deg`,
              }}
            >
              <div>
                <strong>
                  {analysis.qualityScore}%
                </strong>

                <span>Quality</span>
              </div>
            </div>

            <div className="quality-details">
              <QualityRow
                label="Complete cells"
                value={`${analysis.completeness}%`}
                positive={
                  analysis.completeness >= 90
                }
              />

              <QualityRow
                label="Missing values"
                value={formatNumber(
                  analysis.missingValues
                )}
                positive={
                  analysis.missingValues === 0
                }
              />

              <QualityRow
                label="Duplicate rows"
                value={formatNumber(
                  analysis.duplicateRows
                )}
                positive={
                  analysis.duplicateRows === 0
                }
              />

              <QualityRow
                label="Columns analyzed"
                value={formatNumber(
                  analysis.columns
                )}
                positive
              />
            </div>
          </div>
        </DashboardCard>

        {/* DATA TYPES */}

        <DashboardCard
          title="Column Intelligence"
          description="Automatically detected data types"
          icon={Sparkles}
        >
          <div className="type-list">
            <TypeRow
              type="numeric"
              icon={Hash}
              label="Numeric"
              value={
                analysis.typeCounts.numeric
              }
            />

            <TypeRow
              type="categorical"
              icon={Type}
              label="Categorical"
              value={
                analysis.typeCounts.categorical
              }
            />

            <TypeRow
              type="date"
              icon={CalendarDays}
              label="Date / Time"
              value={
                analysis.typeCounts.date
              }
            />

            <TypeRow
              type="boolean"
              icon={ToggleLeft}
              label="Boolean"
              value={
                analysis.typeCounts.boolean
              }
            />

            <TypeRow
              type="id"
              icon={KeyRound}
              label="ID / Identifier"
              value={
                analysis.typeCounts.id
              }
            />

            <TypeRow
              type="text"
              icon={FileText}
              label="Text"
              value={
                analysis.typeCounts.text
              }
            />
          </div>
        </DashboardCard>
      </section>

      {/* =====================================================
          DATASET STRUCTURE + STATISTICS
      ===================================================== */}

      <section className="dashboard-main-grid">
        {/* STRUCTURE */}

        <DashboardCard
          title="Dataset Structure"
          description="High-level profile of your data"
          icon={Database}
        >
          <div className="structure-grid">
            <StructureItem
              icon={Rows3}
              label="Rows"
              value={formatNumber(
                analysis.rows
              )}
            />

            <StructureItem
              icon={Columns3}
              label="Columns"
              value={formatNumber(
                analysis.columns
              )}
            />

            <StructureItem
              icon={Hash}
              label="Numeric"
              value={formatNumber(
                analysis.typeCounts.numeric
              )}
            />

            <StructureItem
              icon={Type}
              label="Categorical"
              value={formatNumber(
                analysis.typeCounts.categorical
              )}
            />

            <StructureItem
              icon={CalendarDays}
              label="Date fields"
              value={formatNumber(
                analysis.typeCounts.date
              )}
            />

            <StructureItem
              icon={Activity}
              label="Unique fields"
              value={formatNumber(
                analysis.uniqueColumns
              )}
            />
          </div>
        </DashboardCard>

        {/* NUMERICAL STATISTICS */}

        <DashboardCard
          title="Statistical Snapshot"
          description="Summary of numerical features"
          icon={BarChart3}
        >
          {analysis.numericStats.length ===
          0 ? (
            <EmptyCard
              message="No numerical columns detected."
            />
          ) : (
            <div className="statistics-list">
              {analysis.numericStats
                .slice(0, 5)
                .map((stat) => (
                  <div
                    className="statistics-row"
                    key={stat.name}
                  >
                    <div className="statistics-name">
                      <strong>
                        {stat.name}
                      </strong>

                      <span>
                        Mean{" "}
                        {formatDecimal(
                          stat.mean
                        )}
                      </span>
                    </div>

                    <div className="stat-range">
                      <span>
                        Min{" "}
                        {formatDecimal(
                          stat.min
                        )}
                      </span>

                      <span>
                        Max{" "}
                        {formatDecimal(
                          stat.max
                        )}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </DashboardCard>
      </section>

      {/* =====================================================
          DATA QUALITY DETAILS
      ===================================================== */}

      <section className="dashboard-main-grid">
        {/* MISSING VALUES */}

        <DashboardCard
          title="Missing Value Analysis"
          description="Columns requiring attention"
          icon={AlertTriangle}
        >
          {analysis.missingColumns.length ===
          0 ? (
            <SuccessMessage
              title="No missing values detected"
              description="All analyzed cells contain values."
            />
          ) : (
            <div className="statistics-list">
              {analysis.missingColumns
                .slice(0, 6)
                .map((column) => (
                  <div
                    className="statistics-row"
                    key={column.name}
                  >
                    <div className="statistics-name">
                      <strong>
                        {column.name}
                      </strong>

                      <span>
                        {column.percentage}% of
                        rows missing
                      </span>
                    </div>

                    <div className="stat-range">
                      <span>
                        {formatNumber(
                          column.count
                        )}{" "}
                        missing
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </DashboardCard>

        {/* DUPLICATES */}

        <DashboardCard
          title="Duplicate Detection"
          description="Repeated records in the dataset"
          icon={Database}
        >
          {analysis.duplicateRows ===
          0 ? (
            <SuccessMessage
              title="No duplicate rows found"
              description="Every analyzed record appears unique."
            />
          ) : (
            <div className="duplicate-summary">
              <div className="duplicate-number">
                {formatNumber(
                  analysis.duplicateRows
                )}
              </div>

              <div>
                <strong>
                  Duplicate rows
                </strong>

                <p>
                  Repeated records were detected
                  and should be reviewed during
                  data cleaning.
                </p>
              </div>
            </div>
          )}
        </DashboardCard>
      </section>

      {/* =====================================================
          TOP FEATURES
      ===================================================== */}

      <section className="dashboard-card correlation-card">
        <div className="dashboard-card-header">
          <div>
            <h3>
              Important Numeric Features
            </h3>

            <p>
              Columns with the highest variation
              in the current dataset
            </p>
          </div>

          <div className="card-header-icon">
            <Sparkles size={16} />
          </div>
        </div>

        {analysis.numericStats.length ===
        0 ? (
          <EmptyCard
            message="Numeric feature analysis will appear here."
          />
        ) : (
          <div className="feature-ranking">
            {analysis.numericStats
              .slice()
              .sort(
                (a, b) =>
                  b.variation -
                  a.variation
              )
              .slice(0, 5)
              .map((feature, index) => (
                <div
                  className="feature-ranking-row"
                  key={feature.name}
                >
                  <div className="feature-rank">
                    {index + 1}
                  </div>

                  <div className="feature-info">
                    <strong>
                      {feature.name}
                    </strong>

                    <span>
                      Standard deviation{" "}
                      {formatDecimal(
                        feature.std
                      )}
                    </span>
                  </div>

                  <div className="feature-bar">
                    <span
                      style={{
                        width: `${Math.min(
                          feature.normalizedVariation *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="feature-value">
                    {formatDecimal(
                      feature.variation
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* =====================================================
          ANALYSIS NOTE
      ===================================================== */}

      <section className="analysis-note">
        <div className="analysis-note-icon">
          <Info size={17} />
        </div>

        <div>
          <strong>
            Automated analysis
          </strong>

          <p>
            DataSphere automatically profiled{" "}
            {formatNumber(analysis.rows)} rows
            across{" "}
            {formatNumber(analysis.columns)}{" "}
            columns. Data types, completeness,
            duplicates and numerical statistics
            were calculated directly from the
            uploaded dataset.
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   KPI
========================================================= */

function DashboardKPI({
  icon: Icon,
  title,
  value,
  description,
  variant = "",
}) {
  return (
    <div
      className={`dashboard-kpi ${variant}`}
    >
      <div className="kpi-top">
        <div className="kpi-icon">
          <Icon size={16} />
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

/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <section className="dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h3>{title}</h3>

          <p>{description}</p>
        </div>

        <div className="card-header-icon">
          <Icon size={16} />
        </div>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   QUALITY ROW
========================================================= */

function QualityRow({
  label,
  value,
  positive,
}) {
  return (
    <div className="quality-row">
      <span>{label}</span>

      <strong
        style={{
          color: positive
            ? "#16845b"
            : "#c27a13",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   TYPE ROW
========================================================= */

function TypeRow({
  type,
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="type-row">
      <div className="type-name">
        <span
          className={`type-dot ${type}`}
        />

        <Icon size={13} />

        {label}
      </div>

      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   STRUCTURE ITEM
========================================================= */

function StructureItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="structure-item">
      <div className="structure-icon">
        <Icon size={14} />
      </div>

      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   SUCCESS MESSAGE
========================================================= */

function SuccessMessage({
  title,
  description,
}) {
  return (
    <div className="success-message">
      <div className="success-message-icon">
        <CheckCircle2 size={18} />
      </div>

      <div>
        <strong>{title}</strong>

        <p>{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY CARD
========================================================= */

function EmptyCard({
  message,
}) {
  return (
    <div className="card-empty">
      <Info size={15} />

      {message}
    </div>
  );
}

/* =========================================================
   EMPTY DASHBOARD
========================================================= */

function EmptyDashboard() {
  return (
    <div className="dashboard-state">
      <div className="state-icon">
        <Database size={28} />
      </div>

      <span className="state-label">
        DATA ANALYTICS WORKSPACE
      </span>

      <h2>
        Your dashboard is ready
      </h2>

      <p>
        Upload a CSV or Excel dataset to
        automatically generate KPIs, data quality
        analysis, statistics, feature analysis and
        intelligent insights.
      </p>

      <div className="empty-dashboard-features">
        <span>
          <CheckCircle2 size={13} />
          Automatic profiling
        </span>

        <span>
          <CheckCircle2 size={13} />
          Data quality
        </span>

        <span>
          <CheckCircle2 size={13} />
          Statistics
        </span>

        <span>
          <CheckCircle2 size={13} />
          Smart insights
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   LOADING DASHBOARD
========================================================= */

function LoadingDashboard() {
  return (
    <div className="dashboard-state">
      <div className="state-icon loading-icon">
        <Activity size={28} />
      </div>

      <span className="state-label">
        ANALYZING DATA
      </span>

      <h2>
        Preparing your dashboard
      </h2>

      <p>
        DataSphere is profiling your dataset and
        preparing the analytical workspace.
      </p>

      <div className="loading-bar">
        <span />
      </div>
    </div>
  );
}

/* =========================================================
   DATA ANALYSIS ENGINE
========================================================= */

function analyzeDataset(
  data,
  columns
) {
  const rows = data.length;

  const columnNames =
    columns.length > 0
      ? columns
      : Object.keys(data[0] || {});

  const typeCounts = {
    numeric: 0,
    categorical: 0,
    date: 0,
    boolean: 0,
    id: 0,
    text: 0,
  };

  const columnProfiles = [];

  let missingValues = 0;
  let totalCells =
    rows * columnNames.length;

  for (const column of columnNames) {
    const values = data.map(
      (row) => row[column]
    );

    const missingCount = values.filter(
      isMissing
    ).length;

    missingValues += missingCount;

    const nonMissing = values.filter(
      (value) => !isMissing(value)
    );

    const uniqueValues = new Set(
      nonMissing.map((value) =>
        String(value)
      )
    );

    const type = detectColumnType(
      column,
      values,
      uniqueValues
    );

    typeCounts[type] += 1;

    columnProfiles.push({
      name: column,
      type,
      missingCount,
      missingPercentage:
        rows > 0
          ? round(
              (missingCount / rows) *
                100,
              1
            )
          : 0,
      uniqueCount:
        uniqueValues.size,
    });
  }

  const duplicateRows =
    countDuplicateRows(data);

  const completeness =
    totalCells === 0
      ? 100
      : round(
          ((totalCells -
            missingValues) /
            totalCells) *
            100,
          1
        );

  const duplicatePenalty =
    rows === 0
      ? 0
      : Math.min(
          (duplicateRows / rows) *
            100,
          20
        );

  const qualityScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        completeness -
          duplicatePenalty
      )
    )
  );

  const numericStats =
    columnNames
      .map((column) => {
        const values = data
          .map((row) =>
            toNumber(row[column])
          )
          .filter(
            (value) =>
              value !== null &&
              Number.isFinite(value)
          );

        if (values.length < 2) {
          return null;
        }

        const mean =
          values.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / values.length;

        const variance =
          values.reduce(
            (sum, value) =>
              sum +
              Math.pow(
                value - mean,
                2
              ),
            0
          ) /
          values.length;

        const std =
          Math.sqrt(variance);

        const min =
          Math.min(...values);

        const max =
          Math.max(...values);

        const variation =
          Math.abs(std);

        return {
          name: column,
          mean,
          min,
          max,
          std,
          variation,
          normalizedVariation:
            0,
        };
      })
      .filter(Boolean);

  const maxVariation =
    Math.max(
      ...numericStats.map(
        (item) => item.variation
      ),
      1
    );

  numericStats.forEach(
    (item) => {
      item.normalizedVariation =
        item.variation /
        maxVariation;
    }
  );

  const missingColumns =
    columnProfiles
      .filter(
        (column) =>
          column.missingCount > 0
      )
      .map((column) => ({
        name: column.name,
        count: column.missingCount,
        percentage:
          column.missingPercentage,
      }))
      .sort(
        (a, b) =>
          b.count - a.count
      );

  const uniqueColumns =
    columnProfiles.filter(
      (column) =>
        column.uniqueCount === rows &&
        rows > 0
    ).length;

  return {
    rows,
    columns: columnNames.length,

    missingValues,

    completeness,

    qualityScore,

    duplicateRows,

    uniqueColumns,

    typeCounts,

    numericStats,

    missingColumns,

    columnProfiles,
  };
}

/* =========================================================
   TYPE DETECTION
========================================================= */

function detectColumnType(
  columnName,
  values,
  uniqueValues
) {
  const name =
    columnName.toLowerCase();

  const nonMissing =
    values.filter(
      (value) => !isMissing(value)
    );

  if (
    nonMissing.length === 0
  ) {
    return "text";
  }

  const uniqueRatio =
    uniqueValues.size /
    nonMissing.length;

  /* ID detection */

  const idName =
    name === "id" ||
    name.endsWith("_id") ||
    name.endsWith("id") ||
    name.includes("identifier") ||
    name.includes("code");

  if (
    idName &&
    uniqueRatio > 0.7
  ) {
    return "id";
  }

  /* Boolean */

  const booleanValues =
    new Set(
      nonMissing.map((value) =>
        String(value)
          .trim()
          .toLowerCase()
      )
    );

  const isBoolean =
    [...booleanValues].every(
      (value) =>
        [
          "true",
          "false",
          "yes",
          "no",
          "1",
          "0",
        ].includes(value)
    ) &&
    booleanValues.size <= 2;

  if (isBoolean) {
    return "boolean";
  }

  /* Numeric */

  const numericValues =
    nonMissing.filter(
      (value) =>
        toNumber(value) !== null
    );

  const numericRatio =
    numericValues.length /
    nonMissing.length;

  if (
    numericRatio >= 0.9
  ) {
    return "numeric";
  }

  /* Date */

  const dateValues =
    nonMissing.filter(
      (value) =>
        isValidDate(value)
    );

  const dateRatio =
    dateValues.length /
    nonMissing.length;

  if (
    dateRatio >= 0.8 ||
    name.includes("date") ||
    name.includes("time")
  ) {
    return "date";
  }

  /* Categorical */

  if (
    uniqueRatio <= 0.15 ||
    uniqueValues.size <= 20
  ) {
    return "categorical";
  }

  return "text";
}

/* =========================================================
   MISSING
========================================================= */

function isMissing(value) {
  return (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  );
}

/* =========================================================
   NUMBER
========================================================= */

function toNumber(value) {
  if (isMissing(value)) {
    return null;
  }

  if (
    typeof value === "number"
  ) {
    return Number.isFinite(value)
      ? value
      : null;
  }

  const cleaned = String(value)
    .replace(/,/g, "")
    .replace(/%/g, "")
    .trim();

  if (cleaned === "") {
    return null;
  }

  const number =
    Number(cleaned);

  return Number.isFinite(number)
    ? number
    : null;
}

/* =========================================================
   DATE
========================================================= */

function isValidDate(value) {
  if (
    value instanceof Date &&
    !Number.isNaN(
      value.getTime()
    )
  ) {
    return true;
  }

  if (
    typeof value === "number"
  ) {
    return false;
  }

  const text =
    String(value).trim();

  if (!text) {
    return false;
  }

  const parsed =
    Date.parse(text);

  return !Number.isNaN(parsed);
}

/* =========================================================
   DUPLICATES
========================================================= */

function countDuplicateRows(
  data
) {
  const seen = new Set();

  let duplicates = 0;

  for (const row of data) {
    const key =
      JSON.stringify(row);

    if (seen.has(key)) {
      duplicates += 1;
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

/* =========================================================
   FORMATTERS
========================================================= */

function formatNumber(
  value
) {
  return new Intl.NumberFormat(
    "en-IN"
  ).format(value || 0);
}

function formatDecimal(
  value
) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(value)
  ) {
    return "—";
  }

  if (
    Math.abs(value) >=
    1000000
  ) {
    return value
      .toExponential(2);
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  ).format(value);
}

function round(
  value,
  decimals = 0
) {
  const factor =
    Math.pow(10, decimals);

  return (
    Math.round(
      value * factor
    ) / factor
  );
}

function formatUploadDate(
  date
) {
  if (!date) {
    return "recently";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "recently";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}