import { LitElement, css, html } from 'lit'
import './app-toast'
import './app-loader'
export class App extends LitElement {

  static properties = {
    url: { type: String },
    currentPage: { type: LitElement }
  }

  static styles = css `
    :host {
      position: relative;
      display: block;
      margin: 0px;
      padding: 0px;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
    }
  `

  constructor() {
    super()
    window.app = this;
    this.url = window.location.pathname;
    this.urlHost = window.location.origin; // PROD
    this.urlHost = 'http://localhost:8000' // DEV

    this.urlWebsocket = `ws://${window.location.host}`// PROD
    this.urlWebsocket = "ws://localhost:8001" // DEV

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
        // import ('./km-welcome-page')
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

      await this.websocketConnection ()
      return result.body.headers
    } catch (e) {
      this.openToast(e.message, 'error')
      await new Promise(resolve => setTimeout(resolve, 1000));
      document.location.href = '/login'
    }
  }

  async websocketConnection () {
    this.socket = new WebSocket(this.urlWebsocket)

    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", (event) => {
        const body = {
          type: 'session',
          token: this.session_data.token
        }
        this.socket.send(JSON.stringify(body))
      });

      this.socket.addEventListener("error", (event) => {
        const body = {
          message: 'Unable to connect to the server'
        }
        return reject (body)
      });


      this.socket.addEventListener ("message", (e) => {
        const body = JSON.parse(e.data)

        if (body.code === 405) {
          return reject (body)
        }

        resolve()
      })
    })

    this.socket.addEventListener ("message", (e) => {
      this.receiveMessage(JSON.parse(e.data))
    })
  }

  sendWebsocketMessage (body, type) {
    body.type = type
    this.socket.send(JSON.stringify(body))
  }

  receiveMessage (body) {
    switch (body.type) {
      case 'message-received':
        // DO SOME NOTIFICATION
        if (this.currentPage?.updateMessage) {
          this.currentPage?.updateMessage (body)
        }

        this.openToast ('Just received a new message!', 'info')
        break;
      case 'message-send':
        this.currentPage?.updateMessage (body)
        if (body.code === 400) {
          app.openToast(body.message, 'error')
        }
        break;
    }
  }
}

window.customElements.define('app-component', App)
