const files = document.getElementById("root-folder-container");
const contextMenu = document.createElement("div");
contextMenu.id = "context-menu";

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
      addFile(this[0].dataset.id, this[0].value);
    } else if (type === "folder") {
      addFolder(this[0].dataset.id, this[0].value);
    }
    this.reset();
    form[0].blur();
  });
  form[0].addEventListener("blur", (e) => form.remove());
}

files.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  const { clientX, clientY } = e;

  if (
    e.target.className === "folder" ||
    e.target.className === "open-folder"
  ) {
    folderContextMenu(e.target.id, clientX, clientY);
  }
  if (e.target.className === "file") {
    fileContextMenu(e.target.id, clientX, clientY);
  }
});

//creating custom context menus for right clicking the files and folders
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

function hideContextMenu(e) {
  if (e.target.id !== "context-menu") {
    removeContextMenu();
  }
}

function removeContextMenu() {
  while (contextMenu.firstChild) {
    contextMenu.removeChild(contextMenu.lastChild);
  }
  contextMenu.remove();
}

function addFolder(id, folderName) {
  const li = document.createElement("li");
  li.innerText = folderName;
  li.className = "open-folder";
  li.id = "folder" + crypto.randomUUID();
  const ul = document.createElement("ul");
  li.append(ul);
  document.querySelector(`#${id} ul`).append(li);
}

function addFile(id, filename) {
  const li = document.createElement("li");
  li.className = "file";
  li.innerText = filename;
  li.id = "file" + crypto.randomUUID();
  document.querySelector(`#${id} ul`).append(li);
}

function deleteEntry(id) {
  document.getElementById(id).remove();
}

document
  .querySelector("#root-folder")
  .addEventListener("click", collapseFolder);

function collapseFolder(e) {
  const id = e.target.id;
  const currentFolder = document.getElementById(id);
  if (!id) {
    return;
  }
  const target = document.querySelector(`#${id} ul`);
  if (target.style.display !== "none") {
    target.style.display = "none";
    currentFolder.className = "folder";
  } else {
    target.style.display = "block";
    currentFolder.className = "open-folder";
  }
}
