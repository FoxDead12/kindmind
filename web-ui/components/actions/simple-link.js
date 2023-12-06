import { LitElement, css, html } from 'lit'

export class SimpleLink extends LitElement {

  static properties = {
    href: { type: String }
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
      color: #333;
    }

    span:hover {
      color: var(--color-blue);
      border-bottom: 1px solid var(--color-blue);
    }

    .link {
      font-family: 'Nunito', sans-serif;
      color: #333;
      font-size: 0.9rem;
      text-align: center;
      border-bottom: 1px solid black;
      margin: 0px auto;
      letter-spacing: 0.5px;
      cursor: pointer;
    }

    .link:hover {
      color: var(--color-blue);
      border-bottom: 1px solid var(--color-blue);
    }
  `

  render() {
    return html`
      <span @click=${this.__changeUrl} class="link">${this.innerHTML}</span>
    `
  }

  __changeUrl () {
    app.changeRoute(this.href);
  }
}

window.customElements.define('simple-link', SimpleLink)
