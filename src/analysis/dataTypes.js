const ID_PATTERNS = [
  /^id$/i,
  /_id$/i,
  /id_/i,
  /^index$/i,
  /^no$/i,
  /^number$/i,
  /^code$/i,
];

export function classifyColumn(columnName, values = []) {
  const cleanValues = values.filter(
    (value) =>
      value !== null &&
      value !== undefined &&
      value !== ""
  );

  if (cleanValues.length === 0) {
    return {
      type: "unknown",
      confidence: 0,
    };
  }

  if (isLikelyId(columnName, cleanValues)) {
    return {
      type: "id",
      confidence: 0.95,
    };
  }

  if (cleanValues.every(isBooleanValue)) {
    return {
      type: "boolean",
      confidence: 0.98,
    };
  }

  if (cleanValues.every(isDateValue)) {
    return {
      type: "date",
      confidence: 0.9,
    };
  }

  if (cleanValues.every(isNumericValue)) {
    return {
      type: "numeric",
      confidence: 0.98,
    };
  }

  const uniqueRatio =
    new Set(cleanValues.map(String)).size /
    cleanValues.length;

  if (
    uniqueRatio <= 0.2 ||
    cleanValues.length <= 20
  ) {
    return {
      type: "categorical",
      confidence: 0.85,
    };
  }

  return {
    type: "text",
    confidence: 0.8,
  };
}

export function classifyDataset(data = [], columns = []) {
  return columns.map((column) => {
    const values = data.map(
      (row) => row[column]
    );

    const classification = classifyColumn(
      column,
      values
    );

    return {
      column,
      ...classification,
      totalValues: values.length,
      missingValues: values.filter(isMissing).length,
      uniqueValues: new Set(
        values
          .filter((value) => !isMissing(value))
          .map(String)
      ).size,
    };
  });
}

function isMissing(value) {
  return (
    value === null ||
    value === undefined ||
    value === ""
  );
}

function isLikelyId(columnName, values) {
  const nameLooksLikeId = ID_PATTERNS.some(
    (pattern) => pattern.test(columnName)
  );

  if (nameLooksLikeId) {
    return true;
  }

  const uniqueValues = new Set(
    values.map(String)
  );

  return (
    values.length >= 10 &&
    uniqueValues.size / values.length >= 0.98 &&
    values.every(
      (value) =>
        typeof value === "number" ||
        /^[A-Za-z0-9_-]+$/.test(String(value))
    )
  );
}

function isNumericValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  return (
    !Number.isNaN(Number(trimmed)) &&
    Number.isFinite(Number(trimmed))
  );
}

function isBooleanValue(value) {
  if (typeof value === "boolean") {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  return [
    "true",
    "false",
    "yes",
    "no",
  ].includes(value.trim().toLowerCase());
}

function isDateValue(value) {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value !== "string") {
    return false;
  }

  const text = value.trim();

  if (!text) {
    return false;
  }

  if (
    /^\d+$/.test(text) &&
    text.length <= 4
  ) {
    return false;
  }

  const parsed = Date.parse(text);

  return !Number.isNaN(parsed);
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

export function getDateColumns(profile = []) {
  return profile
    .filter(
      (item) => item.type === "date"
    )
    .map((item) => item.column);
}