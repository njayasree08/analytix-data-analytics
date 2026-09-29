import { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  Table2,
} from "lucide-react";

export default function DataTable({
  data = [],
  columns = [],
  rowsPerPage = 10,
}) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    const query =
      searchTerm.trim().toLowerCase();

    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column];

        if (
          value === null ||
          value === undefined
        ) {
          return false;
        }

        return String(value)
          .toLowerCase()
          .includes(query);
      })
    );
  }, [data, columns, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length / rowsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    rowsPerPage;

  const currentRows = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  function handleSearch(event) {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  }

  function goToNextPage() {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1)
    );
  }

  function formatValue(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return (
        <span className="missing-value">
          —
        </span>
      );
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (typeof value === "number") {
      return value.toLocaleString();
    }

    const text = String(value);

    if (text.length > 80) {
      return `${text.substring(0, 80)}...`;
    }

    return text;
  }

  return (
    <div className="data-preview">
      <div className="preview-toolbar">
        <div className="preview-search-wrapper">
          <Search size={15} />

          <input
            className="preview-search"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search dataset..."
          />
        </div>

        <div className="preview-info">
          Showing{" "}
          {filteredData.length === 0
            ? 0
            : startIndex + 1}{" "}
          –
          {Math.min(
            startIndex + rowsPerPage,
            filteredData.length
          )}{" "}
          of{" "}
          {filteredData.length.toLocaleString()}{" "}
          rows
        </div>
      </div>

      {columns.length === 0 ? (
        <div className="preview-empty">
          <Table2 size={28} />

          <h3>
            No columns available
          </h3>

          <p>
            Upload a dataset to preview
            its contents.
          </p>
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
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map(
                  (row, rowIndex) => (
                    <tr
                      key={`${startIndex}-${rowIndex}`}
                    >
                      <td className="row-number">
                        {startIndex +
                          rowIndex +
                          1}
                      </td>

                      {columns.map(
                        (column) => (
                          <td
                            key={`${rowIndex}-${column}`}
                            title={
                              row[column] ===
                                null ||
                              row[column] ===
                                undefined
                                ? ""
                                : String(
                                    row[column]
                                  )
                            }
                          >
                            {formatValue(
                              row[column]
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length + 1
                    }
                  >
                    <div className="table-no-results">
                      <Search size={22} />

                      <span>
                        No matching rows found.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="pagination">
          <span className="pagination-info">
            Page {safeCurrentPage} of{" "}
            {totalPages}
          </span>

          <div className="pagination-buttons">
            <button
              className="pagination-button"
              onClick={
                goToPreviousPage
              }
              disabled={
                safeCurrentPage === 1
              }
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>

            {createPageNumbers(
              safeCurrentPage,
              totalPages
            ).map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="pagination-ellipsis"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`pagination-button ${
                    safeCurrentPage === page
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              )
            )}

            <button
              className="pagination-button"
              onClick={goToNextPage}
              disabled={
                safeCurrentPage ===
                totalPages
              }
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function createPageNumbers(
  currentPage,
  totalPages
) {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (currentPage <= 3) {
    return [
      1,
      2,
      3,
      4,
      "...",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}