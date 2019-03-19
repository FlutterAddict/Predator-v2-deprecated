import getJSON from './ajax/getJSON';
import App from './components/App';



getJSON('predator.json', config => new App(config));