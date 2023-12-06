import { LitElement, css, html } from 'lit'
import './app-toast'
import './app-loader'
export class App extends LitElement {

  static properties = {
    url: { type: String }
  }

  constructor() {
    super()
    window.app = this;
    this.url = window.location.pathname;
    this.urlHost = window.location.origin; // PROD
    this.urlHost = 'http://localhost:8000' // DEV

    this.session_data = {}
  }

  firstUpdated () {
    this.toast = this.shadowRoot.getElementById('toast')
    this.loader = this.shadowRoot.getElementById('loader')

    window.addEventListener("popstate", function (event) {
      app.url = window.location.pathname;
    });
  }

  render() {
    return html `
      <app-loader id="loader"></app-loader>
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
      case '/activate':
        import ('./km-activate-page');
        component = html `<km-activate-page></km-activate-page>`
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

      xhr.onreadystatechange = () => {
        if (xhr.readyState > 2) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(JSON.parse(xhr.response));
          }
        }
      }

      xhr.onerror = function() {
        reject(new Error('Something goes wrong communicating with the server, try again later!'));
      };

      xhr.ontimeout = (e) => {
        reject(new Error('The task took longer than expected, please try again!'));
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

  openLoader (message) {
    this.loader.open (message);
  }

  closeLoader () {
    this.loader.close ();
  }

  changeRoute (to) {
    this.url = to;
    window.history.pushState("", "", to)
  }

  setTokenCookie (token) {
    var d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = "token=" + token + ";" + expires + ";path=/";
  }
}

window.customElements.define('app-component', App)
