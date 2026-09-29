import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Search,
  Table2,
} from "lucide-react";

export default function DataPreview({ dataset }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  if (!dataset) {
    return (
      <section className="dashboard-state">
        <div className="state-icon">
          <Table2 size={26} />
        </div>

        <span className="state-label">
          DATA PREVIEW
        </span>

        <h2>No dataset available</h2>

        <p>
          Upload a CSV or Excel dataset to preview
          and explore its records.
        </p>
      </section>
    );
  }

  const data = dataset.data || [];
  const columns = dataset.columns || [];

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column];

        return String(value ?? "")
          .toLowerCase()
          .includes(query);
      })
    );
  }, [data, columns, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / rowsPerPage)
  );

  const safePage = Math.min(page, totalPages);

  const startIndex =
    (safePage - 1) * rowsPerPage;

  const visibleRows = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  function handleSearch(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function previousPage() {
    setPage((current) =>
      Math.max(1, current - 1)
    );
  }

  function nextPage() {
    setPage((current) =>
      Math.min(totalPages, current + 1)
    );
  }

  return (
    <section className="preview-page">
      {/* HEADER */}

      <div className="preview-header">
        <div className="preview-title">
          <div className="preview-title-icon">
            <Database size={20} />
          </div>

          <div>
            <span className="preview-label">
              DATASET EXPLORER
            </span>

            <h2>{dataset.fileName}</h2>

            <p>
              {data.length.toLocaleString()} rows
              {" • "}
              {columns.length} columns
            </p>
          </div>
        </div>

        <div className="preview-status">
          <span />
          Dataset loaded
        </div>
      </div>

      {/* TOOLBAR */}

      <div className="preview-toolbar">
        <div className="preview-search">
          <Search size={15} />

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search across all columns..."
          />
        </div>

        <div className="preview-count">
          <strong>
            {filteredData.length.toLocaleString()}
          </strong>

          <span>
            matching rows
          </span>
        </div>
      </div>

      {/* TABLE */}

      <div className="preview-card">
        <div className="preview-card-header">
          <div>
            <h3>Data Preview</h3>

            <p>
              Showing a maximum of 10 records per page
            </p>
          </div>

          <div className="preview-table-icon">
            <Table2 size={15} />
          </div>
        </div>

        {columns.length === 0 ? (
          <div className="preview-empty">
            <Database size={22} />

            <strong>
              No columns detected
            </strong>

            <span>
              The uploaded dataset does not contain
              readable columns.
            </span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="row-number-column">
                    #
                  </th>

                  {columns.map((column) => (
                    <th key={column}>
                      <span title={column}>
                        {column}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="no-results"
                    >
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row, index) => (
                    <tr key={`${safePage}-${index}`}>
                      <td className="row-number">
                        {startIndex + index + 1}
                      </td>

                      {columns.map((column) => {
                        const value =
                          row[column];

                        const empty =
                          value === null ||
                          value === undefined ||
                          value === "";

                        return (
                          <td
                            key={column}
                            className={
                              empty
                                ? "missing-cell"
                                : ""
                            }
                          >
                            {empty ? (
                              <span className="missing-value">
                                Missing
                              </span>
                            ) : (
                              <span
                                title={String(value)}
                              >
                                {formatCellValue(
                                  value
                                )}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}

        {filteredData.length > 0 && (
          <div className="preview-pagination">
            <span>
              Showing{" "}
              <strong>
                {startIndex + 1}
              </strong>
              {" – "}
              <strong>
                {Math.min(
                  startIndex + rowsPerPage,
                  filteredData.length
                )}
              </strong>
              {" of "}
              <strong>
                {filteredData.length.toLocaleString()}
              </strong>
            </span>

            <div className="pagination-controls">
              <button
                onClick={previousPage}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>

              <div className="page-number">
                {safePage}
              </div>

              <span>
                of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={
                  safePage === totalPages
                }
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function formatCellValue(value) {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? value.toLocaleString()
      : value.toLocaleString(undefined, {
          maximumFractionDigits: 4,
        });
  }

  return String(value);
}