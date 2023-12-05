import { LitElement, css, html } from 'lit'

export class simpleButton extends LitElement {

  static properties = {
  }

  constructor() {
    super()
  }

  static styles = css `
    .container {
      width: 100%;
      background-color: var(--color-red);
      padding: 12px;
      border-radius: 5px;
      text-align: center;
      cursor: pointer;
      border: 2px solid white;
      outline-color: var(--color-red);
      -webkit-transition: background-color 300ms ease-out;
      -moz-transition: background-color 300ms ease-out;
      -o-transition: background-color 300ms ease-out;
      transition: background-color 300ms ease-out;
    }

    .container > span {
      color: white;
      font-size: 1rem;
      font-family: 'Nunito', sans-serif;
      text-transform: uppercase;
      font-weight: bolder;
      letter-spacing: 1px;
    }

    .container:hover {
      background-color: white;
      border: 2px solid var(--color-red);
      transition: background-color 300ms ease-out;
    }

    .container:hover > span {
      color: var(--color-red);
    }
  `

  render() {
    return html`
      <button class="container" @click=${this.__onClick}>
        <span>${this.innerHTML}</span>
      </button>
    `
  }
}

window.customElements.define('simple-button', simpleButton)
