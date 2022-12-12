const files = document.getElementById("root-folder-container");
const contextMenu = document.createElement("div");
contextMenu.id = "context-menu";
const form = document.forms[0];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!this[0].value) {
    return;
  }
  if (this[0].name === "filename") {
    addFile(this[0].dataset.id, this[0].value);
  } else {
    addFolder(this[0].dataset.id, this[0].value);
  }
  hideForm();
});

const showForm = () => (form.style.visibility = "visible");
const hideForm = () => {
  form.style.visibility = "hidden";
  form.reset();
};

files.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  const { clientX, clientY } = e;

  if (e.target.className === "folder") {
    folderContextMenu(e.target.id, clientX, clientY);
  }
  if (e.target.className === "file") {
    fileContextMenu(e.target.id, clientX, clientY);
  }
});

function folderContextMenu(id, x, y) {
  if (!contextMenu.childElementCount) {
    form[0].dataset.id = id;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    const newFile = document.createElement("div");
    newFile.innerText = "New File";
    newFile.addEventListener("click", (e) => {
      form[0].name = "filename";
      showForm();
    });
    const newFolder = document.createElement("div");
    newFolder.innerText = "New Folder";
    newFolder.addEventListener("click", (e) => {
      form[0].name = "folder-name";
      showForm();
    });
    const deleteFolder = document.createElement("div");
    deleteFolder.innerText = "Delete";
    deleteFolder.addEventListener("click", (e) => deleteEntry(id));

    contextMenu.append(newFile, newFolder);
    if (id !== "root-folder") {
      contextMenu.append(deleteFolder);
    }
    contextMenu
      .querySelectorAll("div")
      .forEach((el) => (el.className = "item"));
    document.getElementById(id).append(contextMenu);
  }
}

function fileContextMenu(id, x, y) {
  if (!contextMenu.childElementCount) {
    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    const deleteFile = document.createElement("div");
    deleteFile.innerText = "Delete";
    deleteFile.addEventListener("click", (e) => deleteEntry(id));
    contextMenu.append(deleteFile);
    contextMenu
      .querySelectorAll("div")
      .forEach((el) => (el.className = "item"));
    document.getElementById(id).append(contextMenu);
  }
}

document.querySelector("body").addEventListener("click", hideContextMenu);
document.querySelector("body").addEventListener("contextmenu", hideContextMenu);

function hideContextMenu(e) {
  if (e.target.className !== "file" && e.target.className !== "folder") {
    while (contextMenu.firstChild) {
      contextMenu.removeChild(contextMenu.lastChild);
    }
    contextMenu.remove();
  }
}

function addFolder(id, folderName) {
  const li = document.createElement("li");
  li.innerText = folderName;
  li.className = "folder";
  li.id = "folder" + crypto.randomUUID();
  const ul = document.createElement("ul");
  ul.addEventListener("click", collapseFolder);
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

document.querySelector(".folder").addEventListener("click", collapseFolder);

function collapseFolder(e) {
  const target = document.querySelector(`#${e.target.id} ul`);
  if (target && target.style.display !== "none") {
    target.style.display = "none";
  } else target.style.display = "block";
}
