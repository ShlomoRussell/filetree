const baseUrl = "http://localhost:3001";
function addFolderToServer(folderPath) {
  return fetch("http://localhost:3001/folder/", {
    method: "POST",
    body: JSON.stringify({ folderPath }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function addFileToServer(filePath) {
  return fetch(`${baseUrl}/file`, {
    method: "POST",
    body: JSON.stringify({ filePath }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function getFileContents(filePath) {
  return fetch(`${baseUrl}/file`, {
    headers: { filePath: filePath },
  });
}

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

function deleteFileFromServer(path) {
  return fetch(`${baseUrl}/file`, {
    method: "DELETE",
    body: JSON.stringify({ path }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function deleteFolderFromServer(path) {
  return fetch(`${baseUrl}/folder`, {
    method: "DELETE",
    body: JSON.stringify({ path }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
