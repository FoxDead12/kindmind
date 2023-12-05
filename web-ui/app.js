import { LitElement, css, html } from 'lit'
import './app-toast'
export class App extends LitElement {

  constructor() {
    super()
    window.app = this;
    this.url = window.location.pathname;
    this.urlHost = window.location.origin; // PROD
    this.urlHost = 'http://localhost:8000' // DEV
  }

  firstUpdated () {
    this.toast = this.shadowRoot.getElementById('toast')
  }

  render() {
    return html `
      <app-toast id="toast"></app-toast>
      ${this.__routeManager()}
    `
  }

  __routeManager () {
    let component = '';

    switch (this.url) {
      case '/':
        component = html ``
        break
      case '/login':
        import('./km-login-page')
        component = html `<app-login></app-login>`
        break;
      case '/register':
        import('./km-register-page')
        component = html `<app-register></app-register>`
        break;
    }

    return component;
  }

  executeJob (method, urlLocation, timeout, body) {
    const url = this.urlHost + urlLocation
    return new Promise ((resolve, reject) => {

      var xhr = new XMLHttpRequest();
      xhr.timeout = timeout
      xhr.open(method, url);

      if (method === 'POST') {
        // xhr.setRequestHeader("Content-Type", "application/json");
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(JSON.parse(xhr.response));
        }
      };

      xhr.onerror = function() {
        reject(new Error('Something goes wrong communicating with the server, try again later!'));
      };

      if (method === 'POST') {
        const json = JSON.stringify(body)
        xhr.send(json);
      } else {
        xhr.send();
      }
    })
  }

  openToast (message, type) {
    this.toast.open(message, type)
  }
}

window.customElements.define('app-component', App)
