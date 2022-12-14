function clearElementsChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}
