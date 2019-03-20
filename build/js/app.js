(function () {
  'use strict';

  function getJSON(path, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          callback(JSON.parse(request.responseText));
        }    }  };
    request.open('GET', path);
    request.send();  
  }

  class AppBar {
    constructor() {
      this.left = document.querySelector('.js-appbar-left');
      this.right = document.querySelector('.js-appbar-right');
      this.title = this.left.querySelector('.js-appbar-title');
    }

    set titleText(title) {
      this.title.innerText = title;
    }

    addGithubRedirector(link) {
      let div = document.createElement('div');
      div.classList.add('AppBar-item');
      div.setAttribute('tooltip', 'GitHub Page');
      div.setAttribute('tooltip-position', 'bottom');
      let icon = document.createElement('ion-icon');
      icon.setAttribute('name', 'logo-github');
      icon.setAttribute('size', 'large');
      div.appendChild(icon);
      div.addEventListener('click', () => window.location.href = link);
      this.right.appendChild(div);
    }
  }

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

  class Accordion {
    constructor(name, content, handleClick, nestLevel) {
      this.items = [];
      this.nestedAccordions = [];
      this.element = this.build(name, nestLevel);
      if (Array.isArray(content)) {
        this.fillWithItems(content, handleClick, nestLevel);
      } else {
        this.fillWithNestedAccordions(content, handleClick);
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
      this.nestedAccordions = Object.keys(content).map(key => new Accordion(key, content[key], handleClick, 2));
      this.nestedAccordions.forEach(acc => this.element.body.appendChild(acc.element.accordion));
    }
  }

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

  const getHTML = (key, target, placeholderHTML='', callback) => {
    target.innerHTML = placeholderHTML;
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          target.innerHTML = request.responseText;
          if (callback) {
            callback();
          }      }    }  };
    request.open('GET', key);
    request.send();
  };

  class Content {
    constructor(config) {
      this.onContentClick = config.onContentClick;
      this.theme = 0;
      this.themes = [
        ['#0F111A','#FAFAFA', '#BBBBBB'],
        ['#17181C','#FFFFFF', '#DDDDDD'],
      ];
      this.container = document.querySelector('.js-content-container');
      this.parent = document.querySelector('.js-content-parent');
      this.bindEventHandlers();
    }

    load(key) {
      getHTML(`docs/${key}.html`, this.container, '', () => {
        Prism.highlightAll();
        // setParagraphsColor();
      });
    }

    bindEventHandlers() {
      this.parent.addEventListener('click', this.onContentClick);
    }

    toggleTheme() {
      this.theme += 1;
      this.theme = this.theme == this.themes.length ? 0 : this.theme;
      this.parent.style.background = this.themes[this.theme][0];
      this.parent.style.color = this.themes[this.theme][1];
      this.setParagraphsColor();
    }

    setParagraphsColor() {
      let paragraphs = document.querySelectorAll('p');
      paragraphs.forEach(p => p.style.color = this.themes[this.theme][2]);
    }
  }

  class App {
    constructor(config) {
      this.appBar = new AppBar();
      this.content = new Content({ 
        onContentClick: () => this.drawer.visible = document.body.clientWidth > 920
      });
      this.drawer = new Drawer({
        contentLoader: (key) => this.content.load(key)
      });    
      this.tabs = [];
      this.init(config);
    }

    init(config) {
      this.appBar.titleText = config.title;
      config.hasOwnProperty('github') && this.appBar.addGithubRedirector(config.github);
      document.title = config.title;
      this.changeMeta('theme-color', config.themeColor);   
      this.injectTabs(config.tabs);
    }

    injectTabs(tabs) {
      Object.keys(tabs).forEach((key, i) => {
        let tab = new Tab(key, tabs[key], i, index => this.handleTabPress(index));
        this.tabs.push(tab);
        this.appBar.left.appendChild(tab.forAppBar);
        this.drawer.tabs.appendChild(tab.forDrawer);
      });
      this.handleTabPress(1);
    }

    handleTabPress(index) {
      this.tabs.forEach(tab => tab.deactivate());
      this.tabs[index].activate();
      let content = this.tabs[index].content;
      this.drawer.populate(this.tabs[index].content);

      // load first drawer item
      let firstAccordionContent = content[Object.keys(content)[0]];
      let firstItem = Array.isArray(firstAccordionContent) ? 
        firstAccordionContent[0] : 
        firstAccordionContent[Object.keys(firstAccordionContent)[0]][0];
      this.content.load(firstItem.path);

      // make first drawer item active
      console.log(this.drawer.content[0]);
      if (this.drawer.content[0].items.length > 0) {
        this.drawer.content[0].items[0].element.classList.add('Drawer-item--active');
      } else {
        this.drawer.content[0].nestedAccordions[0].items[0].element.classList.add('Drawer-item--active');
      }
    }

    changeMeta(name, content) {
      document.querySelector(`meta[name="${name}"]`).setAttribute('content', content);
    }
  }

  getJSON('predator.json', config => new App(config));

}());
//# sourceMappingURL=app.js.map
