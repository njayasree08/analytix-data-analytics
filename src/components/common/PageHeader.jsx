import {
  Database,
  Upload,
} from "lucide-react";

export default function PageHeader({
  eyebrow = "YOUR ANALYTICS WORKSPACE",
  title,
  description,
  dataset,
  onUpload,
}) {
  return (
    <div className="professional-page-header">
      <div className="page-header-content">
        <div className="page-header-eyebrow">
          <span className="eyebrow-dot" />
          {eyebrow}
        </div>

        <h1 className="page-header-title">
          {title}
        </h1>

        <p className="page-header-description">
          {description}
        </p>
      </div>

      <div className="page-header-actions">
        {dataset && (
          <div className="dataset-status-pill">
            <span className="dataset-status-dot" />

            <Database size={14} />

            <span className="dataset-status-name">
              {dataset.fileName}
            </span>

            <span className="dataset-status-meta">
              {dataset.rowCount?.toLocaleString() || 0} rows
              {" • "}
              {dataset.columnCount || 0} columns
            </span>
          </div>
        )}

        <button
          className="header-upload-button"
          onClick={onUpload}
        >
          <Upload size={15} />

          Upload dataset
        </button>
      </div>
    </div>
  );
}