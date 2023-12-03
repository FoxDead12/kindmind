import { LitElement, css, html } from 'lit'

export class SimpleLink extends LitElement {

  static properties = {
    type: { type: String },
    placeholder: { type: String },
    required: { type: Boolean }
  }

  constructor() {
    super()
  }

  static styles = css `
    span {
      font-family: 'Nunito', sans-serif;
      font-size: 1rem;
      cursor: pointer;
      margin: 0px;
      padding: 0px;
      text-transform: underline;
      border-bottom: 1px solid;
      -webkit-transition: color 300ms ease-out;
      -moz-transition: color 300ms ease-out;
      -o-transition: color 300ms ease-out;
      transition: color 300ms ease-out;
      color: var(--color-black);
    }

    span:hover {
      color: var(--color-blue);
      border-bottom: 1px solid var(--color-blue);
    }
  `

  render() {
    return html`
      <span @click=${this.__changeUrl}>${this.innerHTML}</span>
    `
  }

  __changeUrl () {
    // TODO
    console.log("change url")
  }
}

window.customElements.define('simple-link', SimpleLink)
