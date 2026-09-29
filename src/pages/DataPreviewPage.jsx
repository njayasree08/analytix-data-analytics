import {
  ArrowDownAZ,
  CalendarDays,
  Database,
  FileSpreadsheet,
  Hash,
  Search,
  Type,
} from "lucide-react";

import { useMemo, useState } from "react";

import { useDataset } from "../context/DatasetContext";
import "../styles/data-preview.css";

const PAGE_SIZE = 12;

export default function DataPreviewPage() {
  const {
    dataset,
    analysis,
    hasDataset,
  } = useDataset();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const data = dataset?.data || [];
  const columns = dataset?.columns || [];

  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return data;
    }

    const query = search.toLowerCase();

    return data.filter((row) =>
      columns.some((column) =>
        String(row[column] ?? "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [data, columns, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / PAGE_SIZE)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const visibleRows = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const columnTypes = analysis?.types || [];

  function getColumnType(column) {
    const item = columnTypes.find(
      (type) => type.column === column
    );

    return item?.type || "unknown";
  }

  function getTypeIcon(type) {
    if (type === "numeric") {
      return <Hash size={13} />;
    }

    if (type === "date") {
      return <CalendarDays size={13} />;
    }

    if (
      type === "categorical" ||
      type === "text"
    ) {
      return <Type size={13} />;
    }

    return <Database size={13} />;
  }

  function handleSearch(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  if (!hasDataset) {
    return (
      <section className="preview-page">
        <div className="preview-empty">
          <div className="preview-empty-icon">
            <FileSpreadsheet size={28} />
          </div>

          <span className="preview-eyebrow">
            DATA EXPLORER
          </span>

          <h2>No dataset loaded</h2>

          <p>
            Upload a CSV or Excel dataset to inspect
            your rows, columns, and detected data types.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="preview-page">
      {/* HEADER */}
      <header className="preview-header">
        <div className="preview-heading">
          <div className="preview-title-icon">
            <Database size={21} />
          </div>

          <div>
            <span className="preview-eyebrow">
              DATA EXPLORER
            </span>

            <h2>Data Preview</h2>

            <p>
              Explore the records and structure of your
              uploaded dataset.
            </p>
          </div>
        </div>

        <div className="preview-file-badge">
          <FileSpreadsheet size={16} />

          <div>
            <strong>
              {dataset.fileName}
            </strong>

            <span>
              {dataset.fileType || "Dataset"}
            </span>
          </div>
        </div>
      </header>

      {/* SUMMARY */}
      <div className="preview-summary">
        <PreviewMetric
          label="Total records"
          value={data.length.toLocaleString()}
          icon={<Database size={17} />}
        />

        <PreviewMetric
          label="Columns"
          value={columns.length}
          icon={<Hash size={17} />}
        />

        <PreviewMetric
          label="Visible records"
          value={filteredData.length.toLocaleString()}
          icon={<ArrowDownAZ size={17} />}
        />

        <PreviewMetric
          label="Dataset type"
          value={dataset.fileType || "File"}
          icon={<FileSpreadsheet size={17} />}
        />
      </div>

      {/* TABLE PANEL */}
      <section className="preview-table-card">
        <div className="preview-table-header">
          <div>
            <span className="preview-section-label">
              RECORD EXPLORER
            </span>

            <h3>Dataset records</h3>

            <p>
              Search across every column to quickly find
              specific records.
            </p>
          </div>

          <div className="preview-search">
            <Search size={15} />

            <input
              type="text"
              placeholder="Search dataset..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="preview-filter-info">
          <span>
            Showing{" "}
            <strong>
              {visibleRows.length}
            </strong>{" "}
            of{" "}
            <strong>
              {filteredData.length.toLocaleString()}
            </strong>{" "}
            matching records
          </span>

          {search && (
            <button
              className="preview-clear-search"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
            >
              Clear search
            </button>
          )}
        </div>

        <div className="preview-table-wrapper">
          <table className="preview-table">
            <thead>
              <tr>
                <th className="preview-index-column">
                  #
                </th>

                {columns.map((column) => {
                  const type =
                    getColumnType(column);

                  return (
                    <th key={column}>
                      <div className="preview-column-header">
                        <span>
                          {column}
                        </span>

                        <small
                          className={`preview-type ${type}`}
                          title={`Detected type: ${type}`}
                        >
                          {getTypeIcon(type)}
                          {type}
                        </small>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {visibleRows.length > 0 ? (
                visibleRows.map(
                  (row, rowIndex) => (
                    <tr
                      key={`${currentPage}-${rowIndex}`}
                    >
                      <td className="preview-row-number">
                        {(currentPage - 1) *
                          PAGE_SIZE +
                          rowIndex +
                          1}
                      </td>

                      {columns.map(
                        (column) => (
                          <td
                            key={column}
                            title={String(
                              row[column] ?? ""
                            )}
                          >
                            {formatCellValue(
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
                    <div className="preview-no-results">
                      <Search size={20} />

                      <strong>
                        No matching records
                      </strong>

                      <span>
                        Try a different search term.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="preview-pagination">
          <span>
            Page{" "}
            <strong>
              {currentPage}
            </strong>{" "}
            of{" "}
            <strong>
              {totalPages}
            </strong>
          </span>

          <div className="preview-pagination-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setPage(
                  currentPage - 1
                )
              }
            >
              Previous
            </button>

            {getPageNumbers(
              currentPage,
              totalPages
            ).map((number) => (
              <button
                key={number}
                className={
                  number === currentPage
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPage(number)
                }
              >
                {number}
              </button>
            ))}

            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setPage(
                  currentPage + 1
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* COLUMN INFORMATION */}
      <section className="preview-columns-card">
        <div className="preview-table-header">
          <div>
            <span className="preview-section-label">
              SCHEMA OVERVIEW
            </span>

            <h3>Column structure</h3>

            <p>
              Automatically detected types for every
              column in the dataset.
            </p>
          </div>
        </div>

        <div className="preview-column-grid">
          {columns.map((column) => {
            const type =
              getColumnType(column);

            const typeInfo =
              columnTypes.find(
                (item) =>
                  item.column === column
              );

            return (
              <div
                className="preview-column-card"
                key={column}
              >
                <div
                  className={`preview-column-type-icon ${type}`}
                >
                  {getTypeIcon(type)}
                </div>

                <div className="preview-column-details">
                  <strong title={column}>
                    {column}
                  </strong>

                  <span>
                    {type}
                  </span>

                  {typeInfo?.uniqueCount !==
                    undefined && (
                    <small>
                      {
                        typeInfo.uniqueCount
                      }{" "}
                      unique values
                    </small>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function PreviewMetric({
  label,
  value,
  icon,
}) {
  return (
    <div className="preview-metric">
      <div className="preview-metric-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function formatCellValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return (
      <span className="preview-null">
        —
      </span>
    );
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (
    typeof value === "number"
  ) {
    return value.toLocaleString();
  }

  if (
    typeof value === "boolean"
  ) {
    return value ? "True" : "False";
  }

  return String(value);
}

function getPageNumbers(
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
    return [1, 2, 3, 4, 5];
  }

  if (
    currentPage >=
    totalPages - 2
  ) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
}