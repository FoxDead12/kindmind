import { LitElement, css, html } from 'lit'

export class Activate extends LitElement {

  static styles = css `
   :host {
      display: block;
      position: relative;
      width: 100vw;
      height: 100vh;
    }

    :host:before {
      content: '';
      position: absolute;
      display: block;
      background: var(--color-blue);
      width: 50%;
      height: 100%;
      top: 0px;
      left: 50%;
      opacity: 0.3;
    }

    :host::after {
      content: '';
      position: absolute;
      display: block;
      background: var(--color-blue);
      width: 50%;
      height: 100%;
      left: 0;
      top: 0px;
    }
  `

  constructor() {
    super()
  }

  render() {
    return html `
    `
  }
}

window.customElements.define('km-activate-page', Activate)
