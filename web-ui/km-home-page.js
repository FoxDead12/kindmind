import { LitElement, css, html } from 'lit'

export class Home extends LitElement {

  static properties = {
    loading: { type: Boolean }
  }

  constructor () {
    super ();
    this.loading = true;

    app.validateSession()
  }


  render () {

    if (this.loading === true) return;
    return html `
    `
  }


}
window.customElements.define('km-home-page', Home)
