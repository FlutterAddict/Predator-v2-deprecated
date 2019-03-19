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



export default AppBar;