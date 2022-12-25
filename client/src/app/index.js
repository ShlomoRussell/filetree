import "../styles.css";
import {
  filesContainerRghtClickHandler,
  handleBodyClick,
  renderExistingDirectory,
} from "./filetree";

function createInfoText() {
  const p = document.createElement("p");
  p.className = "mx-auto";
  p.style.width = "fit-content";
  p.innerText = "Right click on a file or folder to add or remove!";
  return p;
}

function createRootContainer() {
  const container = document.createElement("div");
  container.className = "container";
  container.style.height = "90%";
  container.appendChild(createMainRow());
  return container;
}

function createMainRow() {
  const row = document.createElement("div");
  row.className = "row h-100 p-0";
  row.append(createFileExplorerContainer(), createTextEditorContainer());
  renderExistingDirectory();
  return row;
}

function createFileExplorerContainer() {
  const rootFolderContainer = document.createElement("div");
  rootFolderContainer.id = "root-folder-container";
  rootFolderContainer.className = "col-3 h-100";
  rootFolderContainer.style.maxWidth = "25%";
  rootFolderContainer.addEventListener(
    "contextmenu",
    filesContainerRghtClickHandler
  );
  rootFolderContainer.append(createFileButtons(), createRootFolder());
  return rootFolderContainer;
}
function createFileButtons() {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "d-flex justify-content-end";
  const buttonOptions = [
    {
      id: "add-file",
      title: "New File",
    },
    {
      id: "add-folder",
      title: "New Folder",

      alt: "add folder",
    },
    {
      id: "refresh-explorer",
      title: "Refresh Explorer",
    },
    {
      id: "collapse-folders",
      title: "Collapse Folders in Explorer",
    },
  ];
  buttonOptions.forEach((btn) => {
    const button = document.createElement("button");
    button.id = btn.id;
    button.className = "btn m-1 p-0";
    button.title = btn.title;
    buttonContainer.append(button);
  });
  return buttonContainer;
}

function createRootFolder() {
  const rootFolder = document.createElement("ul");
  rootFolder.id = "root-folder";
  const ul = document.createElement("ul");
  ul.className = "folder";
  rootFolder.appendChild(ul);
  return rootFolder;
}

function createTextEditorContainer() {
  const textEditorContainer = document.createElement("div");
  textEditorContainer.className = "col  mb-3";
  textEditorContainer.id = "text-editor-container";
  return textEditorContainer;
}

window.onload = function () {
  const root = document.getElementById("root");
  root.append(createInfoText(), createRootContainer());
  root.onclick = handleBodyClick;
};
