import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Database,
  Info,
  Link2,
  Star,
} from "lucide-react";

const iconMap = {
  database: Database,
  check: CheckCircle2,
  alert: AlertTriangle,
  copy: Copy,
  activity: Activity,
  link: Link2,
  star: Star,
  info: Info,
};

export default function InsightCard({
  insight,
}) {
  const Icon =
    iconMap[insight?.icon] ||
    Info;

  const priority =
    insight?.priority || "low";

  return (
    <article
      className="insight-card"
      style={{
        borderLeft:
          `3px solid ${getPriorityColor(
            priority
          )}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent:
            "space-between",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <div
            className="kpi-card-icon"
            style={{
              width: "32px",
              height: "32px",
            }}
          >
            <Icon size={15} />
          </div>

          <div>
            <h3>
              {insight.title}
            </h3>

            <span
              style={{
                display: "inline-block",
                marginTop: "3px",
                color:
                  getPriorityColor(
                    priority
                  ),
                fontSize: "9px",
                fontWeight: 700,
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.6px",
              }}
            >
              {priority} priority
            </span>
          </div>
        </div>

        {insight.metric !== null &&
          insight.metric !== undefined && (
            <strong
              style={{
                fontSize: "14px",
                whiteSpace:
                  "nowrap",
              }}
            >
              {insight.metric}
            </strong>
          )}
      </div>

      <p
        style={{
          marginTop: "12px",
          lineHeight: 1.6,
        }}
      >
        {insight.description}
      </p>
    </article>
  );
}

function getPriorityColor(
  priority
) {
  switch (priority) {
    case "high":
      return "var(--danger)";

    case "medium":
      return "var(--warning)";

    default:
      return "var(--success)";
  }
}