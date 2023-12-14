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
    const token = this.getCookie('token')
    if (token) {
      this.session_data.token = token
    }
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

    if (this.url.includes('/km')) {
      import ('./km-home-page');
      component = html `<km-home-page .url=${this.url}></km-home-page>`
    }

    if (component === '') {
      console.log("404")
    }

    return component;
  }

  executeJob (method, urlLocation, timeout, body) {
    const url = this.urlHost + urlLocation
    return new Promise ((resolve, reject) => {

      var xhr = new XMLHttpRequest();
      xhr.timeout = timeout
      xhr.open(method, url);

      if (this.session_data.token !== undefined && this.session_data.token !== '') {
        xhr.setRequestHeader('Authorization', "Bearer " + this.session_data.token);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState > 2) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.response));
          } else {
            if (xhr.status === 405) {
              setTimeout(() => document.location.href = '/login', 1000)
            }

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

      if (method === 'POST' || method === 'PATCH') {
        if (body instanceof FormData) {
          xhr.send(body);
        } else {
          const json = JSON.stringify(body)
          xhr.send(json);
        }
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

  getCookie (cookie_name) {
    let name = cookie_name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  async validateSession () {
    try {
      if (this.session_data.token === undefined || this.session_data.token === '') {throw new Error ('You need to log in to the platform!')}

      const result = await this.executeJob('GET', '/auth/validation.php', 3000);

      this.session_data = {...this.session_data, ...result.body.user}
      return result.body.headers
    } catch (e) {
      this.openToast(e.message, 'error')
      await new Promise(resolve => setTimeout(resolve, 1000));
      document.location.href = '/login'
    }
  }
}

window.customElements.define('app-component', App)
