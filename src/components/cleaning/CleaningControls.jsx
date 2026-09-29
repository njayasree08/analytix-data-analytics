import {
  Broom,
  Copy,
  Eraser,
  RotateCcw,
  Scissors,
  Type,
} from "lucide-react";

export default function CleaningControls({
  options,
  onChange,
  onPreview,
  onApply,
  onReset,
  hasPreview,
  hasChanges,
}) {
  function updateOption(
    key,
    value
  ) {
    onChange({
      ...options,
      [key]: value,
    });
  }

  return (
    <div className="cleaning-controls">
      <div className="cleaning-option">
        <div className="cleaning-option-header">
          <div className="cleaning-option-icon">
            <Eraser size={16} />
          </div>

          <div>
            <h3>
              Missing values
            </h3>

            <p>
              Choose how missing cells
              should be handled.
            </p>
          </div>
        </div>

        <select
          value={
            options.missingStrategy
          }
          onChange={(event) =>
            updateOption(
              "missingStrategy",
              event.target.value
            )
          }
        >
          <option value="none">
            Keep missing values
          </option>

          <option value="remove">
            Remove rows
          </option>

          <option value="mean">
            Fill numeric values with mean
          </option>

          <option value="median">
            Fill numeric values with median
          </option>

          <option value="mode">
            Fill with mode
          </option>

          <option value="constant">
            Fill with constant value
          </option>
        </select>

        {options.missingStrategy ===
          "constant" && (
          <input
            type="text"
            value={
              options.missingConstant
            }
            onChange={(event) =>
              updateOption(
                "missingConstant",
                event.target.value
              )
            }
            placeholder="Enter replacement value"
          />
        )}
      </div>

      <div className="cleaning-option">
        <div className="cleaning-option-header">
          <div className="cleaning-option-icon">
            <Copy size={16} />
          </div>

          <div>
            <h3>
              Duplicate rows
            </h3>

            <p>
              Remove exact duplicate
              records.
            </p>
          </div>
        </div>

        <label className="cleaning-checkbox">
          <input
            type="checkbox"
            checked={
              options.removeDuplicates
            }
            onChange={(event) =>
              updateOption(
                "removeDuplicates",
                event.target.checked
              )
            }
          />

          <span>
            Remove duplicate rows
          </span>
        </label>
      </div>

      <div className="cleaning-option">
        <div className="cleaning-option-header">
          <div className="cleaning-option-icon">
            <Type size={16} />
          </div>

          <div>
            <h3>
              Text formatting
            </h3>

            <p>
              Remove unnecessary spaces
              around text values.
            </p>
          </div>
        </div>

        <label className="cleaning-checkbox">
          <input
            type="checkbox"
            checked={
              options.trimWhitespace
            }
            onChange={(event) =>
              updateOption(
                "trimWhitespace",
                event.target.checked
              )
            }
          />

          <span>
            Trim text whitespace
          </span>
        </label>
      </div>

      <div className="cleaning-option">
        <div className="cleaning-option-header">
          <div className="cleaning-option-icon">
            <Scissors size={16} />
          </div>

          <div>
            <h3>
              Outlier handling
            </h3>

            <p>
              Handle numeric values
              outside IQR bounds.
            </p>
          </div>
        </div>

        <select
          value={
            options.outlierStrategy
          }
          onChange={(event) =>
            updateOption(
              "outlierStrategy",
              event.target.value
            )
          }
        >
          <option value="none">
            Keep outliers
          </option>

          <option value="remove">
            Remove affected rows
          </option>

          <option value="cap">
            Cap to IQR bounds
          </option>
        </select>

        <label className="cleaning-checkbox">
          <input
            type="checkbox"
            checked={
              options.removeOutliers
            }
            onChange={(event) =>
              updateOption(
                "removeOutliers",
                event.target.checked
              )
            }
          />

          <span>
            Enable outlier handling
          </span>
        </label>
      </div>

      <div className="cleaning-actions">
        <button
          className="secondary-button"
          onClick={onPreview}
        >
          <Broom size={15} />
          Preview changes
        </button>

        <button
          className="primary-button"
          onClick={onApply}
          disabled={!hasChanges}
        >
          <Scissors size={15} />
          Apply cleaning
        </button>

        <button
          className="secondary-button"
          onClick={onReset}
          disabled={!hasPreview}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </div>
  );
}