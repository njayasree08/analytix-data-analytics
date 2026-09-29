import {
  BarChart3,
  Calculator,
  Database,
  Sigma,
} from "lucide-react";

export default function StatisticsSummary({
  statistics = {},
  numericColumns = [],
}) {
  const columnCount =
    numericColumns.length;

  const statisticValues =
    Object.values(statistics);

  const totalValues =
    statisticValues.reduce(
      (total, item) =>
        total + (item?.count || 0),
      0
    );

  const means =
    statisticValues
      .map((item) => item?.mean)
      .filter(Number.isFinite);

  const averageMean =
    means.length > 0
      ? means.reduce(
          (sum, value) => sum + value,
          0
        ) / means.length
      : null;

  const standardDeviations =
    statisticValues
      .map(
        (item) =>
          item?.standardDeviation
      )
      .filter(Number.isFinite);

  const averageStandardDeviation =
    standardDeviations.length > 0
      ? standardDeviations.reduce(
          (sum, value) => sum + value,
          0
        ) /
        standardDeviations.length
      : null;

  return (
    <div className="statistics-summary-grid">
      <StatisticsSummaryCard
        icon={Database}
        label="Numeric columns"
        value={columnCount}
        description="Quantitative features"
      />

      <StatisticsSummaryCard
        icon={BarChart3}
        label="Numeric values"
        value={totalValues.toLocaleString()}
        description="Values analyzed"
      />

      <StatisticsSummaryCard
        icon={Calculator}
        label="Average mean"
        value={formatNumber(
          averageMean
        )}
        description="Across numeric columns"
      />

      <StatisticsSummaryCard
        icon={Sigma}
        label="Average std. deviation"
        value={formatNumber(
          averageStandardDeviation
        )}
        description="Across numeric columns"
      />
    </div>
  );
}

function StatisticsSummaryCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="statistics-summary-card">
      <div className="statistics-summary-icon">
        <Icon size={18} />
      </div>

      <div className="statistics-summary-content">
        <span>{label}</span>

        <strong>{value}</strong>

        <p>{description}</p>
      </div>
    </div>
  );
}

function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "—";
  }

  return Number(value).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 2,
    }
  );
}