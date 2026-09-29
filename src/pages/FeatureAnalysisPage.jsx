import {
  BarChart3,
  Calendar,
  Database,
  FileSpreadsheet,
  Hash,
  Layers3,
  Link2,
  Sparkles,
  Type,
} from "lucide-react";

import { useDataset } from "../context/DatasetContext";
import "../styles/feature-analysis.css";

export default function FeatureAnalysisPage() {
  const {
    dataset,
    analysis,
    hasDataset,
    analysisLoading,
  } = useDataset();

  if (analysisLoading) {
    return (
      <section className="feature-analysis-page">
        <AnalysisState
          icon={<Sparkles size={26} />}
          title="Analyzing features"
          description="Evaluating feature types, relevance, relationships, and importance..."
        />
      </section>
    );
  }

  if (!hasDataset || !analysis) {
    return (
      <section className="feature-analysis-page">
        <AnalysisState
          icon={<Layers3 size={26} />}
          eyebrow="FEATURE INTELLIGENCE"
          title="No dataset available"
          description="Upload a dataset to analyze its features and discover important relationships."
        />
      </section>
    );
  }

  const types = analysis.types || [];
  const featureImportance =
    analysis.featureImportance || [];

  const numericColumns =
    analysis.numericColumns || [];

  const correlations =
    analysis.correlations || {};

  const overview =
    analysis.overview || {};

  const sortedFeatures =
    [...featureImportance].sort(
      (a, b) =>
        Number(b?.score || 0) -
        Number(a?.score || 0)
    );

  const topFeature =
    sortedFeatures[0];

  const strongestCorrelation =
    findStrongestCorrelation(
      correlations
    );

  const numericTypes = types.filter(
    (item) => item.type === "numeric"
  ).length;

  const categoricalTypes = types.filter(
    (item) => item.type === "categorical"
  ).length;

  const dateTypes = types.filter(
    (item) => item.type === "date"
  ).length;

  return (
    <section className="feature-analysis-page">
      {/* HEADER */}
      <header className="feature-analysis-header">
        <div className="feature-analysis-heading">
          <div className="feature-analysis-title-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <span className="feature-analysis-eyebrow">
              FEATURE INTELLIGENCE
            </span>

            <h2>Feature Analysis</h2>

            <p>
              Understand which variables matter most and
              how your dataset's features relate to one
              another.
            </p>
          </div>
        </div>

        <div className="feature-analysis-dataset">
          <FileSpreadsheet size={16} />

          <div>
            <strong title={dataset.fileName}>
              {dataset.fileName}
            </strong>

            <span>
              {overview.rowCount?.toLocaleString() ||
                0}{" "}
              rows · {overview.columnCount || 0}{" "}
              features
            </span>
          </div>
        </div>
      </header>

      {/* OVERVIEW */}
      <section className="feature-analysis-overview">
        <div className="feature-analysis-overview-copy">
          <span className="feature-analysis-section-label">
            FEATURE LANDSCAPE
          </span>

          <h3>
            Dataset feature composition
          </h3>

          <p>
            The platform automatically classifies each
            column and evaluates numerical relationships
            to support feature-level analysis.
          </p>
        </div>

        <div className="feature-analysis-type-grid">
          <TypeMetric
            icon={<Hash size={16} />}
            label="Numeric"
            value={numericTypes}
            description="Quantitative features"
            type="numeric"
          />

          <TypeMetric
            icon={<Type size={16} />}
            label="Categorical"
            value={categoricalTypes}
            description="Category features"
            type="categorical"
          />

          <TypeMetric
            icon={<Calendar size={16} />}
            label="Date"
            value={dateTypes}
            description="Temporal features"
            type="date"
          />

          <TypeMetric
            icon={<Database size={16} />}
            label="Total"
            value={types.length}
            description="Detected features"
            type="total"
          />
        </div>
      </section>

      {/* FEATURE IMPORTANCE */}
      <section className="feature-analysis-card">
        <div className="feature-analysis-card-header">
          <div>
            <span className="feature-analysis-section-label">
              IMPORTANCE ANALYSIS
            </span>

            <h3>
              Feature relevance ranking
            </h3>

            <p>
              A heuristic/statistical relevance score
              generated from the available dataset
              structure and relationships.
            </p>
          </div>

          <div className="feature-analysis-card-icon">
            <BarChart3 size={17} />
          </div>
        </div>

        {sortedFeatures.length > 0 ? (
          <div className="feature-ranking">
            {sortedFeatures.map(
              (feature, index) => (
                <FeatureRanking
                  key={
                    feature.feature ||
                    `feature-${index}`
                  }
                  feature={feature}
                  rank={index + 1}
                  maxScore={Number(
                    sortedFeatures[0]?.score || 1
                  )}
                />
              )
            )}
          </div>
        ) : (
          <EmptyFeatureMessage />
        )}
      </section>

      {/* TOP FEATURE + CORRELATION */}
      <section className="feature-analysis-two-column">
        <section className="feature-analysis-card feature-highlight-card">
          <div className="feature-analysis-card-header">
            <div>
              <span className="feature-analysis-section-label">
                TOP FEATURE
              </span>

              <h3>
                Highest relevance signal
              </h3>
            </div>

            <div className="feature-analysis-card-icon highlight">
              <Sparkles size={17} />
            </div>
          </div>

          {topFeature ? (
            <div className="feature-highlight">
              <div className="feature-highlight-name">
                <div className="feature-highlight-icon">
                  <Hash size={17} />
                </div>

                <div>
                  <strong>
                    {topFeature.feature}
                  </strong>

                  <span>
                    Importance score
                  </span>
                </div>
              </div>

              <div className="feature-score">
                <strong>
                  {formatScore(
                    topFeature.score
                  )}
                </strong>

                <span>score</span>
              </div>

              <div className="feature-highlight-bar">
                <span
                  style={{
                    width: `${clampScore(
                      topFeature.score
                    )}%`,
                  }}
                />
              </div>

              <p>
                {topFeature.reason ||
                  "This feature received the highest calculated relevance score in the current analysis."}
              </p>
            </div>
          ) : (
            <EmptyFeatureMessage />
          )}
        </section>

        <section className="feature-analysis-card">
          <div className="feature-analysis-card-header">
            <div>
              <span className="feature-analysis-section-label">
                RELATIONSHIPS
              </span>

              <h3>
                Strongest numeric correlation
              </h3>

              <p>
                Pearson correlation between numeric
                features.
              </p>
            </div>

            <div className="feature-analysis-card-icon correlation">
              <Link2 size={17} />
            </div>
          </div>

          {strongestCorrelation ? (
            <div className="correlation-highlight">
              <div className="correlation-feature-pair">
                <span>
                  {strongestCorrelation.first}
                </span>

                <Link2 size={14} />

                <span>
                  {strongestCorrelation.second}
                </span>
              </div>

              <div
                className={`correlation-value ${
                  strongestCorrelation.value >=
                  0
                    ? "positive"
                    : "negative"
                }`}
              >
                {strongestCorrelation.value.toFixed(
                  3
                )}
              </div>

              <div className="correlation-meter">
                <span
                  style={{
                    width: `${Math.abs(
                      strongestCorrelation.value
                    ) * 100}%`,
                  }}
                />
              </div>

              <p>
                {getCorrelationDescription(
                  strongestCorrelation.value
                )}
              </p>
            </div>
          ) : (
            <div className="correlation-empty">
              <Link2 size={20} />

              <strong>
                Not enough numeric relationships
              </strong>

              <span>
                At least two numeric features are needed
                to calculate correlations.
              </span>
            </div>
          )}
        </section>
      </section>

      {/* FEATURE TYPE DIRECTORY */}
      <section className="feature-analysis-card">
        <div className="feature-analysis-card-header">
          <div>
            <span className="feature-analysis-section-label">
              FEATURE DIRECTORY
            </span>

            <h3>
              Detected feature types
            </h3>

            <p>
              Automatically classified columns in the
              current dataset.
            </p>
          </div>

          <div className="feature-analysis-card-icon">
            <Layers3 size={17} />
          </div>
        </div>

        <div className="feature-directory">
          {types.map((item, index) => (
            <FeatureTypeRow
              key={
                item.column ||
                item.name ||
                `type-${index}`
              }
              item={item}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

function TypeMetric({
  icon,
  label,
  value,
  description,
  type,
}) {
  return (
    <div className="feature-type-metric">
      <div
        className={`feature-type-icon ${type}`}
      >
        {icon}
      </div>

      <div>
        <span>{label}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>
    </div>
  );
}

function FeatureRanking({
  feature,
  rank,
  maxScore,
}) {
  const score = Number(
    feature?.score || 0
  );

  const percentage =
    maxScore > 0
      ? (score / maxScore) * 100
      : 0;

  return (
    <div className="feature-ranking-row">
      <div className="feature-rank">
        {String(rank).padStart(2, "0")}
      </div>

      <div className="feature-ranking-main">
        <div className="feature-ranking-title">
          <strong title={feature.feature}>
            {feature.feature}
          </strong>

          <span>
            {feature.reason ||
              "Statistical relevance signal"}
          </span>
        </div>

        <div className="feature-ranking-progress">
          <span
            style={{
              width: `${clampScore(
                percentage
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="feature-ranking-score">
        {formatScore(score)}
      </div>
    </div>
  );
}

function FeatureTypeRow({ item }) {
  const column =
    item?.column ||
    item?.name ||
    item?.feature ||
    "Unnamed feature";

  const type =
    item?.type ||
    "unknown";

  const icon =
    type === "numeric" ? (
      <Hash size={13} />
    ) : type === "date" ? (
      <Calendar size={13} />
    ) : type === "categorical" ? (
      <Type size={13} />
    ) : (
      <Database size={13} />
    );

  return (
    <div className="feature-directory-row">
      <div className="feature-directory-name">
        <div className="feature-directory-icon">
          {icon}
        </div>

        <strong title={column}>
          {column}
        </strong>
      </div>

      <span
        className={`feature-type-badge ${type}`}
      >
        {type}
      </span>

      <div className="feature-directory-details">
        {item?.uniqueCount !== undefined && (
          <span>
            {item.uniqueCount} unique
          </span>
        )}

        {item?.missingCount !== undefined && (
          <span>
            {item.missingCount} missing
          </span>
        )}
      </div>
    </div>
  );
}

function AnalysisState({
  icon,
  eyebrow = "FEATURE ANALYSIS",
  title,
  description,
}) {
  return (
    <div className="feature-analysis-state">
      <div className="feature-analysis-state-icon">
        {icon}
      </div>

      <span className="feature-analysis-eyebrow">
        {eyebrow}
      </span>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}

function EmptyFeatureMessage() {
  return (
    <div className="feature-analysis-empty">
      <BarChart3 size={20} />

      <strong>
        Feature importance is unavailable
      </strong>

      <span>
        The current dataset does not provide enough
        information for the relevance calculation.
      </span>
    </div>
  );
}

function findStrongestCorrelation(
  correlations
) {
  if (!correlations) {
    return null;
  }

  let strongest = null;

  if (Array.isArray(correlations)) {
    correlations.forEach((item) => {
      const first =
        item?.first ||
        item?.feature1 ||
        item?.column1;

      const second =
        item?.second ||
        item?.feature2 ||
        item?.column2;

      const value = Number(
        item?.value ??
          item?.correlation
      );

      if (
        first &&
        second &&
        Number.isFinite(value) &&
        first !== second
      ) {
        if (
          !strongest ||
          Math.abs(value) >
            Math.abs(strongest.value)
        ) {
          strongest = {
            first,
            second,
            value,
          };
        }
      }
    });

    return strongest;
  }

  Object.entries(
    correlations
  ).forEach(([first, values]) => {
    if (
      !values ||
      typeof values !== "object"
    ) {
      return;
    }

    Object.entries(values).forEach(
      ([second, rawValue]) => {
        const value = Number(
          rawValue
        );

        if (
          first === second ||
          !Number.isFinite(value)
        ) {
          return;
        }

        if (
          !strongest ||
          Math.abs(value) >
            Math.abs(strongest.value)
        ) {
          strongest = {
            first,
            second,
            value,
          };
        }
      }
    );
  });

  return strongest;
}

function getCorrelationDescription(
  value
) {
  const absolute =
    Math.abs(value);

  if (absolute >= 0.8) {
    return "The two features have a very strong linear relationship in the current dataset.";
  }

  if (absolute >= 0.6) {
    return "The two features show a strong linear relationship in the current dataset.";
  }

  if (absolute >= 0.4) {
    return "The two features show a moderate linear relationship.";
  }

  if (absolute >= 0.2) {
    return "The two features show a relatively weak linear relationship.";
  }

  return "The linear relationship between these features is very weak.";
}

function formatScore(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toFixed(2);
}

function clampScore(value) {
  const number =
    Number(value) || 0;

  return Math.max(
    0,
    Math.min(100, number)
  );
}