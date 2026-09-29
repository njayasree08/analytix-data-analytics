import {
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Lightbulb,
  Rows3,
  ShieldCheck,
} from "lucide-react";

export default function ReportSummary({
  dataset,
  analysis,
}) {
  const cards = [
    {
      icon: Rows3,
      label: "Rows",
      value:
        dataset?.rowCount || 0,
    },
    {
      icon: BarChart3,
      label: "Columns",
      value:
        dataset?.columnCount || 0,
    },
    {
      icon: ShieldCheck,
      label: "Completeness",
      value: `${Number(
        analysis?.missingValues
          ?.completeness ?? 100
      ).toFixed(1)}%`,
    },
    {
      icon: Lightbulb,
      label: "Insights",
      value:
        analysis?.insights
          ?.length || 0,
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map(
        ({
          icon: Icon,
          label,
          value,
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
              {typeof value ===
              "number"
                ? value.toLocaleString()
                : value}
            </strong>
          </div>
        )
      )}
    </div>
  );
}