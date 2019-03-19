class Accordion {
  constructor(name, content, nestLevel) {
    this.availableTags = ['app', 'game', 'program'];

    // name is a key of one of the top-level objects for neccessary top-level accordions
    // content is a value of this key and it can be either next object for nested accordion
    // or it can be an array with items to fill the accordion with 
    this.name = name;   
    this.content = content;
    this.nestLevel = nestLevel;

    // either way, we need to build the accordion head and empty body first:
    this.element = this.build(); // element.body for injecting items, element.accordion for appending it

    // figure out if the content is an object or array now
    if (Array.isArray(this.content)) {
      this.fillWithItems();
    } else {
      this.fillWithNestedAccordions();
    }
  }

  // 1. Do this fully dynamic
  // 2. use build() method for nested accordions. You'll need to pass parameters for that. instead of getting values from props.
  // 3. Make AccordionItem class
  // 4. Tooltip lib

  build() {
    let accordion = document.createElement('div');
    accordion.classList.add('Accordion');
    let head = document.createElement('div');
    head.classList.add('Accordion-head', `Accordion-head--${this.nestLevel}`);
    head.addEventListener('click', this.handleClick);
    let body = document.createElement('div');
    body.classList.add('Accordion-body');
    accordion.appendChild(head);
    accordion.appendChild(body);
    head.innerText = this.name;
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

  fillWithItems() {
    this.content.forEach(item => {
      let div = document.createElement('div');
      div.classList.add('Drawer-item', `Accordion-child-${this.nestLevel}`, 'js-drawer-item');
      if (item.active) { div.classList.add('Drawer-item--active'); };
      div.setAttribute('data-content-key', item.key);
      div.innerText = `• ${item.label}`;
      if (item.tags) {
        item.tags.forEach(tagName => {
          if (this.tagsAvailable.indexOf(tagName) >= 0) {
            let tag = document.createElement('div');
            tag.classList.add('Tag', `Tag--${tagName}`);
            tag.innerText = tagName;
            div.appendChild(tag);
          }
        });
      }
      // div.addEventListener('click', () => onDrawerItemClick(div));
      this.element.body.appendChild(div); 
    });
  }

  fillWithNestedAccordions() {
    Object.keys(this.content).forEach(key => {

    });
  }
}



export default Accordion;