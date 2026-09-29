import {
  BarChart3,
  Database,
  Hash,
  Star,
} from "lucide-react";

export default function FeatureSummary({
  profile = [],
  featureImportance = [],
}) {
  const numericCount =
    profile.filter(
      (item) =>
        item.type === "numeric"
    ).length;

  const categoricalCount =
    profile.filter(
      (item) =>
        item.type === "categorical"
    ).length;

  const topFeature =
    featureImportance[0];

  const totalFeatures =
    profile.length;

  const cards = [
    {
      icon: Database,
      label: "Total Features",
      value: totalFeatures,
      description:
        "Columns analyzed",
    },
    {
      icon: BarChart3,
      label: "Numeric Features",
      value: numericCount,
      description:
        "Statistical features",
    },
    {
      icon: Hash,
      label: "Categorical Features",
      value: categoricalCount,
      description:
        "Category-based features",
    },
    {
      icon: Star,
      label: "Top Feature",
      value:
        topFeature?.feature || "—",
      description:
        topFeature
          ? `${topFeature.score}% relevance`
          : "No feature available",
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