import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Database,
  Rows3,
} from "lucide-react";

export default function CleaningSummary({
  before,
  after,
}) {
  const cards = [
    {
      icon: Rows3,
      label: "Rows",
      before: before?.rows || 0,
      after: after?.rows || 0,
    },
    {
      icon: AlertTriangle,
      label: "Missing Cells",
      before:
        before?.missingCells || 0,
      after:
        after?.missingCells || 0,
    },
    {
      icon: Copy,
      label: "Duplicate Rows",
      before:
        before?.duplicateRows || 0,
      after:
        after?.duplicateRows || 0,
    },
    {
      icon: CheckCircle2,
      label: "Completeness",
      before:
        before?.completeness || 100,
      after:
        after?.completeness || 100,
      percentage: true,
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map(
        ({
          icon: Icon,
          label,
          before: beforeValue,
          after: afterValue,
          percentage,
        }) => (
          <div
            className="kpi-card"
            key={label}
          >
            <div className="kpi-card-header">
              <span className="kpi-card-label">
                {label}
              </span>

              <div className="kpi-card-icon">
                <Icon size={16} />
              </div>
            </div>

            <strong className="kpi-card-value">
              {formatValue(
                afterValue,
                percentage
              )}
            </strong>

            <span
              style={{
                display: "block",
                marginTop: "5px",
                color:
                  "var(--text-muted)",
                fontSize: "10px",
              }}
            >
              Before:{" "}
              {formatValue(
                beforeValue,
                percentage
              )}
            </span>
          </div>
        )
      )}
    </div>
  );
}

function formatValue(
  value,
  percentage
) {
  if (percentage) {
    return `${Number(value).toFixed(
      1
    )}%`;
  }

  return Number(
    value || 0
  ).toLocaleString();
}