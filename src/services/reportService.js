import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import { saveAs } from "file-saver";

import Papa from "papaparse";

/**
 * Download the current dataset as CSV.
 */
export function exportDatasetCSV(
  data = [],
  fileName = "dataset.csv"
) {
  if (!data.length) {
    throw new Error(
      "There is no data available to export."
    );
  }

  const csv = Papa.unparse(data);

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  saveAs(
    blob,
    getFileName(
      fileName,
      "csv"
    )
  );
}

/**
 * Download the current dataset as Excel.
 */
export function exportDatasetExcel(
  data = [],
  fileName = "dataset.xlsx"
) {
  if (!data.length) {
    throw new Error(
      "There is no data available to export."
    );
  }

  const worksheet =
    XLSX.utils.json_to_sheet(
      data
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Dataset"
  );

  XLSX.writeFile(
    workbook,
    getFileName(
      fileName,
      "xlsx"
    )
  );
}

/**
 * Generate a complete PDF analytics report.
 */
export function exportAnalyticsPDF({
  dataset,
  analysis,
}) {
  if (!dataset || !analysis) {
    throw new Error(
      "A dataset and analysis are required to generate the report."
    );
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const reportTitle =
    "Intelligent Data Analytics Report";

  const fileName =
    getFileName(
      dataset.fileName ||
        "dataset",
      "pdf",
      "-analytics-report"
    );

  addPDFHeader(
    pdf,
    reportTitle
  );

  addDatasetOverview(
    pdf,
    dataset,
    analysis
  );

  addDataQualitySection(
    pdf,
    analysis
  );

  addStatisticsSection(
    pdf,
    analysis
  );

  addFeatureSection(
    pdf,
    analysis
  );

  addCorrelationSection(
    pdf,
    analysis
  );

  addOutlierSection(
    pdf,
    analysis
  );

  addInsightsSection(
    pdf,
    analysis
  );

  addPDFFooter(pdf);

  pdf.save(fileName);
}

/**
 * Header section.
 */
function addPDFHeader(
  pdf,
  title
) {
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");

  pdf.text(
    title,
    15,
    20
  );

  pdf.setFontSize(9);
  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setTextColor(
    100,
    100,
    100
  );

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    15,
    27
  );

  pdf.setTextColor(
    0,
    0,
    0
  );
}

/**
 * Dataset overview.
 */
function addDatasetOverview(
  pdf,
  dataset,
  analysis
) {
  addSectionTitle(
    pdf,
    "1. Dataset Overview"
  );

  autoTable(pdf, {
    startY: 38,

    head: [
      [
        "Metric",
        "Value",
      ],
    ],

    body: [
      [
        "Dataset",
        dataset.fileName ||
          "Dataset",
      ],
      [
        "File type",
        dataset.fileType ||
          "Unknown",
      ],
      [
        "Rows",
        formatNumber(
          dataset.rowCount
        ),
      ],
      [
        "Columns",
        formatNumber(
          dataset.columnCount
        ),
      ],
      [
        "Numeric columns",
        formatNumber(
          analysis.overview
            ?.numericColumnCount
        ),
      ],
      [
        "Categorical columns",
        formatNumber(
          analysis.overview
            ?.categoricalColumnCount
        ),
      ],
      [
        "Date columns",
        formatNumber(
          analysis.overview
            ?.dateColumnCount
        ),
      ],
    ],

    theme: "grid",

    styles: {
      fontSize: 8,
    },

    headStyles: {
      fontSize: 8,
    },

    margin: {
      left: 15,
      right: 15,
    },
  });
}

/**
 * Data quality section.
 */
function addDataQualitySection(
  pdf,
  analysis
) {
  addSectionTitle(
    pdf,
    "2. Data Quality"
  );

  const missing =
    analysis.missingValues;

  const duplicates =
    analysis.duplicates;

  const completeness =
    missing?.completeness ??
    100;

  const totalMissing =
    missing?.totalMissing ||
    0;

  const duplicateCount =
    duplicates?.duplicateCount ||
    0;

  autoTable(pdf, {
    startY:
      getCurrentY(pdf) + 2,

    head: [
      [
        "Quality Metric",
        "Value",
      ],
    ],

    body: [
      [
        "Completeness",
        `${formatNumber(
          completeness
        )}%`,
      ],
      [
        "Missing cells",
        formatNumber(
          totalMissing
        ),
      ],
      [
        "Duplicate rows",
        formatNumber(
          duplicateCount
        ),
      ],
    ],

    theme: "grid",

    styles: {
      fontSize: 8,
    },

    headStyles: {
      fontSize: 8,
    },

    margin: {
      left: 15,
      right: 15,
    },
  });

  const missingColumns =
    missing?.columns?.filter(
      (item) =>
        item.hasMissing
    ) || [];

  if (
    missingColumns.length > 0
  ) {
    addSectionTitle(
      pdf,
      "Missing Values by Column"
    );

    autoTable(pdf, {
      startY:
        getCurrentY(pdf) + 2,

      head: [
        [
          "Column",
          "Missing",
          "Percentage",
        ],
      ],

      body:
        missingColumns
          .sort(
            (a, b) =>
              b.percentage -
              a.percentage
          )
          .slice(0, 30)
          .map(
            (item) => [
              item.column,
              formatNumber(
                item.missingCount
              ),
              `${formatNumber(
                item.percentage
              )}%`,
            ]
          ),

      theme: "grid",

      styles: {
        fontSize: 7,
      },

      headStyles: {
        fontSize: 7,
      },

      margin: {
        left: 15,
        right: 15,
      },
    });
  }
}

/**
 * Statistics section.
 */
function addStatisticsSection(
  pdf,
  analysis
) {
  addSectionTitle(
    pdf,
    "3. Statistical Summary"
  );

  const statistics =
    analysis.statistics || {};

  const rows =
    Object.entries(
      statistics
    ).map(
      ([column, stats]) => [
        column,
        formatNumber(
          stats.mean
        ),
        formatNumber(
          stats.median
        ),
        formatNumber(
          stats.min
        ),
        formatNumber(
          stats.max
        ),
        formatNumber(
          stats.standardDeviation
        ),
        formatNumber(
          stats.q1
        ),
        formatNumber(
          stats.q3
        ),
      ]
    );

  autoTable(pdf, {
    startY:
      getCurrentY(pdf) + 2,

    head: [
      [
        "Feature",
        "Mean",
        "Median",
        "Min",
        "Max",
        "Std Dev",
        "Q1",
        "Q3",
      ],
    ],

    body: rows,

    theme: "grid",

    styles: {
      fontSize: 6.5,
    },

    headStyles: {
      fontSize: 6.5,
    },

    margin: {
      left: 10,
      right: 10,
    },
  });
}

/**
 * Feature analysis section.
 */
function addFeatureSection(
  pdf,
  analysis
) {
  addSectionTitle(
    pdf,
    "4. Feature Analysis"
  );

  const features =
    analysis.featureImportance ||
    [];

  if (!features.length) {
    addText(
      pdf,
      "No feature relevance results are available."
    );

    return;
  }

  autoTable(pdf, {
    startY:
      getCurrentY(pdf) + 2,

    head: [
      [
        "Feature",
        "Score",
        "Reason",
      ],
    ],

    body: features
      .slice(0, 20)
      .map(
        (item) => [
          item.feature,
          `${formatNumber(
            item.score
          )}%`,
          item.reason ||
            "Statistical relevance",
        ]
      ),

    theme: "grid",

    styles: {
      fontSize: 7,
      cellWidth: "wrap",
    },

    headStyles: {
      fontSize: 7,
    },

    columnStyles: {
      0: {
        cellWidth: 35,
      },

      1: {
        cellWidth: 20,
      },

      2: {
        cellWidth: 120,
      },
    },

    margin: {
      left: 10,
      right: 10,
    },
  });
}

/**
 * Correlation section.
 */
function addCorrelationSection(
  pdf,
  analysis
) {
  addSectionTitle(
    pdf,
    "5. Correlation Analysis"
  );

  const correlations =
    analysis.correlations || {};

  const rows = [];

  Object.entries(
    correlations
  ).forEach(
    ([columnA, values]) => {
      Object.entries(
        values || {}
      ).forEach(
        ([columnB, value]) => {
          if (
            columnA === columnB ||
            value === null ||
            value === undefined
          ) {
            return;
          }

          const exists =
            rows.some(
              (row) =>
                row[0] === columnB &&
                row[1] === columnA
            );

          if (!exists) {
            rows.push([
              columnA,
              columnB,
              formatNumber(value),
              getCorrelationStrength(
                value
              ),
            ]);
          }
        }
      );
    }
  );

  rows.sort(
    (a, b) =>
      Math.abs(
        Number(b[2])
      ) -
      Math.abs(
        Number(a[2])
      )
  );

  if (!rows.length) {
    addText(
      pdf,
      "No correlation results are available."
    );

    return;
  }

  autoTable(pdf, {
    startY:
      getCurrentY(pdf) + 2,

    head: [
      [
        "Feature A",
        "Feature B",
        "Pearson r",
        "Strength",
      ],
    ],

    body: rows
      .slice(0, 30),

    theme: "grid",

    styles: {
      fontSize: 7,
    },

    headStyles: {
      fontSize: 7,
    },

    margin: {
      left: 15,
      right: 15,
    },
  });
}

/**
 * Outlier section.
 */
function addOutlierSection(
  pdf,
  analysis
) {
  addSectionTitle(
    pdf,
    "6. Outlier Analysis"
  );

  const outliers =
    analysis.outliers || {};

  const rows =
    Object.entries(
      outliers
    ).map(
      ([column, result]) => [
        column,
        formatNumber(
          result.outlierCount
        ),
        `${formatNumber(
          result.outlierPercentage
        )}%`,
        formatNumber(
          result.lowerBound
        ),
        formatNumber(
          result.upperBound
        ),
      ]
    );

  if (!rows.length) {
    addText(
      pdf,
      "No numeric outlier analysis is available."
    );

    return;
  }

  autoTable(pdf, {
    startY:
      getCurrentY(pdf) + 2,

    head: [
      [
        "Feature",
        "Outliers",
        "Percentage",
        "Lower Bound",
        "Upper Bound",
      ],
    ],

    body: rows,

    theme: "grid",

    styles: {
      fontSize: 7,
    },

    headStyles: {
      fontSize: 7,
    },

    margin: {
      left: 10,
      right: 10,
    },
  });
}

/**
 * Insights section.
 */
function addInsightsSection(
  pdf,
  analysis
) {
  addSectionTitle(
    pdf,
    "7. Intelligent Insights"
  );

  const insights =
    analysis.insights || [];

  if (!insights.length) {
    addText(
      pdf,
      "No automated insights are available."
    );

    return;
  }

  autoTable(pdf, {
    startY:
      getCurrentY(pdf) + 2,

    head: [
      [
        "Priority",
        "Insight",
        "Description",
      ],
    ],

    body: insights
      .slice(0, 25)
      .map(
        (item) => [
          String(
            item.priority ||
              "low"
          ).toUpperCase(),

          item.title ||
            "Insight",

          item.description ||
            "",
        ]
      ),

    theme: "grid",

    styles: {
      fontSize: 7,
      cellWidth: "wrap",
    },

    headStyles: {
      fontSize: 7,
    },

    columnStyles: {
      0: {
        cellWidth: 22,
      },

      1: {
        cellWidth: 48,
      },

      2: {
        cellWidth: 110,
      },
    },

    margin: {
      left: 10,
      right: 10,
    },
  });
}

/**
 * Section title helper.
 */
function addSectionTitle(
  pdf,
  title
) {
  let y =
    getCurrentY(pdf) + 8;

  if (y > 270) {
    pdf.addPage();

    y = 20;
  }

  pdf.setFontSize(12);
  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.text(
    title,
    15,
    y
  );

  pdf.setFontSize(8);
  pdf.setFont(
    "helvetica",
    "normal"
  );
}

/**
 * Add normal text.
 */
function addText(
  pdf,
  text
) {
  let y =
    getCurrentY(pdf) + 4;

  if (y > 275) {
    pdf.addPage();

    y = 20;
  }

  pdf.setFontSize(8);

  pdf.text(
    text,
    15,
    y
  );
}

/**
 * Footer on every PDF page.
 */
function addPDFFooter(pdf) {
  const totalPages =
    pdf.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pdf.setPage(page);

    const pageHeight =
      pdf.internal.pageSize
        .height;

    pdf.setFontSize(7);

    pdf.setTextColor(
      120,
      120,
      120
    );

    pdf.text(
      `Intelligent Data Analytics Platform • Page ${page} of ${totalPages}`,
      15,
      pageHeight - 10
    );

    pdf.setTextColor(
      0,
      0,
      0
    );
  }
}

/**
 * Get current PDF cursor position.
 */
function getCurrentY(pdf) {
  return (
    pdf.lastAutoTable?.finalY ||
    30
  );
}

/**
 * Format numbers safely.
 */
function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return number.toLocaleString(
    undefined,
    {
      maximumFractionDigits: 3,
    }
  );
}

/**
 * Describe correlation strength.
 */
function getCorrelationStrength(
  value
) {
  const absolute =
    Math.abs(Number(value));

  if (absolute >= 0.8) {
    return "Strong";
  }

  if (absolute >= 0.5) {
    return "Moderate";
  }

  if (absolute >= 0.3) {
    return "Weak";
  }

  return "Very weak";
}

/**
 * Build a clean filename.
 */
function getFileName(
  originalName,
  extension,
  suffix = ""
) {
  const baseName =
    String(
      originalName ||
        "dataset"
    ).replace(
      /\.[^/.]+$/,
      ""
    );

  return `${baseName}${suffix}.${extension}`;
}