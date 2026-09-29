import {
  Database,
  FileSpreadsheet,
  FolderOpen,
  Trash2,
  Clock3,
  Rows3,
  Columns3,
  RefreshCw,
  HardDrive,
} from "lucide-react";

import { useDataset } from "../context/DatasetContext";

import "../styles/history.css";

export default function HistoryPage({
  onNavigate,
}) {
  const {
    savedDatasets,
    storageLoading,
    storageError,
    openSavedDataset,
    removeSavedDataset,
    loadSavedDatasets,
  } = useDataset();

  function handleOpen(datasetId) {
    openSavedDataset(datasetId);

    if (onNavigate) {
      onNavigate("Dashboard");
    }
  }

  async function handleDelete(dataset) {
    const confirmed =
      window.confirm(
        `Delete "${dataset.fileName}" from saved history?`
      );

    if (!confirmed) {
      return;
    }

    await removeSavedDataset(
      dataset.id
    );
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Unknown date";
    }

    const date =
      new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return (
    <div className="history-page">
      <section className="history-summary">

        <div className="history-summary-card">
          <div className="history-summary-icon">
            <Database size={20} />
          </div>

          <div>
            <span>
              SAVED DATASETS
            </span>

            <strong>
              {savedDatasets.length}
            </strong>
          </div>
        </div>


        <div className="history-summary-card">
          <div className="history-summary-icon blue">
            <HardDrive size={20} />
          </div>

          <div>
            <span>
              STORAGE
            </span>

            <strong>
              Browser
            </strong>
          </div>
        </div>


        <div className="history-summary-card">
          <div className="history-summary-icon cyan">
            <Clock3 size={20} />
          </div>

          <div>
            <span>
              PERSISTENCE
            </span>

            <strong>
              IndexedDB
            </strong>
          </div>
        </div>

      </section>


      <section className="history-panel">

        <div className="history-panel-header">

          <div>
            <div className="history-kicker">
              DATASET LIBRARY
            </div>

            <h2>
              Saved datasets
            </h2>

            <p>
              Your uploaded datasets are
              stored locally in this browser
              and can be reopened anytime.
            </p>
          </div>


          <button
            className="history-refresh-button"
            onClick={
              loadSavedDatasets
            }
            disabled={
              storageLoading
            }
          >
            <RefreshCw
              size={15}
              className={
                storageLoading
                  ? "history-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>


        {storageError && (
          <div className="history-error">
            <Database size={17} />

            <span>
              {storageError}
            </span>
          </div>
        )}


        {storageLoading ? (
          <div className="history-loading">

            <RefreshCw
              size={27}
              className="history-spin"
            />

            <h3>
              Loading saved datasets...
            </h3>

            <p>
              Reading your local dataset
              library.
            </p>

          </div>
        ) : savedDatasets.length ===
          0 ? (
          <div className="history-empty">

            <div className="history-empty-icon">
              <Database size={30} />
            </div>

            <h3>
              No saved datasets yet
            </h3>

            <p>
              Upload a CSV or Excel file
              and Analytix will automatically
              save it here.
            </p>

            {onNavigate && (
              <button
                className="history-primary-button"
                onClick={() =>
                  onNavigate(
                    "Upload Dataset"
                  )
                }
              >
                <FileSpreadsheet
                  size={16}
                />

                Upload Dataset
              </button>
            )}

          </div>
        ) : (
          <div className="history-list">

            {savedDatasets.map(
              (savedDataset) => (
                <article
                  className="history-dataset-card"
                  key={
                    savedDataset.id
                  }
                >

                  <div className="history-file-icon">
                    <FileSpreadsheet
                      size={24}
                    />
                  </div>


                  <div className="history-dataset-main">

                    <div className="history-dataset-title-row">

                      <h3
                        title={
                          savedDataset.fileName
                        }
                      >
                        {
                          savedDataset.fileName
                        }
                      </h3>

                      <span className="history-file-type">
                        {
                          savedDataset.fileType ||
                          "DATASET"
                        }
                      </span>

                    </div>


                    <div className="history-dataset-meta">

                      <span>
                        <Rows3
                          size={14}
                        />

                        {(
                          savedDataset.rowCount ||
                          0
                        ).toLocaleString()}{" "}
                        rows
                      </span>


                      <span>
                        <Columns3
                          size={14}
                        />

                        {
                          savedDataset.columnCount ||
                          0
                        }{" "}
                        columns
                      </span>


                      <span>
                        <Clock3
                          size={14}
                        />

                        {formatDate(
                          savedDataset.uploadedAt
                        )}
                      </span>

                    </div>

                  </div>


                  <div className="history-dataset-actions">

                    <button
                      className="history-open-button"
                      onClick={() =>
                        handleOpen(
                          savedDataset.id
                        )
                      }
                    >
                      <FolderOpen
                        size={15}
                      />

                      Open
                    </button>


                    <button
                      className="history-delete-button"
                      onClick={() =>
                        handleDelete(
                          savedDataset
                        )
                      }
                      title="Delete dataset"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </section>


      <section className="history-info">

        <div className="history-info-icon">
          <HardDrive size={19} />
        </div>

        <div>
          <strong>
            Your datasets stay on this device
          </strong>

          <p>
            Analytix uses your browser's
            IndexedDB storage. Your uploaded
            files are not sent to a server
            by this storage feature.
          </p>
        </div>

      </section>

    </div>
  );
}