import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

export default function QualityScoreCard({
  completeness = 100,
  missingValues = 0,
  duplicateRows = 0,
  outlierValues = 0,
}) {
  const score = Math.max(
    0,
    Math.min(100, completeness)
  );

  const status =
    score >= 95
      ? {
          label: "Excellent",
          icon: CheckCircle2,
          description:
            "Your dataset has very few quality issues.",
        }
      : score >= 80
      ? {
          label: "Good",
          icon: ShieldCheck,
          description:
            "Your dataset is generally usable but has some issues.",
        }
      : {
          label: "Needs attention",
          icon: AlertTriangle,
          description:
            "Your dataset contains quality issues that should be reviewed.",
        };

  const StatusIcon = status.icon;

  return (
    <section className="quality-score-card panel">
      <div className="quality-score-main">
        <div
          className="quality-score-circle"
          style={{
            "--quality-score": `${score}%`,
          }}
        >
          <div className="quality-score-inner">
            <strong>
              {score.toFixed(0)}%
            </strong>

            <span>Quality</span>
          </div>
        </div>

        <div className="quality-score-content">
          <div className="quality-score-title">
            <StatusIcon size={20} />

            <div>
              <span className="section-label">
                OVERALL DATA QUALITY
              </span>

              <h2>{status.label}</h2>
            </div>
          </div>

          <p>{status.description}</p>

          <div className="quality-score-stats">
            <QualityMiniStat
              label="Missing values"
              value={missingValues}
            />

            <QualityMiniStat
              label="Duplicate rows"
              value={duplicateRows}
            />

            <QualityMiniStat
              label="Outlier values"
              value={outlierValues}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function QualityMiniStat({
  label,
  value,
}) {
  return (
    <div className="quality-mini-stat">
      <span>{label}</span>

      <strong>
        {Number(value || 0).toLocaleString()}
      </strong>
    </div>
  );
}