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



export default Content;