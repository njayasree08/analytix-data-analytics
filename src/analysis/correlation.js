export function calculateCorrelation(
  xValues = [],
  yValues = []
) {
  const pairs = [];

  const length = Math.min(
    xValues.length,
    yValues.length
  );

  for (let i = 0; i < length; i++) {
    const x = Number(xValues[i]);
    const y = Number(yValues[i]);

    if (
      Number.isFinite(x) &&
      Number.isFinite(y)
    ) {
      pairs.push([x, y]);
    }
  }

  if (pairs.length < 2) {
    return null;
  }

  const xMean =
    pairs.reduce(
      (sum, pair) => sum + pair[0],
      0
    ) / pairs.length;

  const yMean =
    pairs.reduce(
      (sum, pair) => sum + pair[1],
      0
    ) / pairs.length;

  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;

  pairs.forEach(([x, y]) => {
    const xDifference = x - xMean;
    const yDifference = y - yMean;

    numerator +=
      xDifference * yDifference;

    xVariance +=
      xDifference * xDifference;

    yVariance +=
      yDifference * yDifference;
  });

  if (
    xVariance === 0 ||
    yVariance === 0
  ) {
    return 0;
  }

  return (
    numerator /
    Math.sqrt(
      xVariance * yVariance
    )
  );
}

export function calculateCorrelationMatrix(
  data = [],
  numericColumns = []
) {
  const matrix = {};

  numericColumns.forEach(
    (columnA) => {
      matrix[columnA] = {};

      numericColumns.forEach(
        (columnB) => {
          const xValues = data.map(
            (row) => row[columnA]
          );

          const yValues = data.map(
            (row) => row[columnB]
          );

          matrix[columnA][columnB] =
            calculateCorrelation(
              xValues,
              yValues
            );
        }
      );
    }
  );

  return matrix;
}