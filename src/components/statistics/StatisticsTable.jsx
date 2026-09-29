import {
  BarChart3,
  Calculator,
} from "lucide-react";

export default function StatisticsTable({
  statistics = {},
  numericColumns = [],
  selectedColumn = "all",
}) {
  const columns =
    selectedColumn === "all"
      ? numericColumns
      : numericColumns.includes(
          selectedColumn
        )
      ? [selectedColumn]
      : [];

  if (columns.length === 0) {
    return (
      <div className="statistics-empty">
        <Calculator size={28} />

        <h3>
          No numeric columns available
        </h3>

        <p>
          Statistics can only be calculated
          for numeric columns.
        </p>
      </div>
    );
  }

  const rows = [
    {
      key: "count",
      label: "Count",
      description:
        "Number of numeric values",
    },
    {
      key: "mean",
      label: "Mean",
      description:
        "Arithmetic average",
    },
    {
      key: "median",
      label: "Median",
      description:
        "Middle value",
    },
    {
      key: "mode",
      label: "Mode",
      description:
        "Most frequent value",
    },
    {
      key: "min",
      label: "Minimum",
      description:
        "Smallest value",
    },
    {
      key: "max",
      label: "Maximum",
      description:
        "Largest value",
    },
    {
      key: "range",
      label: "Range",
      description:
        "Maximum minus minimum",
    },
    {
      key: "standardDeviation",
      label: "Standard deviation",
      description:
        "Measure of dispersion",
    },
    {
      key: "variance",
      label: "Variance",
      description:
        "Squared dispersion",
    },
    {
      key: "q1",
      label: "Q1",
      description:
        "25th percentile",
    },
    {
      key: "q3",
      label: "Q3",
      description:
        "75th percentile",
    },
    {
      key: "iqr",
      label: "IQR",
      description:
        "Q3 minus Q1",
    },
  ];

  return (
    <div className="statistics-table-section">
      <div className="statistics-table-header">
        <div>
          <h3>
            Descriptive statistics
          </h3>

          <p>
            Statistical measures calculated
            for the selected numeric columns.
          </p>
        </div>

        <BarChart3 size={20} />
      </div>

      <div className="statistics-table-wrapper">
        <table className="statistics-table">
          <thead>
            <tr>
              <th className="statistics-metric-column">
                Metric
              </th>

              {columns.map((column) => (
                <th key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>
                  <div className="statistics-metric-name">
                    <strong>
                      {row.label}
                    </strong>

                    <span>
                      {row.description}
                    </span>
                  </div>
                </td>

                {columns.map((column) => (
                  <td key={`${row.key}-${column}`}>
                    {formatStatistic(
                      statistics[column]?.[
                        row.key
                      ]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatStatistic(value) {
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
      maximumFractionDigits: 4,
    }
  );
}