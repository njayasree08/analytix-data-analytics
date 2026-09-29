export function detectDuplicates(
  data = [],
  columns = []
) {
  if (!data.length || !columns.length) {
    return {
      duplicateCount: 0,
      duplicatePercentage: 0,
      duplicateRows: [],
      hasDuplicates: false,
    };
  }

  const seen = new Map();
  const duplicateRows = [];

  data.forEach((row, index) => {
    const key = columns
      .map((column) =>
        normalizeValue(row[column])
      )
      .join("||");

    if (seen.has(key)) {
      duplicateRows.push({
        index,
        duplicateOf: seen.get(key),
        row,
      });
    } else {
      seen.set(key, index);
    }
  });

  return {
    duplicateCount: duplicateRows.length,

    duplicatePercentage:
      data.length === 0
        ? 0
        : (duplicateRows.length /
            data.length) *
          100,

    duplicateRows,

    hasDuplicates:
      duplicateRows.length > 0,
  };
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