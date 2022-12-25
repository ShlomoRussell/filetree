import { addFileContents, getFileContents } from "./fetch.js";
import { clearElementsChildren } from "./util.js";

const textEditorElement = document.createElement("pre");
textEditorElement.contentEditable = true;
textEditorElement.className = "h-50";
const editorHeaderElement = document.createElement("div");
editorHeaderElement.className = "d-flex justify-content-between mb-3";
const filenameElement = document.createElement("p");
const runButtonElement = document.createElement("button");
runButtonElement.className = "btn btn-secondary";
runButtonElement.addEventListener("click", runTerminal, { capture: true });
runButtonElement.innerText = "Run ❯";
const saveButtonElement = document.createElement("button");
saveButtonElement.className = "btn btn-primary";
saveButtonElement.addEventListener("click", saveFileContents, {
  capture: true,
});
saveButtonElement.innerText = "Save";
editorHeaderElement.append(
  runButtonElement,
  filenameElement,
  saveButtonElement
);

/**
 *
 * @param {string} filePath
 */
export async function insertFiletoEditor(filePath) {
  const editorContainerElement = document.getElementById(
    "text-editor-container"
  );

  const filename = filePath.includes("/")
    ? filePath.split("/").slice(-1).join()
    : filePath;
  if (filenameElement.innerText === filename) {
    return;
  }
  try {
    clearElementsChildren(editorContainerElement);
    if (textEditorElement && editorHeaderElement) {
      clearElementsChildren(textEditorElement);
    }
    filenameElement.innerText = filename;
    const fileContents = await getFileContents(filePath).then(async (res) => {
      const string = await res.text();
      const lines = string.split("\n");
      lines.forEach((line) => {
        const div = document.createElement("div");
        div.innerText = line;
        textEditorElement.append(div);
      });
      return string;
    });

    textEditorElement.dataset.path = filePath;
    editorContainerElement.append(editorHeaderElement, textEditorElement);
    openTerminal(filename, fileContents);
    textEditorElement.focus();
  } catch (error) {
    console.log(error);
  }
}

/**
 * @type {HTMLDivElement | HTMLIFrameElement}
 */
let terminal;
/**
 *
 * @param {string} filename
 * @param {string} fileContents
 */
async function openTerminal(filename, fileContents) {
  if (terminal) {
    clearElementsChildren(terminal);
  }
  if (filename.split(".")[1] === "js") {
    terminal = document.createElement("div");
    terminal.className = "terminal h-50 w-100";
    runTerminal();
  } else {
    terminal = document.createElement("iframe");
    terminal.srcdoc = fileContents;
    terminal.style.display = "block";
    terminal.className = "terminal h-50 w-100";
  }
  document.getElementById("text-editor-container").append(terminal);
}

function runTerminal() {
  if (terminal.tagName === "DIV") {
    terminal.innerText =
      JSON.stringify(
        eval(textEditorElement.innerText.replace(/console.log/g, ""))
      ) || null;
  } else {
    terminal.srcdoc = textEditorElement.innerText;
  }
}

async function saveFileContents() {
  try {
    await addFileContents(
      textEditorElement.dataset.path,
      textEditorElement.innerText.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    );
  } catch (error) {
    console.log(error);
  }
}

textEditorElement.addEventListener("keyup", function (e) {});
