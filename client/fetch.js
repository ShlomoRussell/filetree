const baseUrl = "http://localhost:3001";

/**
 *
 * @param {string} folderPath
 * @returns
 */

function addFolderToServer(folderPath) {
  return fetch("http://localhost:3001/folder/", {
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
function addFileToServer(filePath) {
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
function getFileContents(filePath) {
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
function addFileContents(filePath, fileContents) {
  return fetch(`${baseUrl}/file/save`, {
    method: "POST",
    body: JSON.stringify({ filePath, fileContents }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function getDirectoryList() {
  return fetch(`${baseUrl}/folder/directoryList`);
}

/**
 *
 * @param {string} path
 * @returns
 */
function deleteFileFromServer(path) {
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
function deleteFolderFromServer(path) {
  return fetch(`${baseUrl}/folder`, {
    method: "DELETE",
    body: JSON.stringify({ path }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
