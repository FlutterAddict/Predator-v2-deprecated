import AppBar from './AppBar/AppBar';
import Drawer from './Drawer/Drawer';
import Tab from './Tab/Tab';
import Content from './Content/Content';



class App {
  constructor(config) {
    this.tabs = [];
    this.appBar = new AppBar();
    this.drawer = new Drawer({
      contentLoader: (key) => this.content.load(key)
    });      
    this.content = new Content({ 
      onContentClick: () => this.drawer.visible = document.body.clientWidth > 920
    });
  
    this.init(config);
  }

  init(config) {
    this.appBar.titleText = config.title;
    config.hasOwnProperty('github') && this.appBar.addGithubRedirector(config.github);
    document.title = config.title;
    this.changeMetaTag('theme-color', config.themeColor);   
    this.injectTabs(config.tabs);
  }

  injectTabs(tabs) {
    Object.keys(tabs).forEach((key, i) => {
      let tab = new Tab(key, tabs[key], i, index => this.handleTabPress(index));
      this.tabs.push(tab);
      this.appBar.left.appendChild(tab.forAppBar);
      this.drawer.tabs.appendChild(tab.forDrawer);
    });
    this.handleTabPress(0);
  }

  handleTabPress(index) {
    this.tabs.forEach(tab => tab.deactivate());
    this.tabs[index].activate();
    this.drawer.clear();
    this.drawer.populate(this.tabs[index].content);
    this.drawer.activateFirst();
  }

  changeMetaTag(name, content) {
    document.querySelector(`meta[name="${name}"]`).setAttribute('content', content);
  }
}



export default App;