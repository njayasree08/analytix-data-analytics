import Papa from "papaparse";

import { calculateStatistics } from "../analysis/statistics";
import { detectOutliers } from "../analysis/outliers";

/**
 * Create a deep copy of dataset rows.
 */
export function cloneData(data = []) {
  return data.map((row) => ({
    ...row,
  }));
}

/**
 * Analyze the current cleaning state.
 */
export function getCleaningSummary(
  data = [],
  columns = []
) {
  const totalCells =
    data.length * columns.length;

  let missingCells = 0;

  columns.forEach((column) => {
    data.forEach((row) => {
      if (isMissing(row[column])) {
        missingCells += 1;
      }
    });
  });

  const duplicateCount =
    getDuplicateRowIndexes(
      data,
      columns
    ).length;

  const completeness =
    totalCells === 0
      ? 100
      : ((totalCells - missingCells) /
          totalCells) *
        100;

  return {
    rows: data.length,
    columns: columns.length,
    missingCells,
    duplicateRows: duplicateCount,
    completeness,
  };
}

/**
 * Apply cleaning operations.
 *
 * options:
 * - removeDuplicates
 * - trimWhitespace
 * - missingStrategy
 * - missingConstant
 * - removeOutliers
 * - outlierStrategy
 */
export function cleanDataset({
  data = [],
  columns = [],
  profile = [],
  options = {},
}) {
  let cleanedData = cloneData(data);

  const changes = [];

  if (options.trimWhitespace) {
    const result =
      trimWhitespace(
        cleanedData,
        columns
      );

    cleanedData = result.data;

    if (result.changed > 0) {
      changes.push({
        type: "trim",
        count: result.changed,
        description: `Trimmed whitespace in ${result.changed} cells.`,
      });
    }
  }

  if (
    options.missingStrategy &&
    options.missingStrategy !== "none"
  ) {
    const result =
      handleMissingValues(
        cleanedData,
        columns,
        profile,
        options.missingStrategy,
        options.missingConstant
      );

    cleanedData = result.data;

    if (result.changed > 0) {
      changes.push({
        type: "missing",
        count: result.changed,
        description:
          result.description,
      });
    }
  }

  if (options.removeDuplicates) {
    const result =
      removeDuplicates(
        cleanedData,
        columns
      );

    cleanedData = result.data;

    if (result.removed > 0) {
      changes.push({
        type: "duplicates",
        count: result.removed,
        description: `Removed ${result.removed} duplicate rows.`,
      });
    }
  }

  if (
    options.removeOutliers &&
    options.outlierStrategy &&
    options.outlierStrategy !== "none"
  ) {
    const result =
      handleOutliers(
        cleanedData,
        profile,
        options.outlierStrategy
      );

    cleanedData = result.data;

    if (result.changed > 0) {
      changes.push({
        type: "outliers",
        count: result.changed,
        description:
          result.description,
      });
    }
  }

  return {
    data: cleanedData,
    changes,
    summary: getCleaningSummary(
      cleanedData,
      columns
    ),
  };
}

/**
 * Trim leading and trailing whitespace
 * from string values.
 */
export function trimWhitespace(
  data = [],
  columns = []
) {
  let changed = 0;

  const cleanedData = data.map(
    (row) => {
      const newRow = {
        ...row,
      };

      columns.forEach((column) => {
        const value = newRow[column];

        if (
          typeof value === "string"
        ) {
          const trimmed =
            value.trim();

          if (trimmed !== value) {
            newRow[column] =
              trimmed;

            changed += 1;
          }
        }
      });

      return newRow;
    }
  );

  return {
    data: cleanedData,
    changed,
  };
}

/**
 * Handle missing values.
 *
 * Strategies:
 * - remove
 * - mean
 * - median
 * - mode
 * - constant
 */
export function handleMissingValues(
  data = [],
  columns = [],
  profile = [],
  strategy = "none",
  constantValue = "Unknown"
) {
  if (strategy === "none") {
    return {
      data,
      changed: 0,
      description: "",
    };
  }

  if (strategy === "remove") {
    const originalLength =
      data.length;

    const cleanedData = data.filter(
      (row) =>
        !columns.some((column) =>
          isMissing(row[column])
        )
    );

    const removed =
      originalLength -
      cleanedData.length;

    return {
      data: cleanedData,
      changed: removed,
      description: `Removed ${removed} rows containing missing values.`,
    };
  }

  const cleanedData =
    cloneData(data);

  let changed = 0;

  columns.forEach((column) => {
    const profileItem =
      profile.find(
        (item) =>
          item.column === column
      );

    const type =
      profileItem?.type;

    let replacement;

    if (strategy === "mean") {
      if (type !== "numeric") {
        return;
      }

      const values = cleanedData
        .map((row) => row[column])
        .filter(
          (value) =>
            !isMissing(value) &&
            Number.isFinite(
              Number(value)
            )
        );

      if (!values.length) {
        return;
      }

      const numbers =
        values.map(Number);

      replacement =
        numbers.reduce(
          (sum, value) =>
            sum + value,
          0
        ) / numbers.length;
    }

    if (strategy === "median") {
      if (type !== "numeric") {
        return;
      }

      const values = cleanedData
        .map((row) => row[column])
        .filter(
          (value) =>
            !isMissing(value) &&
            Number.isFinite(
              Number(value)
            )
        )
        .map(Number)
        .sort(
          (a, b) => a - b
        );

      if (!values.length) {
        return;
      }

      const middle =
        Math.floor(
          values.length / 2
        );

      replacement =
        values.length % 2 === 0
          ? (values[middle - 1] +
              values[middle]) /
            2
          : values[middle];
    }

    if (strategy === "mode") {
      const values = cleanedData
        .map((row) => row[column])
        .filter(
          (value) =>
            !isMissing(value)
        );

      if (!values.length) {
        return;
      }

      replacement =
        calculateMode(values);
    }

    if (strategy === "constant") {
      replacement =
        constantValue;
    }

    if (
      replacement === undefined ||
      replacement === null
    ) {
      return;
    }

    cleanedData.forEach((row) => {
      if (isMissing(row[column])) {
        row[column] = replacement;
        changed += 1;
      }
    });
  });

  return {
    data: cleanedData,
    changed,
    description: `Filled ${changed} missing values using the ${getStrategyLabel(
      strategy
    )} strategy.`,
  };
}

/**
 * Remove exact duplicate rows.
 */
export function removeDuplicates(
  data = [],
  columns = []
) {
  const seen = new Set();

  const cleanedData = [];

  data.forEach((row) => {
    const key = columns
      .map((column) =>
        normalizeValue(row[column])
      )
      .join("||");

    if (!seen.has(key)) {
      seen.add(key);
      cleanedData.push(row);
    }
  });

  return {
    data: cleanedData,
    removed:
      data.length -
      cleanedData.length,
  };
}

/**
 * Handle IQR outliers.
 *
 * Strategies:
 * - remove
 * - cap
 */
export function handleOutliers(
  data = [],
  profile = [],
  strategy = "none"
) {
  if (strategy === "none") {
    return {
      data,
      changed: 0,
      description: "",
    };
  }

  const cleanedData =
    cloneData(data);

  const numericColumns =
    profile
      .filter(
        (item) =>
          item.type === "numeric"
      )
      .map(
        (item) => item.column
      );

  if (!numericColumns.length) {
    return {
      data: cleanedData,
      changed: 0,
      description:
        "No numeric columns were available for outlier handling.",
    };
  }

  if (strategy === "remove") {
    const rowsToRemove =
      new Set();

    numericColumns.forEach(
      (column) => {
        const values =
          cleanedData.map(
            (row) =>
              row[column]
          );

        const result =
          detectOutliers(values);

        if (
          !result.outlierCount
        ) {
          return;
        }

        cleanedData.forEach(
          (row, index) => {
            const value =
              Number(
                row[column]
              );

            if (
              Number.isFinite(
                value
              ) &&
              (value <
                result.lowerBound ||
                value >
                  result.upperBound)
            ) {
              rowsToRemove.add(
                index
              );
            }
          }
        );
      }
    );

    const finalData =
      cleanedData.filter(
        (_, index) =>
          !rowsToRemove.has(index)
      );

    return {
      data: finalData,
      changed:
        rowsToRemove.size,
      description: `Removed ${rowsToRemove.size} rows containing IQR outliers.`,
    };
  }

  if (strategy === "cap") {
    let changed = 0;

    numericColumns.forEach(
      (column) => {
        const values =
          cleanedData.map(
            (row) =>
              row[column]
          );

        const result =
          detectOutliers(values);

        if (
          result.lowerBound ===
            null ||
          result.upperBound ===
            null
        ) {
          return;
        }

        cleanedData.forEach(
          (row) => {
            const value =
              Number(
                row[column]
              );

            if (
              !Number.isFinite(
                value
              )
            ) {
              return;
            }

            if (
              value <
              result.lowerBound
            ) {
              row[column] =
                result.lowerBound;

              changed += 1;
            } else if (
              value >
              result.upperBound
            ) {
              row[column] =
                result.upperBound;

              changed += 1;
            }
          }
        );
      }
    );

    return {
      data: cleanedData,
      changed,
      description: `Capped ${changed} numeric values to their IQR bounds.`,
    };
  }

  return {
    data: cleanedData,
    changed: 0,
    description: "",
  };
}

/**
 * Download cleaned data as CSV.
 */
export function downloadCSV(
  data = [],
  fileName = "cleaned-dataset.csv"
) {
  const csv =
    Papa.unparse(data);

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function calculateMode(
  values
) {
  const frequencies =
    new Map();

  values.forEach((value) => {
    const key = String(value);

    frequencies.set(
      key,
      (frequencies.get(key) || 0) +
        1
    );
  });

  let mode =
    values[0];

  let highestFrequency = 0;

  frequencies.forEach(
    (frequency, key) => {
      if (
        frequency >
        highestFrequency
      ) {
        highestFrequency =
          frequency;

        mode =
          values.find(
            (value) =>
              String(value) ===
              key
          );
      }
    }
  );

  return mode;
}

function getDuplicateRowIndexes(
  data,
  columns
) {
  const seen = new Set();
  const duplicates = [];

  data.forEach((row, index) => {
    const key = columns
      .map((column) =>
        normalizeValue(row[column])
      )
      .join("||");

    if (seen.has(key)) {
      duplicates.push(index);
    } else {
      seen.add(key);
    }
  });

  return duplicates;
}

function normalizeValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value)
    .trim()
    .toLowerCase();
}

function isMissing(value) {
  return (
    value === null ||
    value === undefined ||
    value === ""
  );
}

function getStrategyLabel(
  strategy
) {
  switch (strategy) {
    case "mean":
      return "mean";

    case "median":
      return "median";

    case "mode":
      return "mode";

    case "constant":
      return "constant value";

    default:
      return strategy;
  }
}