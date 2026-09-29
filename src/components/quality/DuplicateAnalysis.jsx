import {
  CheckCircle2,
  Copy,
  Database,
} from "lucide-react";

export default function DuplicateAnalysis({
  duplicates,
  totalRows = 0,
}) {
  const duplicateCount =
    duplicates?.duplicateCount || 0;

  const duplicatePercentage =
    duplicates?.duplicatePercentage || 0;

  const hasDuplicates =
    duplicates?.hasDuplicates || false;

  const uniqueRows = Math.max(
    0,
    totalRows - duplicateCount
  );

  return (
    <section className="panel quality-panel">
      <div className="panel-heading">
        <div>
          <h2>
            Duplicate rows
          </h2>

          <p>
            Checks whether multiple rows
            contain identical values across
            the dataset.
          </p>
        </div>

        <Copy size={20} />
      </div>

      <div className="duplicate-layout">
        <div
          className={`duplicate-status ${
            hasDuplicates
              ? "has-duplicates"
              : "no-duplicates"
          }`}
        >
          {hasDuplicates ? (
            <Copy size={28} />
          ) : (
            <CheckCircle2 size={28} />
          )}

          <strong>
            {hasDuplicates
              ? "Duplicates detected"
              : "No duplicates detected"}
          </strong>

          <span>
            {hasDuplicates
              ? "Some rows may contain repeated records."
              : "Every analyzed row is unique."}
          </span>
        </div>

        <div className="duplicate-metrics">
          <div className="duplicate-metric">
            <span>
              Duplicate rows
            </span>

            <strong>
              {duplicateCount.toLocaleString()}
            </strong>
          </div>

          <div className="duplicate-metric">
            <span>
              Duplicate percentage
            </span>

            <strong>
              {duplicatePercentage.toFixed(
                2
              )}
              %
            </strong>
          </div>

          <div className="duplicate-metric">
            <span>
              Unique rows
            </span>

            <strong>
              {uniqueRows.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {hasDuplicates &&
        duplicates?.duplicateRows
          ?.length > 0 && (
          <div className="duplicate-preview">
            <div className="duplicate-preview-heading">
              <Database size={16} />

              <strong>
                Duplicate row preview
              </strong>
            </div>

            <div className="duplicate-list">
              {duplicates.duplicateRows
                .slice(0, 5)
                .map((item) => (
                  <div
                    className="duplicate-row"
                    key={`${item.index}-${item.duplicateOf}`}
                  >
                    <span>
                      Row{" "}
                      {item.index + 1}
                    </span>

                    <span>
                      duplicates row{" "}
                      {item.duplicateOf +
                        1}
                    </span>
                  </div>
                ))}
            </div>

            {duplicates.duplicateRows
              .length > 5 && (
              <p className="duplicate-more">
                +
                {(
                  duplicates
                    .duplicateRows
                    .length - 5
                ).toLocaleString()}{" "}
                more duplicate rows
              </p>
            )}
          </div>
        )}
    </section>
  );
}