import {
  useRef,
  useState,
} from "react";

import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  LoaderCircle,
} from "lucide-react";

import { parseFile } from "../../services/fileParser";

export default function FileUpload({
  onFileLoaded,
}) {
  const inputRef = useRef(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [fileName, setFileName] =
    useState("");

  const [fileInfo, setFileInfo] =
    useState(null);

  async function handleFile(file) {
    if (!file) {
      return;
    }

    setLoading(true);
    setError("");
    setFileName("");
    setFileInfo(null);

    try {
      const result =
        await parseFile(file);

      setFileName(file.name);

      setFileInfo({
        rows:
          result.data?.length || 0,

        columns:
          result.columns?.length || 0,

        type: result.fileType,
      });

      onFileLoaded(result);
    } catch (err) {
      console.error(
        "File upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to process the file."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    handleFile(file);

    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();

    const file =
      event.dataTransfer.files?.[0];

    handleFile(file);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div
      className="upload-area"
      onDragOver={(event) =>
        event.preventDefault()
      }
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        hidden
        onChange={handleInputChange}
      />

      {loading ? (
        <>
          <div className="upload-icon">
            <LoaderCircle
              size={26}
              className="upload-spinner"
            />
          </div>

          <h3>
            Analyzing your dataset...
          </h3>

          <p>
            Reading the file and
            automatically profiling
            columns, statistics, quality,
            and patterns.
          </p>
        </>
      ) : error ? (
        <>
          <div className="upload-icon error-icon">
            <XCircle size={27} />
          </div>

          <h3>
            Upload failed
          </h3>

          <p>{error}</p>

          <button
            className="primary-button"
            onClick={openFilePicker}
          >
            Try again
          </button>
        </>
      ) : fileName ? (
        <>
          <div className="upload-icon success-icon">
            <CheckCircle size={27} />
          </div>

          <h3>
            Dataset analyzed successfully
          </h3>

          <p>{fileName}</p>

          {fileInfo && (
            <div className="upload-file-summary">
              <span>
                {fileInfo.rows.toLocaleString()}{" "}
                rows
              </span>

              <span>
                {fileInfo.columns} columns
              </span>

              <span>
                {fileInfo.type}
              </span>
            </div>
          )}

          <button
            className="primary-button"
            onClick={openFilePicker}
          >
            <Upload size={15} />
            Upload another file
          </button>
        </>
      ) : (
        <>
          <div className="upload-icon">
            <Upload size={27} />
          </div>

          <h3>
            Drop your dataset here
          </h3>

          <p>
            Drag and drop your CSV or
            Excel file here, or select a
            file from your computer.
          </p>

          <button
            className="primary-button"
            onClick={openFilePicker}
          >
            <Upload size={15} />
            Choose file
          </button>

          <span className="file-types">
            Supported formats: CSV, XLSX,
            XLS
          </span>
        </>
      )}
    </div>
  );
}