import { LitElement, css, html } from 'lit'
import {close} from './svgs/close'

export class AppToast extends LitElement {
  static properties = {
    message: { type: String },
    type: {type: String}, // success, error
    _show: { type: Boolean }
  }

  static styles = css `
    :host {
      z-index: 10;
      position: fixed;
      bottom: 12px;
      left: 12px;
      display: flex;
      width: calc(100% - 24px);
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .container {
      position: relative;
      font-size: 1rem;
      color: white;
      border-radius: 5px;
      box-shadow: 0px 0px 50px 33px rgba(0,0,0,0.1);
      font-family: 'Nunito', sans-serif;
      letter-spacing: 1px;
      padding: 16px;
      opacity: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      -webkit-animation: slide-top 300ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
      animation: slide-top 300ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    span {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    svg {
      width: 30px;
      height: 30px;
    }

    p {
      margin: 0px;
      padding: 0px;
    }

    .success {
      background: #4CAF50;
    }

    .error {
      background: #f44336;
    }

    @keyframes slide-top{0%{transform:translateY(50px)}100%{transform:translateY(0px)}}
  `

  constructor () {
    super ()

    this._show = false
  }

  render () {

    if (!this._show) return;

    return html `
      <div id="container" class="container ${this.type}">
        <p>${this.message}</p>

        <span @click=${this.__close}>
          ${close}
        </span>
      </div>
    `
  }

  open (message, type) {
    if (this._show === false || this.type != type) {
      if (this._show === true) clearTimeout(this.timeout);
      this._show = true
      this.message = message
      this.type = type

      this.timeout = setTimeout(() => {
        this._show = false
      }, 5000)
    }
  }

  __close () {
    this._show = false
    clearTimeout(this.timeout)
  }
}
window.customElements.define('app-toast', AppToast)

