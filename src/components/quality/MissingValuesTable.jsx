import {
  AlertTriangle,
  CheckCircle2,
  Database,
} from "lucide-react";

export default function MissingValuesTable({
  analysis,
}) {
  const columns =
    analysis?.missingValues?.columns || [];

  const columnsWithMissing =
    columns.filter(
      (item) => item.hasMissing
    );

  return (
    <section className="panel quality-panel">
      <div className="panel-heading">
        <div>
          <h2>
            Missing values
          </h2>

          <p>
            Empty or missing cells detected
            in each column.
          </p>
        </div>

        <AlertTriangle size={20} />
      </div>

      <div className="quality-summary-strip">
        <QualitySummaryItem
          label="Total missing"
          value={(
            analysis?.missingValues
              ?.totalMissing || 0
          ).toLocaleString()}
        />

        <QualitySummaryItem
          label="Missing percentage"
          value={`${(
            analysis?.missingValues
              ?.missingPercentage || 0
          ).toFixed(2)}%`}
        />

        <QualitySummaryItem
          label="Affected columns"
          value={columnsWithMissing.length}
        />

        <QualitySummaryItem
          label="Completeness"
          value={`${(
            analysis?.missingValues
              ?.completeness ?? 100
          ).toFixed(2)}%`}
        />
      </div>

      {columns.length === 0 ? (
        <div className="quality-empty">
          <Database size={24} />

          <p>
            No column quality information is
            available.
          </p>
        </div>
      ) : (
        <div className="quality-table-wrapper">
          <table className="quality-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Missing values</th>
                <th>Missing %</th>
                <th>Completeness</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {columns.map((item) => {
                const completeness =
                  Math.max(
                    0,
                    100 - item.percentage
                  );

                return (
                  <tr key={item.column}>
                    <td>
                      <div className="quality-column-name">
                        <Database size={15} />

                        <strong>
                          {item.column}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {item.missingCount.toLocaleString()}
                    </td>

                    <td>
                      {item.percentage.toFixed(
                        2
                      )}
                      %
                    </td>

                    <td>
                      <div className="quality-progress-cell">
                        <div className="quality-progress">
                          <span
                            style={{
                              width: `${completeness}%`,
                            }}
                          />
                        </div>

                        <span>
                          {completeness.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                    </td>

                    <td>
                      {item.hasMissing ? (
                        <span className="quality-status warning">
                          <AlertTriangle
                            size={14}
                          />
                          Missing
                        </span>
                      ) : (
                        <span className="quality-status success">
                          <CheckCircle2
                            size={14}
                          />
                          Complete
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function QualitySummaryItem({
  label,
  value,
}) {
  return (
    <div className="quality-summary-item">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}