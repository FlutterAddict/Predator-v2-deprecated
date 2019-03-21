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
    this.deactivateAllItems();
    this.activateItem(itemElement);
    this.loadContent(itemElement.dataset.contentKey);
  }

  deactivateAllItems() {
    this.content.forEach(item => {
      item.items.forEach(itm => this.deactivateItem(itm.element));
      item.nestedAccordions.forEach(acc => acc.items.forEach(i => this.deactivateItem(i.element)));
    });
  }

  activateItem(item) {
    item.classList.add('Drawer-item--active');
  }

  deactivateItem(item) {
    item.classList.remove('Drawer-item--active');
  }

  activateFirst() {
    let firstAccordion = this.content[0];
    if (firstAccordion.items.length) {
      let firstItem = firstAccordion.items[0];
      firstItem.element.classList.add('Drawer-item--active');
      this.loadContent(firstItem.element.dataset.contentKey);
    } else if (firstAccordion.nestedAccordions) {
      let firstItem = firstAccordion.nestedAccordions[0].items[0];
      firstItem.element.classList.add('Drawer-item--active');
      this.loadContent(firstItem.element.dataset.contentKey);
    }
  }
}



export default Drawer;