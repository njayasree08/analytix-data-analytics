const DB_NAME = "AnalytixDB";
const DB_VERSION = 1;
const STORE_NAME = "datasets";

/**
 * Open the Analytix IndexedDB database.
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(
          STORE_NAME,
          {
            keyPath: "id",
          }
        );

        store.createIndex(
          "uploadedAt",
          "uploadedAt",
          {
            unique: false,
          }
        );

        store.createIndex(
          "fileName",
          "fileName",
          {
            unique: false,
          }
        );
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(
        new Error(
          "Unable to open local dataset storage."
        )
      );
    };
  });
}


/**
 * Generate a unique dataset ID.
 */
function generateDatasetId() {
  return `dataset_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}


/**
 * Save a dataset permanently in IndexedDB.
 *
 * @param {Object} dataset
 * @returns {Promise<Object>} saved dataset
 */
export async function saveDataset(
  dataset
) {
  if (!dataset) {
    throw new Error(
      "No dataset provided."
    );
  }

  const db = await openDatabase();

  const datasetToSave = {
    ...dataset,

    id:
      dataset.id ||
      generateDatasetId(),

    data: [
      ...(dataset.data || []),
    ],

    columns: [
      ...(dataset.columns || []),
    ],

    rowCount:
      dataset.data?.length ||
      dataset.rowCount ||
      0,

    columnCount:
      dataset.columns?.length ||
      dataset.columnCount ||
      0,

    uploadedAt:
      dataset.uploadedAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  };

  return new Promise(
    (resolve, reject) => {
      const transaction =
        db.transaction(
          [STORE_NAME],
          "readwrite"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.put(datasetToSave);

      request.onsuccess = () => {
        resolve(datasetToSave);
      };

      request.onerror = () => {
        reject(
          new Error(
            "Unable to save the dataset."
          )
        );
      };

      transaction.oncomplete = () => {
        db.close();
      };

      transaction.onerror = () => {
        reject(
          new Error(
            "Dataset storage transaction failed."
          )
        );
      };
    }
  );
}


/**
 * Get a dataset by its ID.
 *
 * @param {string} datasetId
 * @returns {Promise<Object|null>}
 */
export async function getDataset(
  datasetId
) {
  if (!datasetId) {
    return null;
  }

  const db = await openDatabase();

  return new Promise(
    (resolve, reject) => {
      const transaction =
        db.transaction(
          [STORE_NAME],
          "readonly"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.get(datasetId);

      request.onsuccess = () => {
        resolve(
          request.result || null
        );
      };

      request.onerror = () => {
        reject(
          new Error(
            "Unable to load the dataset."
          )
        );
      };

      transaction.oncomplete = () => {
        db.close();
      };
    }
  );
}


/**
 * Get all saved datasets.
 *
 * @returns {Promise<Array>}
 */
export async function getAllDatasets() {
  const db = await openDatabase();

  return new Promise(
    (resolve, reject) => {
      const transaction =
        db.transaction(
          [STORE_NAME],
          "readonly"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.getAll();

      request.onsuccess = () => {
        const datasets =
          request.result || [];

        datasets.sort(
          (a, b) =>
            new Date(
              b.uploadedAt || 0
            ) -
            new Date(
              a.uploadedAt || 0
            )
        );

        resolve(datasets);
      };

      request.onerror = () => {
        reject(
          new Error(
            "Unable to load saved datasets."
          )
        );
      };

      transaction.oncomplete = () => {
        db.close();
      };
    }
  );
}


/**
 * Delete a dataset by ID.
 *
 * @param {string} datasetId
 * @returns {Promise<boolean>}
 */
export async function deleteDataset(
  datasetId
) {
  if (!datasetId) {
    return false;
  }

  const db = await openDatabase();

  return new Promise(
    (resolve, reject) => {
      const transaction =
        db.transaction(
          [STORE_NAME],
          "readwrite"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.delete(datasetId);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(
          new Error(
            "Unable to delete the dataset."
          )
        );
      };

      transaction.oncomplete = () => {
        db.close();
      };
    }
  );
}


/**
 * Delete all saved datasets.
 *
 * @returns {Promise<boolean>}
 */
export async function clearAllDatasets() {
  const db = await openDatabase();

  return new Promise(
    (resolve, reject) => {
      const transaction =
        db.transaction(
          [STORE_NAME],
          "readwrite"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.clear();

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(
          new Error(
            "Unable to clear saved datasets."
          )
        );
      };

      transaction.oncomplete = () => {
        db.close();
      };
    }
  );
}


/**
 * Check how many datasets are saved.
 *
 * @returns {Promise<number>}
 */
export async function getDatasetCount() {
  const db = await openDatabase();

  return new Promise(
    (resolve, reject) => {
      const transaction =
        db.transaction(
          [STORE_NAME],
          "readonly"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.count();

      request.onsuccess = () => {
        resolve(
          request.result || 0
        );
      };

      request.onerror = () => {
        reject(
          new Error(
            "Unable to count saved datasets."
          )
        );
      };

      transaction.oncomplete = () => {
        db.close();
      };
    }
  );
}