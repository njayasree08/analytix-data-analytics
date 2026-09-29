import {
  Download,
  FileSpreadsheet,
  FileText,
  Table2,
} from "lucide-react";

export default function ReportExportCards({
  onCSV,
  onExcel,
  onPDF,
}) {
  const exports = [
    {
      icon: Table2,
      title: "CSV Dataset",
      description:
        "Export the current dataset as a CSV file.",
      button:
        "Download CSV",
      action: onCSV,
    },
    {
      icon: FileSpreadsheet,
      title: "Excel Dataset",
      description:
        "Export the current dataset as an XLSX workbook.",
      button:
        "Download Excel",
      action: onExcel,
    },
    {
      icon: FileText,
      title: "Analytics Report",
      description:
        "Generate a PDF containing analysis, statistics, quality findings, and insights.",
      button:
        "Generate PDF",
      action: onPDF,
    },
  ];

  return (
    <div className="report-export-grid">
      {exports.map(
        ({
          icon: Icon,
          title,
          description,
          button,
          action,
        }) => (
          <article
            className="report-export-card"
            key={title}
          >
            <div className="report-export-icon">
              <Icon size={20} />
            </div>

            <h3>
              {title}
            </h3>

            <p>
              {description}
            </p>

            <button
              className="secondary-button"
              onClick={action}
            >
              <Download size={14} />
              {button}
            </button>
          </article>
        )
      )}
    </div>
  );
}