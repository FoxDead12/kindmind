import { LitElement, css, html } from 'lit'
import { message as Message, message } from '../../svgs/message'

export class SimpleButton extends LitElement {

  static properties = {
    icon: { type: String },
    text: { type: String }
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
      display: flex;
      align-items: center;
      justify-content: center;
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

    .container:hover > span, .container:hover > svg {
      color: var(--color-red);
    }

    svg {
      width: 24px;
      height: 24px;
      color: white;
      margin-right: 8px;
    }
  `

  render() {
    return html`
      <button id="button" class="container" @click=${this.__onClick}>
        ${this._renderIcon()}
        <span>${this.text ? this.text : this.innerHTML}</span>
      </button>
    `
  }

  _renderIcon () {
    switch (this.icon) {
      case 'message':
        return Message;
        break
    }
  }
}

window.customElements.define('simple-button', SimpleButton)
