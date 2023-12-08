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
      background: #fff;
    }

    section {
      margin: 0px;
      padding: 0px;
      height: 100%;
      display: flex;
      overflow-x: auto;
      margin-top: 25px;
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
  }

  __subRoutes () {
    const route = this.url
    let component = ''

    this._headers.map (header => {
      if (header.route === route && header.component) {
        component = this.__pagesEnableToRender(header.component)
      }
    })

    return component
  }

  __pagesEnableToRender (component) {
    switch (component) {
      case 'km-professores-page':
        import ('./km-professores-page')
        return html `<km-professores-page></km-professores-page>`
        break
    }
  }
}
window.customElements.define('km-home-page', Home)
