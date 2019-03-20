class Item {
  constructor(item, nestLevel, handleClick) {
    this.availableTags = ['app', 'game', 'program'];
    this.element = this.build(item, nestLevel, handleClick);
  }

  build(item, nestLevel, handleClick) {
    let div = document.createElement('div');
    div.classList.add('Drawer-item', `Accordion-child-${nestLevel}`, 'js-drawer-item');
    item.active && div.classList.add('Drawer-item--active');
    div.setAttribute('data-content-key', item.path);
    div.innerText = `• ${item.label}`;
    if (item.tags) {
      item.tags.forEach(tagName => {
        if (this.availableTags.indexOf(tagName) >= 0) {
          let tag = document.createElement('div');
          tag.classList.add('Tag', `Tag--${tagName}`);
          tag.innerText = tagName;
          div.appendChild(tag);
        }
      });
    }
    div.addEventListener('click', () => handleClick(div));
    return div;
  }
}



export default Item;