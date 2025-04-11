/** @format */

import type { DataType, DBSchema } from "./typesAndConstants";

/**
 * Initialize the IndexedDB database
 * @param dbName The name of the database
 * @param storeName The name of the object store
 * @returns A promise that resolves when the database is ready
 */
export function initializeDB(
  dbName: string,
  storeName: string
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    // Handle database upgrade (called when database is created or version changes)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    // Handle successful database opening
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    // Handle errors
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Get data from IndexedDB
 * @param dbName The name of the database
 * @param storeName The name of the object store
 * @param key The key to retrieve
 * @returns A promise resolving to an array of number arrays, or null if not found
 */
export async function getArrayData(
  dbName: string,
  storeName: string,
  key: string
): Promise<DataType | null> {
  try {
    const db = await initializeDB(dbName, storeName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve(result.data as DataType);
        } else {
          resolve(null);
        }
        db.close();
      };

      request.onerror = (event) => {
        db.close();
        reject((event.target as IDBRequest).error);
      };
    });
  } catch (error) {
    console.error("Error getting data from IndexedDB:", error);
    throw error;
  }
}

/**
 * Set data in IndexedDB
 * @param dbName The name of the database
 * @param storeName The name of the object store
 * @param key The key to store the data under
 * @param data The array of number arrays to store
 * @returns A promise that resolves when the data is stored
 */
export async function setArrayData(
  dbName: string,
  storeName: string,
  key: string,
  data: DataType
): Promise<void> {
  try {
    const db = await initializeDB(dbName, storeName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.put({
        id: key,
        data,
        created_at: new Date().getTime(),
      });

      request.onsuccess = () => {
        db.close();
        resolve();
      };

      request.onerror = (event) => {
        db.close();
        reject((event.target as IDBRequest).error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("Error setting data in IndexedDB:", error);
    throw error;
  }
}

/**
 * Get all records from an object store
 * @param dbName The name of the database
 * @param storeName The name of the object store
 * @returns A promise resolving to an array of all records in the store
 */
export async function getAllRecords(
  dbName: string,
  storeName: string
): Promise<Array<DBSchema>> {
  try {
    const db = await initializeDB(dbName, storeName);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        db.close();
        resolve(request.result);
      };

      request.onerror = (event) => {
        db.close();
        reject((event.target as IDBRequest).error);
      };
    });
  } catch (error) {
    console.error("Error getting all records from IndexedDB:", error);
    throw error;
  }
}
