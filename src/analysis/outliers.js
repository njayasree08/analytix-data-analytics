import { calculateStatistics } from "./statistics";

export function detectOutliers(
  values = []
) {
  const numbers = values
    .map(toNumber)
    .filter(Number.isFinite);

  if (numbers.length < 4) {
    return {
      method: "IQR",
      lowerBound: null,
      upperBound: null,
      outlierCount: 0,
      outlierPercentage: 0,
      outliers: [],
    };
  }

  const statistics =
    calculateStatistics(numbers);

  const lowerBound =
    statistics.q1 -
    1.5 * statistics.iqr;

  const upperBound =
    statistics.q3 +
    1.5 * statistics.iqr;

  const outliers = numbers.filter(
    (value) =>
      value < lowerBound ||
      value > upperBound
  );

  return {
    method: "IQR",
    lowerBound,
    upperBound,
    outlierCount: outliers.length,
    outlierPercentage:
      (outliers.length / numbers.length) *
      100,
    outliers,
  };
}

export function detectZScoreAnomalies(
  values = [],
  threshold = 3
) {
  const numbers = values
    .map(toNumber)
    .filter(Number.isFinite);

  if (numbers.length < 3) {
    return {
      method: "Z-score",
      threshold,
      anomalyCount: 0,
      anomalies: [],
    };
  }

  const statistics =
    calculateStatistics(numbers);

  if (
    !statistics.standardDeviation ||
    statistics.standardDeviation === 0
  ) {
    return {
      method: "Z-score",
      threshold,
      anomalyCount: 0,
      anomalies: [],
    };
  }

  const anomalies = numbers.filter(
    (value) => {
      const zScore =
        (value - statistics.mean) /
        statistics.standardDeviation;

      return Math.abs(zScore) >= threshold;
    }
  );

  return {
    method: "Z-score",
    threshold,
    anomalyCount: anomalies.length,
    anomalies,
  };
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