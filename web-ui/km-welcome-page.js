import { LitElement, css, html } from 'lit'
import './welcome/app-layout'
export class WelcomePage extends LitElement {

  static styles = css `
    :host {
      position: relative;
      display: block;
      width: 100vw;
      height: 100vh;
      overflow-x: hidden;
      scroll-behavior: smooth;
      background-color: #eee;

    }
  `

  constructor () {
    super ()
  }

  render () {
    return html `
      <app-layout></app-layout>
    `
  }
}
window.customElements.define('km-welcome-page', WelcomePage)
