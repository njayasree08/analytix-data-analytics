export function generateInsights({
  data = [],
  columns = [],
  analysis = {},
}) {
  if (!data.length || !columns.length) {
    return [];
  }

  const insights = [];

  addDatasetOverviewInsight(
    insights,
    data,
    columns
  );

  addCompletenessInsights(
    insights,
    analysis
  );

  addDuplicateInsights(
    insights,
    analysis
  );

  addOutlierInsights(
    insights,
    analysis
  );

  addCorrelationInsights(
    insights,
    analysis
  );

  addFeatureInsights(
    insights,
    analysis
  );

  addStatisticsInsights(
    insights,
    analysis
  );

  if (!insights.length) {
    insights.push({
      type: "info",
      priority: "low",
      title: "No major patterns detected",
      description:
        "The current analysis did not identify strong data-quality issues, correlations, or unusual numeric patterns.",
      metric: null,
      icon: "info",
    });
  }

  return sortInsights(insights);
}

function addDatasetOverviewInsight(
  insights,
  data,
  columns
) {
  insights.push({
    type: "overview",
    priority: "low",
    title: "Dataset successfully analyzed",
    description: `The dataset contains ${formatNumber(
      data.length
    )} rows across ${
      columns.length
    } columns. Automatic profiling has been completed.`,
    metric: `${formatNumber(
      data.length
    )} × ${columns.length}`,
    icon: "database",
  });
}

function addCompletenessInsights(
  insights,
  analysis
) {
  const missing =
    analysis?.missingValues;

  if (!missing) {
    return;
  }

  const completeness =
    missing.completeness ?? 100;

  if (completeness >= 98) {
    insights.push({
      type: "quality",
      priority: "low",
      title: "High data completeness",
      description: `The dataset is ${formatNumber(
        completeness
      )}% complete, with very few missing values.`,
      metric: `${formatNumber(
        completeness
      )}%`,
      icon: "check",
    });
  } else if (completeness >= 90) {
    insights.push({
      type: "quality",
      priority: "medium",
      title: "Some missing values detected",
      description: `Overall completeness is ${formatNumber(
        completeness
      )}%. Review columns with missing values before deeper analysis.`,
      metric: `${formatNumber(
        completeness
      )}%`,
      icon: "alert",
    });
  } else {
    insights.push({
      type: "quality",
      priority: "high",
      title: "Significant missing data",
      description: `Only ${formatNumber(
        completeness
      )}% of dataset cells contain values. Missing-value treatment may be important before using the data for analysis.`,
      metric: `${formatNumber(
        completeness
      )}%`,
      icon: "alert",
    });
  }

  const columnsWithMissing =
    missing.columns?.filter(
      (item) => item.hasMissing
    ) || [];

  const highestMissing =
    [...columnsWithMissing].sort(
      (a, b) =>
        b.percentage - a.percentage
    )[0];

  if (
    highestMissing &&
    highestMissing.percentage >= 20
  ) {
    insights.push({
      type: "quality",
      priority: "high",
      title: "Column with substantial missing values",
      description: `${highestMissing.column} contains ${formatNumber(
        highestMissing.percentage
      )}% missing values.`,
      metric: `${formatNumber(
        highestMissing.percentage
      )}%`,
      icon: "alert",
    });
  }
}

function addDuplicateInsights(
  insights,
  analysis
) {
  const duplicates =
    analysis?.duplicates;

  if (!duplicates) {
    return;
  }

  if (duplicates.hasDuplicates) {
    insights.push({
      type: "quality",
      priority:
        duplicates.duplicatePercentage >=
        5
          ? "high"
          : "medium",
      title: "Duplicate rows detected",
      description: `${formatNumber(
        duplicates.duplicateCount
      )} duplicate rows were identified, representing ${formatNumber(
        duplicates.duplicatePercentage
      )}% of the dataset.`,
      metric: formatNumber(
        duplicates.duplicateCount
      ),
      icon: "copy",
    });
  } else {
    insights.push({
      type: "quality",
      priority: "low",
      title: "No duplicate rows detected",
      description:
        "The dataset does not contain exact duplicate rows based on the available columns.",
      metric: "0",
      icon: "check",
    });
  }
}

function addOutlierInsights(
  insights,
  analysis
) {
  const outliers =
    analysis?.outliers || {};

  const entries =
    Object.entries(outliers);

  if (!entries.length) {
    return;
  }

  let totalOutliers = 0;
  let highestOutlierColumn = null;
  let highestOutlierPercentage = 0;

  entries.forEach(
    ([column, result]) => {
      totalOutliers +=
        result?.outlierCount || 0;

      if (
        (result?.outlierPercentage ||
          0) >
        highestOutlierPercentage
      ) {
        highestOutlierPercentage =
          result.outlierPercentage;

        highestOutlierColumn = column;
      }
    }
  );

  if (totalOutliers === 0) {
    insights.push({
      type: "anomaly",
      priority: "low",
      title: "No IQR outliers detected",
      description:
        "The numeric features do not currently show values outside their IQR-based bounds.",
      metric: "0",
      icon: "check",
    });

    return;
  }

  insights.push({
    type: "anomaly",
    priority:
      highestOutlierPercentage >= 10
        ? "high"
        : "medium",
    title: "Potential outliers detected",
    description: `${formatNumber(
      totalOutliers
    )} potential outlier values were identified using the IQR method.`,
    metric: formatNumber(
      totalOutliers
    ),
    icon: "alert",
  });

  if (highestOutlierColumn) {
    insights.push({
      type: "anomaly",
      priority: "medium",
      title: "Feature with highest outlier rate",
      description: `${highestOutlierColumn} has the highest detected outlier percentage at ${formatNumber(
        highestOutlierPercentage
      )}%.`,
      metric: `${formatNumber(
        highestOutlierPercentage
      )}%`,
      icon: "activity",
    });
  }
}

function addCorrelationInsights(
  insights,
  analysis
) {
  const correlations =
    analysis?.correlations || {};

  const pairs = [];

  Object.entries(
    correlations
  ).forEach(
    ([columnA, values]) => {
      Object.entries(
        values || {}
      ).forEach(
        ([columnB, correlation]) => {
          if (
            columnA === columnB ||
            correlation === null ||
            correlation === undefined
          ) {
            return;
          }

          const value =
            Number(correlation);

          if (!Number.isFinite(value)) {
            return;
          }

          const exists =
            pairs.some(
              (pair) =>
                pair.a === columnB &&
                pair.b === columnA
            );

          if (!exists) {
            pairs.push({
              a: columnA,
              b: columnB,
              correlation: value,
            });
          }
        }
      );
    }
  );

  pairs.sort(
    (a, b) =>
      Math.abs(b.correlation) -
      Math.abs(a.correlation)
  );

  const strongest = pairs[0];

  if (!strongest) {
    return;
  }

  const absolute =
    Math.abs(
      strongest.correlation
    );

  if (absolute < 0.5) {
    insights.push({
      type: "relationship",
      priority: "low",
      title: "No strong numeric correlation",
      description:
        "The analyzed numeric features do not show a correlation stronger than 0.5.",
      metric: "r < 0.50",
      icon: "link",
    });

    return;
  }

  const direction =
    strongest.correlation >= 0
      ? "positive"
      : "negative";

  insights.push({
    type: "relationship",
    priority:
      absolute >= 0.8
        ? "high"
        : "medium",
    title: "Strong numeric relationship detected",
    description: `${strongest.a} and ${strongest.b} show a ${direction} Pearson correlation of ${formatNumber(
      strongest.correlation
    )}. Correlation does not by itself establish causation.`,
    metric: formatNumber(
      strongest.correlation
    ),
    icon: "link",
  });
}

function addFeatureInsights(
  insights,
  analysis
) {
  const features =
    analysis?.featureImportance || [];

  if (!features.length) {
    return;
  }

  const topFeature =
    features[0];

  if (!topFeature) {
    return;
  }

  insights.push({
    type: "feature",
    priority: "medium",
    title: "Most relevant feature identified",
    description: `${topFeature.feature} has the highest statistical relevance score at ${topFeature.score}%. ${topFeature.reason}`,
    metric: `${topFeature.score}%`,
    icon: "star",
  });
}

function addStatisticsInsights(
  insights,
  analysis
) {
  const statistics =
    analysis?.statistics || {};

  const entries =
    Object.entries(statistics);

  if (!entries.length) {
    return;
  }

  const highVariation = entries
    .map(([column, stats]) => ({
      column,
      coefficient:
        stats?.mean !== null &&
        stats?.mean !== 0
          ? Math.abs(
              stats.standardDeviation /
                stats.mean
            )
          : 0,
    }))
    .sort(
      (a, b) =>
        b.coefficient -
        a.coefficient
    )[0];

  if (
    highVariation &&
    highVariation.coefficient >=
      0.5
  ) {
    insights.push({
      type: "statistics",
      priority: "medium",
      title: "High relative variability detected",
      description: `${highVariation.column} shows relatively high variation compared with its mean.`,
      metric: `${formatNumber(
        highVariation.coefficient *
          100
      )}%`,
      icon: "activity",
    });
  }
}

function sortInsights(
  insights
) {
  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return insights.sort(
    (a, b) =>
      priorityOrder[a.priority] -
      priorityOrder[b.priority]
  );
}

function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(
      Number(value)
    )
  ) {
    return "—";
  }

  return Number(value).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 2,
    }
  );
}