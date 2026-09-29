import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export default function OutlierAnalysis({
  outliers = {},
}) {
  const entries =
    Object.entries(outliers);

  const totalOutliers =
    entries.reduce(
      (total, [, item]) =>
        total +
        (item?.outlierCount || 0),
      0
    );

  return (
    <section className="panel quality-panel">
      <div className="panel-heading">
        <div>
          <h2>
            Outlier detection
          </h2>

          <p>
            Numeric columns analyzed using
            the IQR method.
          </p>
        </div>

        <BarChart3 size={20} />
      </div>

      <div className="outlier-summary">
        <div className="outlier-total">
          {totalOutliers > 0 ? (
            <AlertTriangle size={21} />
          ) : (
            <CheckCircle2 size={21} />
          )}

          <div>
            <span>
              Total outlier values
            </span>

            <strong>
              {totalOutliers.toLocaleString()}
            </strong>
          </div>
        </div>

        <span className="outlier-method">
          Method: IQR
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="quality-empty">
          <BarChart3 size={24} />

          <p>
            No numeric columns are
            available for outlier analysis.
          </p>
        </div>
      ) : (
        <div className="quality-table-wrapper">
          <table className="quality-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Outliers</th>
                <th>Outlier %</th>
                <th>Lower bound</th>
                <th>Upper bound</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {entries.map(
                ([column, item]) => {
                  const count =
                    item?.outlierCount || 0;

                  const percentage =
                    item?.outlierPercentage ||
                    0;

                  return (
                    <tr key={column}>
                      <td>
                        <strong>
                          {column}
                        </strong>
                      </td>

                      <td>
                        {count.toLocaleString()}
                      </td>

                      <td>
                        {percentage.toFixed(
                          2
                        )}
                        %
                      </td>

                      <td>
                        {formatNumber(
                          item?.lowerBound
                        )}
                      </td>

                      <td>
                        {formatNumber(
                          item?.upperBound
                        )}
                      </td>

                      <td>
                        {count > 0 ? (
                          <span className="quality-status warning">
                            <AlertTriangle
                              size={14}
                            />
                            Review
                          </span>
                        ) : (
                          <span className="quality-status success">
                            <CheckCircle2
                              size={14}
                            />
                            Clear
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
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