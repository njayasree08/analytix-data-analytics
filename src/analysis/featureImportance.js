import { calculateStatistics } from "./statistics";

/*
  Feature importance here is a statistical/heuristic
  relevance score.

  It is NOT a machine-learning model importance score.

  The score considers:
  - variability
  - uniqueness
  - missing-value rate
  - correlation with other numeric features
*/

export function calculateFeatureImportance(
  data = [],
  profile = [],
  correlations = {}
) {
  if (!data.length || !profile.length) {
    return [];
  }

  const numericProfiles = profile.filter(
    (item) => item.type === "numeric"
  );

  const categoricalProfiles = profile.filter(
    (item) => item.type === "categorical"
  );

  const numericScores =
    numericProfiles.map((item) => {
      const values = data
        .map((row) => row[item.column])
        .map(Number)
        .filter(Number.isFinite);

      const statistics =
        calculateStatistics(values);

      const variationScore =
        calculateVariationScore(
          statistics
        );

      const missingScore =
        calculateMissingScore(
          item,
          data.length
        );

      const correlationScore =
        calculateCorrelationScore(
          item.column,
          correlations
        );

      const uniquenessScore =
        calculateUniquenessScore(item);

      const score =
        variationScore * 0.35 +
        correlationScore * 0.35 +
        uniquenessScore * 0.2 +
        missingScore * 0.1;

      return {
        feature: item.column,
        type: item.type,
        score: normalizeScore(score),
        variationScore,
        correlationScore,
        uniquenessScore,
        missingScore,
        reason: buildReason({
          variationScore,
          correlationScore,
          uniquenessScore,
          missingScore,
        }),
      };
    });

  const categoricalScores =
    categoricalProfiles.map((item) => {
      const uniquenessScore =
        calculateUniquenessScore(item);

      const missingScore =
        calculateMissingScore(
          item,
          data.length
        );

      const score =
        uniquenessScore * 0.65 +
        missingScore * 0.35;

      return {
        feature: item.column,
        type: item.type,
        score: normalizeScore(score),
        variationScore: 0,
        correlationScore: 0,
        uniquenessScore,
        missingScore,
        reason:
          "Categorical feature evaluated using uniqueness and data completeness.",
      };
    });

  return [
    ...numericScores,
    ...categoricalScores,
  ].sort(
    (a, b) => b.score - a.score
  );
}

function calculateVariationScore(
  statistics
) {
  if (
    !statistics ||
    statistics.mean === null ||
    statistics.standardDeviation === null
  ) {
    return 0;
  }

  if (statistics.mean === 0) {
    return statistics.standardDeviation > 0
      ? 1
      : 0;
  }

  const coefficientOfVariation =
    Math.abs(
      statistics.standardDeviation /
        statistics.mean
    );

  return Math.min(
    coefficientOfVariation,
    1
  );
}

function calculateCorrelationScore(
  column,
  correlations
) {
  const values =
    correlations?.[column];

  if (!values) {
    return 0;
  }

  const correlationsList =
    Object.entries(values)
      .filter(
        ([otherColumn]) =>
          otherColumn !== column
      )
      .map(([, value]) =>
        Math.abs(Number(value))
      )
      .filter(Number.isFinite);

  if (!correlationsList.length) {
    return 0;
  }

  return Math.min(
    Math.max(...correlationsList),
    1
  );
}

function calculateUniquenessScore(
  profile
) {
  if (!profile.totalValues) {
    return 0;
  }

  const ratio =
    profile.uniqueValues /
    profile.totalValues;

  /*
    Extremely high uniqueness is often
    an identifier, so reduce its usefulness.
  */
  if (ratio >= 0.98) {
    return 0.25;
  }

  return Math.min(ratio * 2, 1);
}

function calculateMissingScore(
  profile,
  totalRows
) {
  if (!totalRows) {
    return 0;
  }

  const missingRate =
    profile.missingValues /
    totalRows;

  return Math.max(
    0,
    1 - missingRate
  );
}

function normalizeScore(score) {
  return Math.round(
    Math.max(0, Math.min(1, score)) *
      100
  );
}

function buildReason({
  variationScore,
  correlationScore,
  uniquenessScore,
  missingScore,
}) {
  const reasons = [];

  if (variationScore >= 0.5) {
    reasons.push(
      "high variability"
    );
  }

  if (correlationScore >= 0.6) {
    reasons.push(
      "strong relationship with another numeric feature"
    );
  }

  if (uniquenessScore >= 0.5) {
    reasons.push(
      "useful value diversity"
    );
  }

  if (missingScore >= 0.9) {
    reasons.push(
      "good data completeness"
    );
  }

  if (!reasons.length) {
    return "Moderate statistical relevance based on the available data.";
  }

  return `Relevant because of ${reasons.join(
    ", "
  )}.`;
}