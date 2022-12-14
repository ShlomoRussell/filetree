const textEditor = document.createElement("pre");

/**
 *
 * @param {string} filePath
 */
async function insertFiletoEditor(filePath) {
  try {
    const editorContainer = document.getElementById("text-editor-container");
    if (editorContainer.childElementCount > 0) {
      clearElementsChildren(editorContainer);
    }
    textEditor.contentEditable = true;
    textEditor.className = "h-100";
    const editorHeader = document.createElement("div");
    editorHeader.className = "d-flex justify-content-between";
    const p = document.createElement("p");
    p.innerText = filePath.includes("/")
      ? filePath.split("/").slice(-1)
      : filePath;
    const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.addEventListener("click", saveFileContents);
    btn.innerText = "Save";
    editorHeader.append(p, btn);

    editorContainer.append(editorHeader, textEditor);
    const fileContents = await getFileContents(filePath);
    textEditor.innerHTML = (await fileContents.text())
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    textEditor.dataset.path = filePath;
    textEditor.focus();
  } catch (error) {
    console.log(error);
  }
}

async function saveFileContents() {
  try {
    await addFileContents(
      textEditor.dataset.path,
      textEditor.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    );
  } catch (error) {}
}
