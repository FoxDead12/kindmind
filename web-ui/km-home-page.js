import { LitElement, css, html } from 'lit'
import './km-header-dashboard'

export class Home extends LitElement {

  static properties = {
    url: {type: String },
    loading: { type: Boolean }
  }

  static styles = css `
    :host {
      position: relative;
      display: grid;
      width: 100%;
      height: 100%;
      grid-template-rows: 56px auto;
      grid-template-columns: 100vw;
      background: #fff;
      overflow-x: hidden;
    }

    section {
      position: relative;
      margin: 0px;
      padding: 0px;
      display: block;
      overflow: auto;
      padding: 25px 0px;
      background: rgba(69, 123, 157, 0.06);
    }
  `

  constructor () {
    super ();
    this.loading = true;
    this._load()
  }

  updated () {
    if (this.shadowRoot.getElementById('section')) {
      app.currentPage = this.shadowRoot.getElementById('section').children[0]
    }
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

    // GET HEADERS ROUTES
    this._headers.map (header => {
      if (header.route === route && header.component) {
        component = this.__pagesEnableToRender(header.component)
      }
    })

    if (component) return component;

    // SET OTHER ROUTES
    if (route.includes('km/professores/')) {
      import ('./km-professor-page.js');
      const id = Number(route.split('/').slice(-1));
      component =  html `<km-professor-page id=${id}></km-professor-page>`
    }

    return component
  }

  __pagesEnableToRender (component) {
    switch (component) {
      case 'km-professores-page':
        import ('./km-professores-page')
        return html `<km-professores-page></km-professores-page>`
      case 'km-profile-page':
        import ('./km-profile-page.js');
        return html `<km-profile-page></km-profile-page>`
      case 'km-proposals-page':
        import ('./km-proposals-page.js');
        return html `<km-proposals-page></km-proposals-page>`
      case 'km-contracts-page':
        import ('./km-contracts-page.js');
        return html `<km-contracts-page></km-contracts-page>`
    }
  }
}
window.customElements.define('km-home-page', Home)
