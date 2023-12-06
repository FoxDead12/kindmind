import { LitElement, css, html } from 'lit'

export class Home extends LitElement {

  static properties = {
    loading: { type: Boolean }
  }

  constructor () {
    super ();
    this.loading = true;
    this._load()
  }

  render () {
    if (this.loading === true) return;

    return html `
      loaded
    `
  }

  async _load () {
    app.openLoader('Validating your session!');
    await app.validateSession();
    app.closeLoader();
    this.loading = false;
  }
}
window.customElements.define('km-home-page', Home)
