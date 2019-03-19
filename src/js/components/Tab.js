class Tab {
  constructor(name, content, i, onClick) {
    this.name = name;
    this.content = content;
    this.index = i;
    this.onClick = onClick;
    this.forAppBar = this.build('AppBar', i);
    this.forDrawer = this.build('Drawer', i);
  }

  deactivate() {
    this.forDrawer.classList.remove('Drawer-tabs-item--active');
    this.forAppBar.classList.remove('AppBar-tab--active');
  }

  activate() {
    this.forDrawer.classList.add('Drawer-tabs-item--active');
    this.forAppBar.classList.add('AppBar-tab--active');    
  }

  build(target, i) {
    const baseClass = target == 'AppBar' ? 'AppBar-tab' : 'Drawer-tabs-item';
    let div = document.createElement('div');
    div.classList.add(baseClass);
    i == 0 && div.classList.add(baseClass + '--active');
    div.setAttribute('data-to', this.name);
    div.innerText = this.name;
    div.addEventListener('click', () => this.onClick(this.index));
    return div;
  }
}



export default Tab;