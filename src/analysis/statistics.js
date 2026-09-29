export function calculateStatistics(values = []) {
  const numbers = values
    .map(toNumber)
    .filter(Number.isFinite);

  if (numbers.length === 0) {
    return {
      count: 0,
      mean: null,
      median: null,
      mode: null,
      min: null,
      max: null,
      range: null,
      standardDeviation: null,
      variance: null,
      q1: null,
      q3: null,
      iqr: null,
    };
  }

  const sorted = [...numbers].sort(
    (a, b) => a - b
  );

  const mean =
    numbers.reduce(
      (sum, value) => sum + value,
      0
    ) / numbers.length;

  const variance =
    numbers.length > 1
      ? numbers.reduce(
          (sum, value) =>
            sum + Math.pow(value - mean, 2),
          0
        ) /
        (numbers.length - 1)
      : 0;

  const standardDeviation =
    Math.sqrt(variance);

  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);

  return {
    count: numbers.length,
    mean,
    median: percentile(sorted, 50),
    mode: calculateMode(numbers),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    range:
      sorted[sorted.length - 1] - sorted[0],
    standardDeviation,
    variance,
    q1,
    q3,
    iqr: q3 - q1,
  };
}

export function calculateColumnStatistics(
  data = [],
  columns = []
) {
  const result = {};

  columns.forEach((column) => {
    const values = data.map(
      (row) => row[column]
    );

    result[column] =
      calculateStatistics(values);
  });

  return result;
}

export function percentile(
  sortedValues,
  percentileValue
) {
  if (!sortedValues.length) {
    return null;
  }

  const index =
    (percentileValue / 100) *
    (sortedValues.length - 1);

  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return sortedValues[lower];
  }

  const weight = index - lower;

  return (
    sortedValues[lower] +
    (sortedValues[upper] -
      sortedValues[lower]) *
      weight
  );
}

function calculateMode(numbers) {
  const frequencies = new Map();

  numbers.forEach((number) => {
    frequencies.set(
      number,
      (frequencies.get(number) || 0) + 1
    );
  });

  let mode = numbers[0];
  let highestFrequency = 0;

  frequencies.forEach(
    (frequency, number) => {
      if (frequency > highestFrequency) {
        highestFrequency = frequency;
        mode = number;
      }
    }
  );

  return mode;
}

function toNumber(value) {
  if (typeof value === "number") {
    return value;
  }

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return NaN;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : NaN;
}