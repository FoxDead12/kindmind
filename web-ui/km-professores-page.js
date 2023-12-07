import { LitElement, css, html } from 'lit'

export class Professores extends LitElement {

  static properties = {
  }

  static styles = css `

  `

  constructor () {
    super ();

  }

  render () {
    return html `
    PAGINA DE Professores
    `
  }


}
window.customElements.define('km-professores-page', Professores)
