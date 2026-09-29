import {
  ArrowDown,
  ArrowUp,
  Info,
} from "lucide-react";

export default function FeatureTable({
  featureImportance = [],
}) {
  if (!featureImportance.length) {
    return (
      <div className="preview-empty">
        <Info size={28} />

        <h2>
          No feature analysis available
        </h2>

        <p>
          Upload a dataset containing
          analyzable columns to generate
          feature analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Feature</th>
            <th>Type</th>
            <th>Relevance</th>
            <th>Variability</th>
            <th>Correlation</th>
            <th>Uniqueness</th>
            <th>Completeness</th>
            <th>Interpretation</th>
          </tr>
        </thead>

        <tbody>
          {featureImportance.map(
            (item, index) => (
              <tr key={item.feature}>
                <td>
                  <strong>
                    {index + 1}
                  </strong>
                </td>

                <td>
                  <strong>
                    {item.feature}
                  </strong>
                </td>

                <td>
                  <span className="status-badge">
                    {item.type}
                  </span>
                </td>

                <td>
                  <RelevanceBar
                    value={item.score}
                  />
                </td>

                <td>
                  {item.type ===
                  "numeric"
                    ? `${Math.round(
                        item.variationScore *
                          100
                      )}%`
                    : "—"}
                </td>

                <td>
                  {item.type ===
                  "numeric"
                    ? `${Math.round(
                        item.correlationScore *
                          100
                      )}%`
                    : "—"}
                </td>

                <td>
                  {Math.round(
                    item
                      .uniquenessScore *
                      100
                  )}
                  %
                </td>

                <td>
                  {Math.round(
                    item.missingScore *
                      100
                  )}
                  %
                </td>

                <td
                  style={{
                    minWidth: "260px",
                    whiteSpace:
                      "normal",
                  }}
                >
                  {item.reason}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

function RelevanceBar({
  value = 0,
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, value)
  );

  return (
    <div
      style={{
        minWidth: "105px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: "7px",
          marginBottom: "4px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {safeValue}%
        </span>

        {safeValue >= 60 ? (
          <ArrowUp
            size={12}
            className="stat-positive"
          />
        ) : (
          <ArrowDown
            size={12}
            className="stat-warning"
          />
        )}
      </div>

      <div
        style={{
          height: "5px",
          width: "100%",
          overflow: "hidden",
          borderRadius: "10px",
          background:
            "#e2e8f0",
        }}
      >
        <div
          style={{
            width: `${safeValue}%`,
            height: "100%",
            borderRadius: "inherit",
            background:
              "var(--primary)",
          }}
        />
      </div>
    </div>
  );
}