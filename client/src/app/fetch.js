const baseUrl = process != undefined ? process.env.baseUrl : "/";

/**
 *
 * @param {string} folderPath
 * @returns
 */

export function addFolderToServer(folderPath) {
  return fetch(`${baseUrl}/folder/`, {
    method: "POST",
    body: JSON.stringify({ folderPath }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 *
 * @param {string} filePath
 * @returns
 */
export function addFileToServer(filePath) {
  return fetch(`${baseUrl}/file`, {
    method: "POST",
    body: JSON.stringify({ filePath }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 *
 * @param {string} filePath
 * @returns
 */
export function getFileContents(filePath) {
  return fetch(`${baseUrl}/file`, {
    headers: { filePath: filePath },
  });
}

/**
 *
 * @param {string} filePath
 * @param {string} fileContents
 * @returns
 */
export function addFileContents(filePath, fileContents) {
  return fetch(`${baseUrl}/file/save`, {
    method: "POST",
    body: JSON.stringify({ filePath, fileContents }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getDirectoryList() {
  return fetch(`${baseUrl}/folder/directoryList`);
}

/**
 *
 * @param {string} path
 * @returns
 */
export function deleteFileFromServer(path) {
  return fetch(`${baseUrl}/file`, {
    method: "DELETE",
    body: JSON.stringify({ path }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 *
 * @param {string} path
 * @returns
 */
export function deleteFolderFromServer(path) {
  return fetch(`${baseUrl}/folder`, {
    method: "DELETE",
    body: JSON.stringify({ path }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 *
 * @param {string} oldPath
 * @param {string} newPath
 * @returns
 */
export function renameEntryOnServer(oldPath, newPath) {
  return fetch(`${baseUrl}/file`, {
    method: "PUT",
    body: JSON.stringify({ oldPath, newPath }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
