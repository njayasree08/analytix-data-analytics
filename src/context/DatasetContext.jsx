import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { profileDataset } from "../analysis/dataProfiler";

import {
  saveDataset,
  getAllDatasets,
  deleteDataset,
  clearAllDatasets,
} from "../services/storageService";

const DatasetContext =
  createContext(null);

export function DatasetProvider({
  children,
}) {
  const [dataset, setDataset] =
    useState(null);

  const [
    originalDataset,
    setOriginalDataset,
  ] = useState(null);

  const [analysis, setAnalysis] =
    useState(null);

  const [
    analysisLoading,
    setAnalysisLoading,
  ] = useState(false);

  const [
    analysisError,
    setAnalysisError,
  ] = useState("");

  const [
    savedDatasets,
    setSavedDatasets,
  ] = useState([]);

  const [
    storageLoading,
    setStorageLoading,
  ] = useState(true);

  const [
    storageError,
    setStorageError,
  ] = useState("");


  /* =====================================================
     ANALYZE DATASET
  ===================================================== */

  function analyzeDataset(
    datasetResult
  ) {
    setAnalysisLoading(true);
    setAnalysisError("");

    try {
      const profile =
        profileDataset(
          datasetResult.data || [],
          datasetResult.columns || []
        );

      setAnalysis(profile);
    } catch (error) {
      console.error(
        "Dataset analysis failed:",
        error
      );

      setAnalysisError(
        error.message ||
          "Unable to analyze the dataset."
      );

      setAnalysis(null);
    } finally {
      setAnalysisLoading(false);
    }
  }


  /* =====================================================
     LOAD SAVED DATASETS
  ===================================================== */

  async function loadSavedDatasets() {
    try {
      setStorageLoading(true);
      setStorageError("");

      const datasets =
        await getAllDatasets();

      setSavedDatasets(
        datasets || []
      );

      return datasets || [];
    } catch (error) {
      console.error(
        "Unable to load saved datasets:",
        error
      );

      setStorageError(
        error.message ||
          "Unable to load saved datasets."
      );

      return [];
    } finally {
      setStorageLoading(false);
    }
  }


  /* =====================================================
     RESTORE LAST DATASET
  ===================================================== */

  async function restoreLastDataset() {
    try {
      setStorageLoading(true);
      setStorageError("");

      const datasets =
        await getAllDatasets();

      setSavedDatasets(
        datasets || []
      );

      /*
       * No saved datasets yet.
       */
      if (
        !datasets ||
        datasets.length === 0
      ) {
        return;
      }

      /*
       * getAllDatasets() already sorts
       * datasets by uploadedAt.
       *
       * Therefore the first item
       * is the latest dataset.
       */
      const latestDataset =
        datasets[0];

      if (!latestDataset) {
        return;
      }

      /*
       * Restore active dataset.
       */
      setDataset(
        latestDataset
      );

      /*
       * Keep original dataset
       * for reset/cleaning operations.
       */
      setOriginalDataset({
        ...latestDataset,

        data: [
          ...(latestDataset.data ||
            []),
        ],

        columns: [
          ...(latestDataset.columns ||
            []),
        ],
      });

      /*
       * Run analysis again.
       */
      analyzeDataset(
        latestDataset
      );
    } catch (error) {
      console.error(
        "Unable to restore last dataset:",
        error
      );

      setStorageError(
        error.message ||
          "Unable to restore the saved dataset."
      );
    } finally {
      setStorageLoading(false);
    }
  }


  /* =====================================================
     RESTORE DATASET WHEN APP STARTS
  ===================================================== */

  useEffect(() => {
    restoreLastDataset();
  }, []);


  /* =====================================================
     UPLOAD + SAVE DATASET
  ===================================================== */

  async function setUploadedDataset(
    result
  ) {
    if (!result) {
      return;
    }

    setAnalysisError("");
    setStorageError("");

    const uploadedDataset = {
      ...result,

      data: [
        ...(result.data || []),
      ],

      columns: [
        ...(result.columns || []),
      ],

      rowCount:
        result.data?.length || 0,

      columnCount:
        result.columns?.length || 0,

      uploadedAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      cleaned: false,
    };

    try {
      /*
       * Save to IndexedDB.
       */
      const savedDataset =
        await saveDataset(
          uploadedDataset
        );

      /*
       * Make it the active dataset.
       */
      setDataset(
        savedDataset
      );

      /*
       * Keep original copy.
       */
      setOriginalDataset({
        ...savedDataset,

        data: [
          ...(savedDataset.data ||
            []),
        ],

        columns: [
          ...(savedDataset.columns ||
            []),
        ],
      });

      /*
       * Analyze immediately.
       */
      analyzeDataset(
        savedDataset
      );

      /*
       * Refresh saved dataset list.
       */
      await loadSavedDatasets();
    } catch (error) {
      console.error(
        "Unable to save uploaded dataset:",
        error
      );

      setStorageError(
        error.message ||
          "Unable to save the dataset locally."
      );

      /*
       * Keep current-session functionality
       * even if IndexedDB fails.
       */
      setDataset(
        uploadedDataset
      );

      setOriginalDataset({
        ...uploadedDataset,

        data: [
          ...(uploadedDataset.data ||
            []),
        ],

        columns: [
          ...(uploadedDataset.columns ||
            []),
        ],
      });

      analyzeDataset(
        uploadedDataset
      );
    }
  }


  /* =====================================================
     UPDATE DATASET
  ===================================================== */

  async function updateDataset(
    updatedDataset
  ) {
    if (!updatedDataset) {
      return;
    }

    const nextDataset = {
      ...updatedDataset,

      data: [
        ...(updatedDataset.data ||
          []),
      ],

      columns: [
        ...(updatedDataset.columns ||
          []),
      ],

      rowCount:
        updatedDataset.data?.length ||
        0,

      columnCount:
        updatedDataset.columns
          ?.length || 0,

      updatedAt:
        new Date().toISOString(),
    };

    try {
      const savedDataset =
        await saveDataset(
          nextDataset
        );

      setDataset(
        savedDataset
      );

      analyzeDataset(
        savedDataset
      );

      await loadSavedDatasets();
    } catch (error) {
      console.error(
        "Unable to update dataset:",
        error
      );

      setStorageError(
        error.message ||
          "Unable to update the dataset."
      );

      setDataset(
        nextDataset
      );

      analyzeDataset(
        nextDataset
      );
    }
  }


  /* =====================================================
     OPEN SAVED DATASET
  ===================================================== */

  async function openSavedDataset(
    datasetId
  ) {
    if (!datasetId) {
      return null;
    }

    try {
      setStorageError("");

      const datasets =
        await getAllDatasets();

      const selectedDataset =
        datasets.find(
          (item) =>
            item.id === datasetId
        );

      if (!selectedDataset) {
        throw new Error(
          "Saved dataset could not be found."
        );
      }

      setDataset(
        selectedDataset
      );

      setOriginalDataset({
        ...selectedDataset,

        data: [
          ...(selectedDataset.data ||
            []),
        ],

        columns: [
          ...(selectedDataset.columns ||
            []),
        ],
      });

      analyzeDataset(
        selectedDataset
      );

      return selectedDataset;
    } catch (error) {
      console.error(
        "Unable to open saved dataset:",
        error
      );

      setStorageError(
        error.message ||
          "Unable to open the saved dataset."
      );

      return null;
    }
  }


  /* =====================================================
     DELETE SAVED DATASET
  ===================================================== */

  async function removeSavedDataset(
    datasetId
  ) {
    if (!datasetId) {
      return;
    }

    try {
      setStorageError("");

      await deleteDataset(
        datasetId
      );

      /*
       * Clear active dataset if
       * the active dataset was deleted.
       */
      if (
        dataset?.id === datasetId
      ) {
        setDataset(null);
        setOriginalDataset(null);
        setAnalysis(null);
      }

      await loadSavedDatasets();
    } catch (error) {
      console.error(
        "Unable to delete dataset:",
        error
      );

      setStorageError(
        error.message ||
          "Unable to delete the dataset."
      );
    }
  }


  /* =====================================================
     DELETE ALL DATASETS
  ===================================================== */

  async function removeAllSavedDatasets() {
    try {
      setStorageError("");

      await clearAllDatasets();

      setSavedDatasets([]);

      setDataset(null);
      setOriginalDataset(null);
      setAnalysis(null);
    } catch (error) {
      console.error(
        "Unable to clear datasets:",
        error
      );

      setStorageError(
        error.message ||
          "Unable to clear saved datasets."
      );
    }
  }


  /* =====================================================
     RESET DATASET
  ===================================================== */

  async function resetDataset() {
    if (!originalDataset) {
      return;
    }

    const restoredDataset = {
      ...originalDataset,

      data: [
        ...(originalDataset.data ||
          []),
      ],

      columns: [
        ...(originalDataset.columns ||
          []),
      ],

      rowCount:
        originalDataset.data
          ?.length || 0,

      columnCount:
        originalDataset.columns
          ?.length || 0,

      cleaned: false,

      updatedAt:
        new Date().toISOString(),
    };

    try {
      const savedDataset =
        await saveDataset(
          restoredDataset
        );

      setDataset(
        savedDataset
      );

      analyzeDataset(
        savedDataset
      );

      await loadSavedDatasets();
    } catch (error) {
      console.error(
        "Unable to reset dataset:",
        error
      );

      setStorageError(
        error.message ||
          "Unable to reset the dataset."
      );

      setDataset(
        restoredDataset
      );

      analyzeDataset(
        restoredDataset
      );
    }
  }


  /* =====================================================
     CLEAR ACTIVE DATASET
  ===================================================== */

  function clearDataset() {
    setDataset(null);
    setOriginalDataset(null);
    setAnalysis(null);
    setAnalysisError("");
  }


  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = useMemo(
    () => ({
      dataset,
      originalDataset,
      analysis,

      analysisLoading,
      analysisError,

      savedDatasets,
      storageLoading,
      storageError,

      hasDataset:
        Boolean(dataset),

      hasAnalysis:
        Boolean(analysis),

      setUploadedDataset,

      updateDataset,

      openSavedDataset,

      removeSavedDataset,

      removeAllSavedDatasets,

      resetDataset,

      clearDataset,

      loadSavedDatasets,
    }),
    [
      dataset,
      originalDataset,
      analysis,
      analysisLoading,
      analysisError,
      savedDatasets,
      storageLoading,
      storageError,
    ]
  );


  return (
    <DatasetContext.Provider
      value={value}
    >
      {children}
    </DatasetContext.Provider>
  );
}


/* =======================================================
   USE DATASET HOOK
======================================================= */

export function useDataset() {
  const context =
    useContext(
      DatasetContext
    );

  if (!context) {
    throw new Error(
      "useDataset must be used inside DatasetProvider"
    );
  }

  return context;
}