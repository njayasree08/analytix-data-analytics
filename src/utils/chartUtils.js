export function getChartRecommendations(
  data = [],
  profile = []
) {
  if (!data.length || !profile.length) {
    return [];
  }

  const numericColumns = profile
    .filter(
      (item) => item.type === "numeric"
    )
    .map((item) => item.column);

  const categoricalColumns = profile
    .filter(
      (item) =>
        item.type === "categorical"
    )
    .map((item) => item.column);

  const dateColumns = profile
    .filter(
      (item) => item.type === "date"
    )
    .map((item) => item.column);

  const recommendations = [];

  if (
    categoricalColumns.length > 0 &&
    numericColumns.length > 0
  ) {
    recommendations.push({
      type: "bar",
      title: "Category Distribution",
      description:
        "Compare a numeric measure across categories.",
      category:
        categoricalColumns[0],
      value: numericColumns[0],
    });
  }

  if (
    dateColumns.length > 0 &&
    numericColumns.length > 0
  ) {
    recommendations.push({
      type: "line",
      title: "Trend Over Time",
      description:
        "Track a numeric measure across time.",
      category: dateColumns[0],
      value: numericColumns[0],
    });
  }

  if (numericColumns.length >= 2) {
    recommendations.push({
      type: "scatter",
      title: "Numeric Relationship",
      description:
        "Explore the relationship between two numeric features.",
      x: numericColumns[0],
      y: numericColumns[1],
    });
  }

  if (categoricalColumns.length > 0) {
    recommendations.push({
      type: "distribution",
      title: "Category Frequency",
      description:
        "View how frequently categories occur.",
      category:
        categoricalColumns[0],
    });
  }

  numericColumns.forEach(
    (column) => {
      recommendations.push({
        type: "histogram",
        title: `${column} Distribution`,
        description:
          "Inspect the distribution of a numeric feature.",
        value: column,
      });
    }
  );

  return recommendations.slice(
    0,
    8
  );
}

export function buildCategoryData(
  data = [],
  categoryColumn,
  valueColumn
) {
  if (
    !data.length ||
    !categoryColumn
  ) {
    return [];
  }

  const groups = new Map();

  data.forEach((row) => {
    const category =
      row[categoryColumn];

    if (
      category === null ||
      category === undefined ||
      category === ""
    ) {
      return;
    }

    const key = String(category);

    if (!groups.has(key)) {
      groups.set(key, {
        name: key,
        value: 0,
        count: 0,
      });
    }

    const group = groups.get(key);

    group.count += 1;

    if (valueColumn) {
      const value =
        Number(row[valueColumn]);

      if (Number.isFinite(value)) {
        group.value += value;
      }
    } else {
      group.value += 1;
    }
  });

  return Array.from(
    groups.values()
  )
    .sort(
      (a, b) =>
        b.value - a.value
    )
    .slice(0, 20);
}

export function buildTimeSeriesData(
  data = [],
  dateColumn,
  valueColumn
) {
  if (
    !data.length ||
    !dateColumn ||
    !valueColumn
  ) {
    return [];
  }

  const groups = new Map();

  data.forEach((row) => {
    const rawDate =
      row[dateColumn];

    const value =
      Number(row[valueColumn]);

    if (
      rawDate === null ||
      rawDate === undefined ||
      !Number.isFinite(value)
    ) {
      return;
    }

    const date =
      rawDate instanceof Date
        ? rawDate
        : new Date(rawDate);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return;
    }

    const key =
      date.toISOString().slice(0, 10);

    if (!groups.has(key)) {
      groups.set(key, {
        date: key,
        value: 0,
        count: 0,
      });
    }

    const group = groups.get(key);

    group.value += value;
    group.count += 1;
  });

  return Array.from(
    groups.values()
  )
    .sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    )
    .map((item) => ({
      ...item,
      value:
        item.value /
        item.count,
    }));
}

export function buildScatterData(
  data = [],
  xColumn,
  yColumn
) {
  if (
    !data.length ||
    !xColumn ||
    !yColumn
  ) {
    return [];
  }

  return data
    .map((row) => ({
      x: Number(row[xColumn]),
      y: Number(row[yColumn]),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.x) &&
        Number.isFinite(item.y)
    )
    .slice(0, 1000);
}

export function buildHistogramData(
  data = [],
  column,
  bucketCount = 10
) {
  if (!data.length || !column) {
    return [];
  }

  const values = data
    .map((row) =>
      Number(row[column])
    )
    .filter(Number.isFinite);

  if (!values.length) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return [
      {
        range: String(min),
        count: values.length,
      },
    ];
  }

  const bucketSize =
    (max - min) / bucketCount;

  const buckets = Array.from(
    { length: bucketCount },
    (_, index) => {
      const start =
        min + index * bucketSize;

      const end =
        index === bucketCount - 1
          ? max
          : start + bucketSize;

      return {
        start,
        end,
        range: `${formatCompact(
          start
        )} – ${formatCompact(end)}`,
        count: 0,
      };
    }
  );

  values.forEach((value) => {
    let index = Math.floor(
      (value - min) /
        bucketSize
    );

    if (index >= bucketCount) {
      index = bucketCount - 1;
    }

    buckets[index].count += 1;
  });

  return buckets;
}

export function getNumericColumns(
  profile = []
) {
  return profile
    .filter(
      (item) => item.type === "numeric"
    )
    .map((item) => item.column);
}

export function getCategoricalColumns(
  profile = []
) {
  return profile
    .filter(
      (item) =>
        item.type === "categorical"
    )
    .map((item) => item.column);
}

export function getDateColumns(
  profile = []
) {
  return profile
    .filter(
      (item) => item.type === "date"
    )
    .map((item) => item.column);
}

function formatCompact(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number(
    value.toFixed(2)
  ).toLocaleString();
}