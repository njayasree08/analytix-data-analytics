import {
  AlertCircle,
  FileText,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";

import { useDataset } from "../context/DatasetContext";

import {
  exportAnalyticsPDF,
  exportDatasetCSV,
  exportDatasetExcel,
} from "../services/reportService";

import ReportSummary from "../components/reports/ReportSummary";

import ReportExportCards from "../components/reports/ReportExportCards";

export default function ReportsPage() {
  const {
    dataset,
    analysis,
    hasDataset,
  } = useDataset();

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  if (!hasDataset) {
    return (
      <section className="panel">
        <div className="empty-dashboard">
          <FileText size={30} />

          <h2>
            No dataset loaded
          </h2>

          <p>
            Upload a dataset before
            generating reports.
          </p>
        </div>
      </section>
    );
  }

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function handleCSV() {
    clearMessages();

    try {
      exportDatasetCSV(
        dataset.data,
        dataset.fileName
      );

      setSuccess(
        "CSV export completed successfully."
      );
    } catch (exportError) {
      setError(
        exportError.message ||
          "Unable to export CSV."
      );
    }
  }

  function handleExcel() {
    clearMessages();

    try {
      exportDatasetExcel(
        dataset.data,
        dataset.fileName
      );

      setSuccess(
        "Excel export completed successfully."
      );
    } catch (exportError) {
      setError(
        exportError.message ||
          "Unable to export Excel."
      );
    }
  }

  function handlePDF() {
    clearMessages();

    try {
      exportAnalyticsPDF({
        dataset,
        analysis,
      });

      setSuccess(
        "PDF analytics report generated successfully."
      );
    } catch (exportError) {
      console.error(
        "PDF export error:",
        exportError
      );

      setError(
        exportError.message ||
          "Unable to generate PDF report."
      );
    }
  }

  return (
    <div>
      <ReportSummary
        dataset={dataset}
        analysis={analysis}
      />

      {error && (
        <div className="report-message error">
          <AlertCircle size={16} />

          <span>
            {error}
          </span>
        </div>
      )}

      {success && (
        <div className="report-message success">
          <Sparkles size={16} />

          <span>
            {success}
          </span>
        </div>
      )}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              Export your analysis
            </h2>

            <p>
              Download your dataset or
              generate a complete analytics
              report.
            </p>
          </div>

          <FileText size={20} />
        </div>

        <ReportExportCards
          onCSV={handleCSV}
          onExcel={handleExcel}
          onPDF={handlePDF}
        />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              Report contents
            </h2>

            <p>
              The PDF report automatically
              summarizes the current
              analysis.
            </p>
          </div>
        </div>

        <div className="report-content-grid">
          <ReportContent
            title="Dataset overview"
            text="Rows, columns, file type, and detected data types."
          />

          <ReportContent
            title="Data quality"
            text="Completeness, missing values, and duplicate rows."
          />

          <ReportContent
            title="Statistics"
            text="Mean, median, minimum, maximum, standard deviation, quartiles, and other statistics."
          />

          <ReportContent
            title="Feature analysis"
            text="Statistical feature relevance and supporting reasons."
          />

          <ReportContent
            title="Correlation analysis"
            text="Pearson correlation relationships between numeric features."
          />

          <ReportContent
            title="Outlier analysis"
            text="IQR-based potential outliers and detected bounds."
          />

          <ReportContent
            title="Intelligent insights"
            text="Automatically generated observations from the dataset analysis."
          />
        </div>
      </section>
    </div>
  );
}

function ReportContent({
  title,
  text,
}) {
  return (
    <div className="report-content-item">
      <div className="report-content-dot" />

      <div>
        <strong>
          {title}
        </strong>

        <p>
          {text}
        </p>
      </div>
    </div>
  );
}