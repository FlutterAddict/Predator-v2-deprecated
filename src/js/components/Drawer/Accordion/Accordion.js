import Item from './Item';



class Accordion {
  constructor({ name, content, itemClickHandler, nestLevel }) {
    this.items = [];
    this.nestedAccordions = [];
    this.element = this.build(name, nestLevel);
    if (Array.isArray(content)) {
      this.fillWithItems(content, itemClickHandler, nestLevel);
    } else {
      this.fillWithNestedAccordions(content, itemClickHandler);
    }
  }

  build(name, nestLevel) {
    let accordion = document.createElement('div');
    accordion.classList.add('Accordion');
    let head = document.createElement('div');
    head.classList.add('Accordion-head', `Accordion-head--${nestLevel}`);
    head.addEventListener('click', this.handleClick);
    let body = document.createElement('div');
    body.classList.add('Accordion-body');
    accordion.appendChild(head);
    accordion.appendChild(body);
    head.innerText = name;
    let icon = document.createElement('ion-icon');
    icon.classList.add('js-drop-icon');
    icon.setAttribute('name', 'arrow-dropup');
    head.appendChild(icon);
    return { accordion, body };
  }

  handleClick(e) {
    let head = e.path.find(el => el.classList && el.classList.contains('Accordion-head'));
    let body = head.parentElement.querySelector('.Accordion-body');
    let icon = head.querySelector('.js-drop-icon');
    const expanded = icon.getAttribute('name') == 'arrow-dropup';
    const iconName = expanded ? 'arrow-dropdown' : 'arrow-dropup';
    const display = expanded ? 'none' : 'block';
    icon.setAttribute('name', iconName);
    body.style.display = display;
  }

  fillWithItems(content, handleClick, nestLevel) {
    this.items = content.map(item => new Item(item, nestLevel, (itm) => handleClick(itm)));
    this.items.forEach(item => this.element.body.appendChild(item.element));
  }
  
  fillWithNestedAccordions(content, handleClick) {
    this.nestedAccordions = Object.keys(content).map(
      key => new Accordion({
        name: key,
        content: content[key],
        itemClickHandler: handleClick,
        nestLevel: 2
      })
    );
    this.nestedAccordions.forEach(acc => this.element.body.appendChild(acc.element.accordion));
  }
}



export default Accordion;