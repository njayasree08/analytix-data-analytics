import Papa from "papaparse";
import * as XLSX from "xlsx";

export async function parseFile(file) {
  if (!file) {
    throw new Error(
      "No file selected."
    );
  }

  const extension =
    file.name
      .split(".")
      .pop()
      .toLowerCase();

  if (
    !["csv", "xlsx", "xls"].includes(
      extension
    )
  ) {
    throw new Error(
      "Unsupported file type. Please upload CSV, XLS, or XLSX."
    );
  }

  if (extension === "csv") {
    return parseCSV(file);
  }

  return parseExcel(file);
}

/* =========================================================
   CSV
========================================================= */

function parseCSV(file) {
  return new Promise(
    (resolve, reject) => {
      Papa.parse(file, {
        header: true,

        skipEmptyLines: true,

        dynamicTyping: true,

        transformHeader: (header) =>
          String(header).trim(),

        complete: (results) => {
          if (
            results.errors &&
            results.errors.length > 0
          ) {
            console.warn(
              "CSV parsing warnings:",
              results.errors
            );
          }

          const data =
            Array.isArray(results.data)
              ? results.data
              : [];

          const columns =
            results.meta?.fields || [];

          if (!columns.length) {
            reject(
              new Error(
                "No columns were detected in the CSV file."
              )
            );

            return;
          }

          resolve({
            fileName: file.name,

            fileType: "CSV",

            data,

            columns,

            rowCount: data.length,

            columnCount:
              columns.length,
          });
        },

        error: () => {
          reject(
            new Error(
              "Failed to read the CSV file."
            )
          );
        },
      });
    }
  );
}

/* =========================================================
   EXCEL
========================================================= */

async function parseExcel(file) {
  try {
    const buffer =
      await file.arrayBuffer();

    const workbook = XLSX.read(
      buffer,
      {
        type: "array",
        cellDates: true,
      }
    );

    if (
      !workbook.SheetNames ||
      workbook.SheetNames.length === 0
    ) {
      throw new Error(
        "The Excel file does not contain any sheets."
      );
    }

    const sheetName =
      workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error(
        "Unable to read the first worksheet."
      );
    }

    const data =
      XLSX.utils.sheet_to_json(
        worksheet,
        {
          defval: null,
          raw: true,
        }
      );

    const columns =
      data.length > 0
        ? Object.keys(data[0])
        : getWorksheetColumns(
            worksheet
          );

    if (!columns.length) {
      throw new Error(
        "No columns were detected in the Excel file."
      );
    }

    return {
      fileName: file.name,

      fileType:
        extensionToType(file.name),

      sheetName,

      data,

      columns,

      rowCount: data.length,

      columnCount: columns.length,

      availableSheets:
        workbook.SheetNames,
    };
  } catch (error) {
    throw new Error(
      error.message ||
        "Failed to read the Excel file."
    );
  }
}

/* =========================================================
   HELPERS
========================================================= */

function extensionToType(
  fileName
) {
  const extension =
    fileName
      .split(".")
      .pop()
      .toLowerCase();

  return extension === "xls"
    ? "XLS"
    : "XLSX";
}

function getWorksheetColumns(
  worksheet
) {
  const range =
    XLSX.utils.decode_range(
      worksheet["!ref"] || "A1"
    );

  const columns = [];

  for (
    let columnIndex = range.s.c;
    columnIndex <= range.e.c;
    columnIndex++
  ) {
    const cellAddress =
      XLSX.utils.encode_cell({
        r: range.s.r,
        c: columnIndex,
      });

    const cell =
      worksheet[cellAddress];

    if (cell?.v !== undefined) {
      columns.push(
        String(cell.v)
      );
    }
  }

  return columns;
}