const editorContainer = document.getElementById("text-editor-container");
const textEditor = document.createElement("pre");
textEditor.contentEditable = true;
textEditor.className = "h-50";
const editorHeader = document.createElement("div");
editorHeader.className = "d-flex justify-content-between mb-3";
const p = document.createElement("p");
const runBtn = document.createElement("button");
runBtn.className = "btn btn-secondary";
runBtn.addEventListener("click", runTerminal, { capture: true });
runBtn.innerText = "Run ❯";
const saveBtn = document.createElement("button");
saveBtn.className = "btn btn-primary";
saveBtn.addEventListener("click", saveFileContents, { capture: true });
saveBtn.innerText = "Save";
editorHeader.append(runBtn, p, saveBtn);

/**
 *
 * @param {string} filePath
 */
async function insertFiletoEditor(filePath) {
  const filename = filePath.includes("/")
    ? filePath.split("/").slice(-1).join()
    : filePath;
  if (p.innerText === filename) {
    return;
  }
  try {
    clearElementsChildren(editorContainer);
    if (textEditor && editorHeader) {
      clearElementsChildren(textEditor);
    }
    p.innerText = filename;
    const fileContents = await getFileContents(filePath).then(async (res) => {
      const string = await res.text();
      const lines = string.split("\n");
      lines.forEach((line) => {
        const div = document.createElement('div');
        div.innerText = line;
        textEditor.append(div);
      });
      return string;
    });

    textEditor.dataset.path = filePath;
    editorContainer.append(editorHeader, textEditor);
    openTerminal(filename, fileContents);
    textEditor.focus();
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
  editorContainer.append(terminal);
}

function runTerminal() {
  if (terminal.tagName === "DIV") {
    terminal.innerText =
      JSON.stringify(eval(textEditor.innerText.replace(/console.log/g, ""))) ||
      null;
  } else {
    terminal.srcdoc = textEditor.innerText;
  }
}

async function saveFileContents() {
  try {
    await addFileContents(
      textEditor.dataset.path,
      textEditor.innerText.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    );
  } catch (error) {
    console.log(error);
  }
}

textEditor.addEventListener('keyup', function (e) {
 
})