import AppBar from './AppBar/AppBar';
import Drawer from './Drawer/Drawer';
import Tab from './Tab/Tab';
import Content from './Content/Content';



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



export default App;