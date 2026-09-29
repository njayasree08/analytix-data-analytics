import { useMemo } from "react";

import { useDataset } from "../context/DatasetContext";

export default function useAnalysis() {
  const {
    dataset,
    analysis,
    analysisLoading,
    analysisError,
    hasDataset,
    hasAnalysis,
  } = useDataset();

  const summary = useMemo(() => {
    if (!analysis) {
      return {
        rows: 0,
        columns: 0,
        numericColumns: 0,
        categoricalColumns: 0,
        dateColumns: 0,
        missingValues: 0,
        duplicateRows: 0,
        outlierValues: 0,
        completeness: 100,
      };
    }

    const outlierValues = Object.values(
      analysis.outliers || {}
    ).reduce(
      (total, item) =>
        total + (item?.outlierCount || 0),
      0
    );

    return {
      rows:
        analysis.overview?.rowCount ||
        dataset?.rowCount ||
        0,

      columns:
        analysis.overview?.columnCount ||
        dataset?.columnCount ||
        0,

      numericColumns:
        analysis.overview
          ?.numericColumnCount || 0,

      categoricalColumns:
        analysis.overview
          ?.categoricalColumnCount || 0,

      dateColumns:
        analysis.overview?.dateColumnCount ||
        0,

      missingValues:
        analysis.missingValues
          ?.totalMissing || 0,

      duplicateRows:
        analysis.duplicates
          ?.duplicateCount || 0,

      outlierValues,

      completeness:
        analysis.missingValues
          ?.completeness ?? 100,
    };
  }, [analysis, dataset]);

  return {
    dataset,
    analysis,

    loading: analysisLoading,
    error: analysisError,

    hasDataset,
    hasAnalysis,

    summary,
  };
}