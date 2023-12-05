import { LitElement, css, html } from 'lit'

export class AppLoader extends LitElement {

  static properties = {
    _show: { type: Boolean }
  }

  static styles = css `

    .lds-ellipsis {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .lds-ellipsis div {
      position: absolute;
      top: 33px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #fff;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .lds-ellipsis div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }

    :host {
    }

    .container {
      z-index: 11;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0, .7);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .message-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    p {
      color: white;
      font-size: 1.5rem;
      font-family: 'Nunito', sans-serif;
    }
  `

  constructor() {
    super()
    this._show = false
    this.message = ''
  }

  firstUpdated () {
  }

  render() {

    if (!this._show) return

    return html `
      <div class="container">
          <div class="message-container">
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            <p>${this.message}</p>
          </div>
      </div>

    `
  }

  open (message) {
    this._show = true;
    this.message = message
  }

  close () {
    this._show = false;
    this.message = ''
  }
}

window.customElements.define('app-loader', AppLoader)
