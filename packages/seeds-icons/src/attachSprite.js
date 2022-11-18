export function attachSprite(sprite) {
  if (typeof document !== 'undefined') {
    var body = document && document.querySelector('body');
    var element = document.createElement('div');
    element.innerHTML = sprite;
    var container = document.createElement('div');
    container.style = 'width: 0; height: 0; overflow: hidden;';
    container.append(element.firstChild);
    body.appendChild(container);
  }
}
