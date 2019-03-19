import AppBar from './AppBar';
import Drawer from './Drawer/Drawer';
import Tab from './Tab';
import Content from './Content';



class App {
  constructor(config) {
    this.appBar = new AppBar();
    this.drawer = new Drawer();
    this.content = new Content({ 
      onContentClick: () => this.drawer.visible = document.body.clientWidth > 920
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
    this.drawer.populate(this.tabs[0].content)
  }

  handleTabPress(index) {
    this.tabs.forEach(tab => tab.deactivate());
    this.tabs[index].activate();
    this.drawer.populate(this.tabs[index].content);
  }

  changeMeta(name, content) {
    document.querySelector(`meta[name="${name}"]`).setAttribute('content', content);
  }
}



export default App;