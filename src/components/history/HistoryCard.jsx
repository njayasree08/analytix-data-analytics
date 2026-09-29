import {
  CalendarDays,
  Database,
  FileSpreadsheet,
  Rows3,
  Trash2,
} from "lucide-react";

export default function HistoryCard({
  item,
  onOpen,
  onDelete,
}) {
  return (
    <article className="history-card">
      <div className="history-card-top">
        <div className="history-file-icon">
          <FileSpreadsheet
            size={20}
          />
        </div>

        <div className="history-card-title">
          <h3>
            {item.fileName}
          </h3>

          <span>
            {item.fileType}
          </span>
        </div>

        <button
          className="history-delete-button"
          onClick={() =>
            onDelete(item.id)
          }
          aria-label={`Delete ${item.fileName} from history`}
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="history-card-stats">
        <div>
          <Rows3 size={14} />

          <span>
            {Number(
              item.rowCount || 0
            ).toLocaleString()}{" "}
            rows
          </span>
        </div>

        <div>
          <Database size={14} />

          <span>
            {Number(
              item.columnCount || 0
            ).toLocaleString()}{" "}
            columns
          </span>
        </div>
      </div>

      <div className="history-card-bottom">
        <div className="history-date">
          <CalendarDays size={13} />

          <span>
            {formatDate(
              item.uploadedAt
            )}
          </span>
        </div>

        {item.cleaned && (
          <span className="history-cleaned-badge">
            Cleaned
          </span>
        )}
      </div>

      <button
        className="primary-button history-open-button"
        onClick={() =>
          onOpen(item)
        }
      >
        Open dataset
      </button>
    </article>
  );
}

function formatDate(
  value
) {
  if (!value) {
    return "Unknown date";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unknown date";
  }

  return date.toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}