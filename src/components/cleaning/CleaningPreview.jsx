import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
} from "lucide-react";

export default function CleaningPreview({
  preview,
  originalSummary,
  onDownload,
}) {
  if (!preview) {
    return (
      <div className="preview-empty">
        <FileSpreadsheet size={28} />

        <h2>
          Cleaning preview
        </h2>

        <p>
          Select cleaning options and
          click “Preview changes” to
          see what will change.
        </p>
      </div>
    );
  }

  const changes =
    preview.changes || [];

  return (
    <div>
      <div className="cleaning-preview-header">
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2
              size={18}
            />

            <strong>
              Preview generated
            </strong>
          </div>

          <p>
            These changes have not been
            applied to your active dataset
            yet.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={onDownload}
        >
          <Download size={15} />
          Download preview CSV
        </button>
      </div>

      <div className="cleaning-preview-grid">
        <PreviewMetric
          label="Rows before"
          value={
            originalSummary?.rows || 0
          }
        />

        <PreviewMetric
          label="Rows after"
          value={
            preview.summary?.rows || 0
          }
        />

        <PreviewMetric
          label="Missing before"
          value={
            originalSummary
              ?.missingCells || 0
          }
        />

        <PreviewMetric
          label="Missing after"
          value={
            preview.summary
              ?.missingCells || 0
          }
        />
      </div>

      <div className="cleaning-changes">
        <h3>
          Changes to be applied
        </h3>

        {changes.length > 0 ? (
          <div className="cleaning-change-list">
            {changes.map(
              (change, index) => (
                <div
                  className="cleaning-change-item"
                  key={`${change.type}-${index}`}
                >
                  <span className="status-dot" />

                  <div>
                    <strong>
                      {change.description}
                    </strong>

                    <span>
                      {change.count.toLocaleString()}{" "}
                      affected
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="empty-row">
            <CheckCircle2 size={18} />

            <span>
              No changes are required with
              the selected options.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewMetric({
  label,
  value,
}) {
  return (
    <div className="cleaning-preview-metric">
      <span>{label}</span>

      <strong>
        {Number(
          value || 0
        ).toLocaleString()}
      </strong>
    </div>
  );
}