/**
 *
 * @param {HTMLElement} element
 */
export function clearElementsChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}
