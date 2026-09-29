import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

export default function InsightsSummary({
  insights = [],
}) {
  const highPriority =
    insights.filter(
      (item) =>
        item.priority === "high"
    ).length;

  const mediumPriority =
    insights.filter(
      (item) =>
        item.priority === "medium"
    ).length;

  const qualityInsights =
    insights.filter(
      (item) =>
        item.type === "quality"
    ).length;

  const cards = [
    {
      icon: Lightbulb,
      label: "Total Insights",
      value: insights.length,
      description:
        "Automatically generated",
    },
    {
      icon: AlertTriangle,
      label: "High Priority",
      value: highPriority,
      description:
        "Needs attention",
    },
    {
      icon: TrendingUp,
      label: "Medium Priority",
      value: mediumPriority,
      description:
        "Worth reviewing",
    },
    {
      icon: CheckCircle2,
      label: "Quality Findings",
      value: qualityInsights,
      description:
        "Data quality observations",
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map(
        ({
          icon: Icon,
          label,
          value,
          description,
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
              {value}
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
              {description}
            </span>
          </div>
        )
      )}
    </div>
  );
}