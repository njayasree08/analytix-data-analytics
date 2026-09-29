import {
  classifyDataset,
  getNumericColumns,
} from "./dataTypes";

import {
  calculateColumnStatistics,
} from "./statistics";

import {
  analyzeMissingValues,
} from "./missingValues";

import {
  detectDuplicates,
} from "./duplicates";

import {
  detectOutliers,
} from "./outliers";

import {
  calculateCorrelationMatrix,
} from "./correlation";

import {
  calculateFeatureImportance,
} from "./featureImportance";

import {
  generateInsights,
} from "./insightsGenerator";

export function profileDataset(
  data = [],
  columns = []
) {
  const typeProfile =
    classifyDataset(
      data,
      columns
    );

  const numericColumns =
    getNumericColumns(
      typeProfile
    );

  const statistics =
    calculateColumnStatistics(
      data,
      numericColumns
    );

  const missingValues =
    analyzeMissingValues(
      data,
      columns
    );

  const duplicates =
    detectDuplicates(
      data,
      columns
    );

  const outliers = {};

  numericColumns.forEach(
    (column) => {
      const values = data.map(
        (row) => row[column]
      );

      outliers[column] =
        detectOutliers(values);
    }
  );

  const correlations =
    calculateCorrelationMatrix(
      data,
      numericColumns
    );

  const featureImportance =
    calculateFeatureImportance(
      data,
      typeProfile,
      correlations
    );

  const baseAnalysis = {
    overview: {
      rowCount: data.length,

      columnCount:
        columns.length,

      numericColumnCount:
        numericColumns.length,

      categoricalColumnCount:
        typeProfile.filter(
          (item) =>
            item.type ===
            "categorical"
        ).length,

      dateColumnCount:
        typeProfile.filter(
          (item) =>
            item.type === "date"
        ).length,
    },

    types: typeProfile,

    numericColumns,

    statistics,

    missingValues,

    duplicates,

    outliers,

    correlations,

    featureImportance,
  };

  const insights =
    generateInsights({
      data,
      columns,
      analysis:
        baseAnalysis,
    });

  return {
    ...baseAnalysis,

    insights,

    analyzedAt:
      new Date().toISOString(),
  };
}