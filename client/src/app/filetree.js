import {
  addFileToServer,
  addFolderToServer,
  deleteFileFromServer,
  deleteFolderFromServer,
  getDirectoryList,
  renameEntryOnServer,
} from "./fetch.js";
import { insertFiletoEditor } from "./text-editor.js";
import { clearElementsChildren } from "./util.js";

const body = document.querySelector("body");

const contextMenuElement = document.createElement("div");
contextMenuElement.id = "context-menu";

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
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!this[0].value) {
      return form[0].blur();
    }
    if (type === "file") {
      const filePath = await addEntry(type, this[0].dataset.id, this[0].value);
      await addFileToServer(filePath);
      await insertFiletoEditor(filePath);
    } else if (type === "folder") {
      const folderPath = await addEntry(
        type,
        this[0].dataset.id,
        this[0].value
      );
      await addFolderToServer(folderPath);
    }
    this.reset();
    form[0].blur();
  });
  form[0].addEventListener("blur", (e) => form.remove());
}

export function filesContainerRghtClickHandler(e) {
  e.preventDefault();
  const { clientX, clientY } = e;
  const id = e.target.id || e.target.dataset.id;
  const className = e.target.className;
  if (className.includes("folder")) {
    contextMenu(id, clientX, clientY, "folder");
  }
  if (className.includes("file")) {
    contextMenu(id, clientX, clientY, "file");
  }
}
/**
 * Creats a context menu for right clicking on a file or folder
 * @param {string} entryId
 * @param {number} x
 * @param {number} y
 * @param {'file' | 'folder'} type
 */
function contextMenu(entryId, x, y, type) {
  removeContextMenu();
  contextMenuElement.style.top = `${y}px`;
  contextMenuElement.style.left = `${x}px`;
  const menuOptions = {
    folder: [
      {
        text: "New File",
        action: () => createForm(entryId, "file"),
      },
      {
        text: "New Folder",
        action: () => createForm(entryId, "folder"),
      },
    ],
    file: [
      {
        text: "Rename",
        action: () => renameEntry(entryId),
      },
    ],
    all: [
      {
        text: "Delete",
        action: () => deleteEntry(entryId),
      },
    ],
  };
  menuOptions[type].concat(menuOptions.all).forEach((option) => {
    const menuOption = document.createElement("div");
    menuOption.innerText = option.text;
    menuOption.addEventListener("click", option.action);
    contextMenuElement.append(menuOption);
  });
  contextMenuElement
    .querySelectorAll("div")
    .forEach((el) => (el.className = "item"));
  body.append(contextMenuElement);
}

// Removes the context menu element from the DOM.
function removeContextMenu() {
  clearElementsChildren(contextMenuElement);
  contextMenuElement.remove();
}

//hiding the custom context menus on somewhere else and inserting files to the editor

/**
 *
 * @param {MouseEvent} e
 */
export function handleBodyClick(e) {
  const id = e.target.id || e.target.dataset.id;
  if (id !== "context-menu" && contextMenuElement.childElementCount) {
    removeContextMenu();
  } else if (!id) {
    return;
  } else if (e.target.className === "file-span") {
    const path = e.target.dataset.path
      ? e.target.dataset.path
      : e.target.innerText;
    insertFiletoEditor(path);
  } else if (id === "add-folder" || id === "add-file") {
    findActiveFolder(id.split("-")[1]);
  } else collapseFolder(id);
  e.target.tagName === "SPAN" && toggleActiveEntry(id);
}

/**
 * Adds entry (folder or file) to the DOM
 * @param {'file' | 'folder'} type
 * @param {string | undefined} id
 * @param {string} name
 * @returns {Promise.<string>}
 */
async function addEntry(type, id = "root-folder", name) {
  try {
    const currentFolder = document.querySelector(`#${id}`);
    const path =
      currentFolder.id === "root-folder"
        ? name
        : `${currentFolder.dataset.path}/${name}`;

    const elementType = type === "folder" ? "open-folder" : "file";
    const spanClass = type === "folder" ? "folder-span" : "file-span";

    const li = document.createElement("li");
    li.className = elementType;
    li.id = `${type}${crypto.randomUUID()}`;
    li.dataset.path = path;

    const span = document.createElement("span");
    span.innerText = name;
    span.dataset.id = li.id;
    span.dataset.path = path;
    span.className = spanClass;
    li.append(span);

    if (type === "folder") {
      const ul = document.createElement("ul");
      li.append(ul);
    }

    currentFolder.querySelector("ul").append(li);
    return path;
  } catch (error) {
    console.log(error);
  }
}

/**
 *Deletes an entry (file or folder) from the server and updates the UI
 * @param {string} entryId
 */
async function deleteEntry(entryId) {
  const entry = document.getElementById(entryId);
  try {
    if (entry.className === "file") {
      await deleteFileFromServer(entry.dataset.path);
    } else {
      await deleteFolderFromServer(entry.dataset.path);
    }
    entry.remove();
  } catch (error) {
    console.log(error);
  }
}

async function renameEntry(entryId) {
  const entry = document.getElementById(entryId);
  try {
    await renameEntryOnServer(entry.dataset.path);
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param {string} id
 */
function collapseFolder(id) {
  if (!id.startsWith("folder")) {
    return;
  }
  const currentFolder = document.getElementById(id);
  const target = document.querySelector(`#${id} ul`);
  if (target && target.style.display !== "none") {
    target.style.display = "none";
    currentFolder.className = "folder";
  } else if (target) {
    target.style.display = "block";
    currentFolder.className = "open-folder";
  }
}

export async function renderExistingDirectory() {
  try {
    const directories = await getDirectoryList().then((res) => res.json());
    recursiveDirectoryLoop(directories);
    var path;
    /**
     *
     * @param {string[] | {}[]} directories
     */
    function recursiveDirectoryLoop(directories) {
      /**
       * @type {string}
       */
      let id;
      directories.forEach(async (dir) => {
        if (path) {
          id = document.querySelector(`[data-path='${path}']`).id;
        }
        if (typeof dir === "string") {
          await addEntry("file", id, dir);
        } else if (typeof dir === "object" && !Array.isArray(dir)) {
          path = await addEntry("folder", id, Object.keys(dir));
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

/**
 *
 * @param {string} datasetId
 */
function toggleActiveEntry(datasetId) {
  document
    .getElementById("root-folder")
    .querySelectorAll("span")
    .forEach((span) => {
      if (span.dataset.id === datasetId) {
        span.classList.add("active");
      } else {
        span.classList.remove("active");
      }
    });
}

/**
 *
 * @param {"file" | "folder" } type
 */
function findActiveFolder(type) {
  try {
    const currentFolder = document
      .getElementById("root-folder")
      .querySelector("span.active");
    if (currentFolder && currentFolder.className.includes("folder")) {
      createForm(currentFolder.dataset.id, type);
    } else createForm("root-folder", type);
  } catch (error) {
    console.log(error);
  }
}
