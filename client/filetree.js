const files = document.getElementById("root-folder-container");
const rootFolder = document.getElementById("root-folder");
const contextMenu = document.createElement("div");
contextMenu.id = "context-menu";

/**
 *
 * @param {string} id
 * @param {'file' | 'folder'} type
 */
function createForm(id, type) {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.type = "text";
  input.dataset.id = id;
  form.append(input);
  document.querySelector(`#${id} ul`).append(form);
  form[0].focus();
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!this[0].value) {
      return form[0].blur();
    }
    if (type === "file") {
      addFile(this[0].dataset.id, this[0].value).then(async (filePath) => {
        await addFileToServer(filePath);
        await insertFiletoEditor(filePath);
      });
    } else if (type === "folder") {
      addFolder(this[0].dataset.id, this[0].value).then(
        async (path) => await addFolderToServer(path)
      );
    }
    this.reset();
    form[0].blur();
  });
  form[0].addEventListener("blur", (e) => form.remove());
}

files.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  const { clientX, clientY } = e;

  if (e.target.className === "folder" || e.target.className === "open-folder") {
    folderContextMenu(e.target.id, clientX, clientY);
  }
  if (e.target.className === "file") {
    fileContextMenu(e.target.id, clientX, clientY);
  }
});

//creating custom context menus for right clicking the files and folders
/**
 *
 * @param {string} id
 * @param {number} x
 * @param {number} y
 */
function folderContextMenu(id, x, y) {
  removeContextMenu();

  contextMenu.style.top = `${y}px`;
  contextMenu.style.left = `${x}px`;
  const newFile = document.createElement("div");
  newFile.innerText = "New File";
  newFile.addEventListener("click", (e) => {
    createForm(id, "file");
  });
  const newFolder = document.createElement("div");
  newFolder.innerText = "New Folder";
  newFolder.addEventListener("click", (e) => {
    createForm(id, "folder");
  });
  const deleteFolder = document.createElement("div");
  deleteFolder.innerText = "Delete";
  deleteFolder.addEventListener("click", (e) => deleteEntry(id));

  contextMenu.append(newFile, newFolder);
  if (id !== "root-folder") {
    contextMenu.append(deleteFolder);
  }
  contextMenu.querySelectorAll("div").forEach((el) => (el.className = "item"));
  document.querySelector("body").append(contextMenu);
}

/**
 *
 * @param {string} id
 * @param {number} x
 * @param {number} y
 */
function fileContextMenu(id, x, y) {
  removeContextMenu();
  contextMenu.style.top = `${y}px`;
  contextMenu.style.left = `${x}px`;
  const deleteFile = document.createElement("div");
  deleteFile.innerText = "Delete";
  deleteFile.className = "item";
  deleteFile.addEventListener("click", (e) => deleteEntry(id));
  contextMenu.append(deleteFile);
  document.querySelector("body").append(contextMenu);
}

//hiding the custom context menus or input on clicking somewhere else
document.querySelector("body").addEventListener("click", hideContextMenu);

/**
 *
 * @param {MouseEvent} e
 */
function hideContextMenu(e) {
  if (e.target.id !== "context-menu") {
    removeContextMenu();
  }
}

function removeContextMenu() {
  clearElementsChildren(contextMenu);
  contextMenu.remove();
}

/**
 *
 * @param {string | undefined} id
 * @param {string} folderName
 * @returns {Promise.<string>}
 */
async function addFolder(id = "root-folder", folderName) {
  try {
    const currentFolder = document.querySelector(`#${id}`);
    const path =
      currentFolder.id === "root-folder"
        ? folderName
        : `${currentFolder.dataset.path}/${folderName}`;

    const li = document.createElement("li");
    li.innerText = folderName;
    li.className = "open-folder";
    li.dataset.path = path;
    li.id = "folder" + crypto.randomUUID();
    const ul = document.createElement("ul");
    li.append(ul);
    currentFolder.querySelector("ul").append(li);
    return path;
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param {string | undefined} id
 * @param {string} filename
 * @returns {Promise<string>}
 */
async function addFile(id = "root-folder", filename) {
  try {
    const currentFolder = document.querySelector(`#${id}`);
    const path =
      currentFolder.id === "root-folder"
        ? filename
        : `${currentFolder.dataset.path}/${filename}`;
    const li = document.createElement("li");
    li.className = "file";
    li.innerText = filename;
    li.id = "file" + crypto.randomUUID();
    li.dataset.path = path;
    currentFolder.querySelector("ul").append(li);
    return path;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 
 * @param {string} id 
 */
function deleteEntry(id) {
  const entry = document.getElementById(id);
  if (entry.className === "file") {
    deleteFileFromServer(entry.dataset.path);
  } else {
    deleteFolderFromServer(entry.dataset.path);
  }
  entry.remove();
}

rootFolder.addEventListener("click", collapseFolder);

/**
 * 
 * @param {MouseEvent} e 
 * @returns 
 */
function collapseFolder(e) {
  const id = e.target.id;
  if (!id) {
    return;
  }
  const currentFolder = document.getElementById(id);
  const target = document.querySelector(`#${id} ul`);
  if (e.target.className === "file") {
    const path = e.path[2].dataset.path
      ? `${e.path[2].dataset.path}/${e.target.innerText}`
      : e.target.innerText;
    return insertFiletoEditor(path);
  }
  if (target.style && target.style.display !== "none") {
    target.style.display = "none";
    currentFolder.className = "folder";
  } else {
    target.style.display = "block";
    currentFolder.className = "open-folder";
  }
}

async function renderExistingDirectory() {
  try {
    const directories = await getDirectoryList().then((res) => res.json());
    recursiveDirectoryLoop(directories);
    var path;
    function recursiveDirectoryLoop(directories) {
      let id;
      directories.forEach(async (dir) => {
        if (path) {
          id = document.querySelector(`[data-path='${path}']`).id;
        }
        if (typeof dir === "string") {
          await addFile(id, dir);
        } else if (typeof dir === "object" && !Array.isArray(dir)) {
          path = await addFolder(id, Object.keys(dir));
          return recursiveDirectoryLoop(Object.values(dir));
        } else {
          return recursiveDirectoryLoop(dir);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

(() => renderExistingDirectory())();
