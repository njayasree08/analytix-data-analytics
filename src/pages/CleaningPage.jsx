import {
  Broom,
  Download,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { useDataset } from "../context/DatasetContext";

import {
  cleanDataset,
  downloadCSV,
  getCleaningSummary,
} from "../services/cleaningService";

import CleaningSummary from "../components/cleaning/CleaningSummary";

import CleaningControls from "../components/cleaning/CleaningControls";

import CleaningPreview from "../components/cleaning/CleaningPreview";

export default function CleaningPage() {
  const {
    dataset,
    analysis,
    hasDataset,
    updateDataset,
    resetDataset,
  } = useDataset();

  const [options, setOptions] =
    useState({
      missingStrategy: "none",
      missingConstant: "Unknown",
      removeDuplicates: false,
      trimWhitespace: true,
      removeOutliers: false,
      outlierStrategy: "none",
    });

  const [preview, setPreview] =
    useState(null);

  const originalSummary =
    useMemo(() => {
      if (!dataset) {
        return null;
      }

      return getCleaningSummary(
        dataset.data,
        dataset.columns
      );
    }, [dataset]);

  if (!hasDataset) {
    return (
      <section className="panel">
        <div className="empty-dashboard">
          <Broom size={30} />

          <h2>
            No dataset loaded
          </h2>

          <p>
            Upload a dataset before
            opening the data cleaning
            workspace.
          </p>
        </div>
      </section>
    );
  }

  function createPreview() {
    const result =
      cleanDataset({
        data: dataset.data,
        columns: dataset.columns,
        profile:
          analysis?.types || [],
        options,
      });

    setPreview(result);
  }

  function applyCleaning() {
    if (!preview) {
      return;
    }

    if (
      preview.data.length ===
        dataset.data.length &&
      JSON.stringify(
        preview.data
      ) ===
        JSON.stringify(
          dataset.data
        )
    ) {
      return;
    }

    updateDataset({
      ...dataset,
      data: preview.data,
      rowCount:
        preview.data.length,
      columnCount:
        dataset.columns.length,
      cleaned: true,
      updatedAt:
        new Date().toISOString(),
    });

    setPreview(null);
  }

  function handleReset() {
    resetDataset();

    setPreview(null);
  }

  function handleDownloadPreview() {
    if (!preview) {
      return;
    }

    downloadCSV(
      preview.data,
      getCleanedFileName(
        dataset.fileName
      )
    );
  }

  function handleDownloadCurrent() {
    downloadCSV(
      dataset.data,
      getCleanedFileName(
        dataset.fileName
      )
    );
  }

  const hasChanges =
    Boolean(
      preview &&
        preview.changes?.length
    );

  return (
    <div>
      <CleaningSummary
        before={originalSummary}
        after={
          preview?.summary ||
          originalSummary
        }
      />

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              Data Cleaning
            </h2>

            <p>
              Prepare your dataset by
              handling missing values,
              duplicates, whitespace, and
              numeric outliers.
            </p>
          </div>

          <Sparkles size={20} />
        </div>

        <CleaningControls
          options={options}
          onChange={setOptions}
          onPreview={createPreview}
          onApply={applyCleaning}
          onReset={handleReset}
          hasPreview={
            Boolean(preview)
          }
          hasChanges={hasChanges}
        />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              Cleaning preview
            </h2>

            <p>
              Review the expected changes
              before applying them.
            </p>
          </div>

          <Broom size={20} />
        </div>

        <CleaningPreview
          preview={preview}
          originalSummary={
            originalSummary
          }
          onDownload={
            handleDownloadPreview
          }
        />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              Current dataset
            </h2>

            <p>
              Download the currently
              active dataset at any time.
            </p>
          </div>

          <Download size={20} />
        </div>

        <div className="cleaning-download-row">
          <div>
            <strong>
              {dataset.fileName}
            </strong>

            <span>
              {dataset.rowCount.toLocaleString()}{" "}
              rows ×{" "}
              {dataset.columnCount}{" "}
              columns
            </span>
          </div>

          <button
            className="secondary-button"
            onClick={
              handleDownloadCurrent
            }
          >
            <Download size={15} />
            Download CSV
          </button>

          <button
            className="secondary-button"
            onClick={handleReset}
          >
            <RotateCcw size={15} />
            Restore original
          </button>
        </div>
      </section>
    </div>
  );
}

function getCleanedFileName(
  originalName = "dataset.csv"
) {
  const baseName =
    originalName.replace(
      /\.[^/.]+$/,
      ""
    );

  return `${baseName}-cleaned.csv`;
}