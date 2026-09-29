export function analyzeMissingValues(
  data = [],
  columns = []
) {
  const totalRows = data.length;

  const columnAnalysis = columns.map(
    (column) => {
      const missingCount = data.filter(
        (row) =>
          row[column] === null ||
          row[column] === undefined ||
          row[column] === ""
      ).length;

      const percentage =
        totalRows === 0
          ? 0
          : (missingCount / totalRows) *
            100;

      return {
        column,
        missingCount,
        percentage,
        hasMissing: missingCount > 0,
      };
    }
  );

  const totalMissing = columnAnalysis.reduce(
    (sum, item) =>
      sum + item.missingCount,
    0
  );

  const totalCells =
    totalRows * columns.length;

  const completeness =
    totalCells === 0
      ? 100
      : ((totalCells - totalMissing) /
          totalCells) *
        100;

  return {
    totalMissing,
    totalCells,
    completeness,
    missingPercentage:
      totalCells === 0
        ? 0
        : (totalMissing / totalCells) *
          100,
    columns: columnAnalysis,
  };
}

export function getColumnsWithMissingValues(
  analysis
) {
  return (
    analysis?.columns?.filter(
      (item) => item.hasMissing
    ) || []
  );
}