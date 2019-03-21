import Accordion from './Accordion/Accordion';



class Drawer {
  constructor(config) {
    this.getDOM();
    this.bindEventHandlers();
    this.content = [];
    this.loadContent = config.contentLoader;
    this.visible = document.body.clientWidth > 920;
  }

  set visible(visibility) {
    this.outer.style.display = visibility ? 'block' : 'none';
  }  

  getDOM() {
    this.outer = document.querySelector('.js-drawer');
    this.inner = document.querySelector('.js-drawer-inner');
    this.toggler = document.querySelector('.js-burger');
    this.tabs = document.querySelector('.js-drawer-tabs');    
  }

  bindEventHandlers() {
    window.addEventListener('resize', () => this.visible = document.body.clientWidth > 920);
    this.toggler.addEventListener('click', () => this.visible = this.outer.style.display == 'none');
  }

  populate(content) {
    this.content = Object.keys(content).map(
      key => new Accordion({
        name: key,
        content: content[key],
        itemClickHandler: itemElement => this.handleItemClick(itemElement),
        nestLevel: 1
      })
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
    if (firstAccordion.items.length) { // firstAccordion.containsItems
      this.activateItem(firstAccordion.items[0].element); 
      this.loadContent(firstAccordion.items[0].element.dataset.contentKey);
    } else if (firstAccordion.nestedAccordions.length) { // firstAccordion.containsAccordions
      this.activateItem(firstAccordion.nestedAccordions[0].items[0].element);
      this.loadContent(firstAccordion.nestedAccordions[0].items[0].element.dataset.contentKey);
    }
  }

  clear() {
    this.inner.innerHTML = '';
  }
}



export default Drawer;