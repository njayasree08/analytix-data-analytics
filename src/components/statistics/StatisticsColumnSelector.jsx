import {
  BarChart3,
  Check,
} from "lucide-react";

export default function StatisticsColumnSelector({
  numericColumns = [],
  selectedColumn,
  onChange,
}) {
  return (
    <div className="statistics-selector">
      <div className="statistics-selector-heading">
        <div>
          <span className="section-label">
            COLUMN ANALYSIS
          </span>

          <h3>
            Select numeric column
          </h3>

          <p>
            Choose a column to inspect its
            detailed statistics.
          </p>
        </div>

        <BarChart3 size={20} />
      </div>

      <div className="statistics-column-options">
        <button
          type="button"
          className={`statistics-column-option ${
            selectedColumn === "all"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onChange("all")
          }
        >
          <div>
            <strong>
              All numeric columns
            </strong>

            <span>
              Compare every numeric feature
            </span>
          </div>

          {selectedColumn ===
            "all" && (
            <Check size={17} />
          )}
        </button>

        {numericColumns.map(
          (column) => (
            <button
              type="button"
              key={column}
              className={`statistics-column-option ${
                selectedColumn === column
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                onChange(column)
              }
            >
              <div>
                <strong>
                  {column}
                </strong>

                <span>
                  Numeric feature
                </span>
              </div>

              {selectedColumn ===
                column && (
                <Check size={17} />
              )}
            </button>
          )
        )}
      </div>
    </div>
  );
}