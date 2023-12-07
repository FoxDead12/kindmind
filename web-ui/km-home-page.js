import { LitElement, css, html } from 'lit'
import './km-header-dashboard'

export class Home extends LitElement {

  static properties = {
    url: {type: String },
    loading: { type: Boolean }
  }

  static styles = css `
    :host {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    section {
      width: 800px;
      margin: 0px auto;
    }
  `

  constructor () {
    super ();
    this.loading = true;
    this._load()
  }

  render () {
    if (this.loading === true) return;

    return html `
      <km-header-dashboard .navigation=${this._headers}></km-header-dashboard>
      <section id="section">
        ${this.__subRoutes()}
      </section>
    `
  }

  async _load () {
    app.openLoader('Validating your session!');
    const sessionData = await app.validateSession();
    this._headers = sessionData
    app.closeLoader();
    this.loading = false;

    // Render item route

  }

  __subRoutes () {
    const route = this.url
    let component = ''

    this._headers.map (header => {
      if (header.route === route && header.component) {
        import ('./' + header.component + '.js')
        const element = document.createElement(header.component)
        component = element
        component = html `${component}`
      }
    })

    return component
  }
}
window.customElements.define('km-home-page', Home)
