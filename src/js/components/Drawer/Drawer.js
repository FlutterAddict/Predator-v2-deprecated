import Accordion from './Accordion/Accordion';



class Drawer {
  constructor(config) {
    this.loadContent = config.contentLoader;
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
    this.inner.innerHTML = '';
    this.content = Object.keys(content).map(
      key => new Accordion(key, content[key], (itemElement) => this.handleItemClick(itemElement), 1)
    );
    this.content.forEach(item => this.inner.appendChild(item.element.accordion));
  }

  handleItemClick(itemElement) {
    this.content.forEach(item => {
      item.items.forEach(itm => itm.element.classList.remove('Drawer-item--active'));
      item.nestedAccordions.forEach(acc => acc.items.forEach(i => i.element.classList.remove('Drawer-item--active')));
    });
    itemElement.classList.add('Drawer-item--active');
    this.loadContent(itemElement.dataset.contentKey);
  }
}



export default Drawer;