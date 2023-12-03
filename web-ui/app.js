import { LitElement, css, html } from 'lit'
export class App extends LitElement {

  constructor() {
    super()
    this.url = window.location.pathname;
  }

  render() {
    return this.__routeManager()
  }

  __routeManager () {

    switch (this.url) {
      case '/':
        return html ``
        break
      case '/login':
        import('./km-login-page')
        return html `<app-login></app-login>`
        break;
    }
  }
}

window.customElements.define('app-component', App)
