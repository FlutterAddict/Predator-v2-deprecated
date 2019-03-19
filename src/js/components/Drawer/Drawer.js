import Accordion from './Accordion';



class Drawer {
  constructor() {
    this.content = [];
    this.outer = document.querySelector('.js-drawer');
    this.inner = document.querySelector('.js-drawer-inner');
    this.toggler = document.querySelector('.js-burger');
    this.tabs = document.querySelector('.js-drawer-tabs');
    this.visible = document.body.clientWidth > 920;
    this.bindEventHandlers();
  }

  set visible(visibility) {
    this.outer.style.display = visibility ? 'block' : 'none';
  }

  bindEventHandlers() {
    window.addEventListener('resize', () => this.visible = document.body.clientWidth > 920);
    this.toggler.addEventListener('click', () => this.visible = this.outer.style.display == 'none');
  }

  populate(content) {
    // Top-level of tab's content is always an object, where Predator transforms each key into an accordion.
    this.inner.innerHTML = '';
    this.content = Object.keys(content).map(key => new Accordion(key, content[key], 1));
    this.content.forEach(item => this.inner.appendChild(item.element.accordion));
  }
}



export default Drawer;