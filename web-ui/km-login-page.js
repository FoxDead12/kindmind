import { LitElement, css, html } from 'lit'
import './components/inputs/simple-input'
import './components/inputs/simple-checkbox'
import './components/actions/simple-button'
import './components/actions/simple-link'

export class Login extends LitElement {
  constructor() {
    super()
  }

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
      opacity: 0.3;
    }

    form {
      z-index: 1;
      overflow: hidden;
      position: absolute;
      display: flex;
      width: 850px;
      height: 550px;
      background: white;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      margin: auto auto;
      border-radius: 10px;
      box-shadow: 0px 0px 50px 33px rgba(0,0,0,0.1);
    }

    form::before {
      content: '';
      position: absolute;
      display: block;
      background: var(--color-blue);
      width: 49%;
      height: 100%;
      left: 51%;
      opacity: 0.3;
    }

    form > .sub-container {
      position: relative;
      display: block;
      width: 50%;
    }

    form > .sub-container:first-child {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 25px;
      padding: 0px 50px;
    }

    form > .sub-container:first-child > h2 {
      margin: 0px;
      text-align: center;
      font-family: 'Nunito', sans-serif;
      margin-bottom: 25px;
      font-size: 1.8rem;
      color: var(--color-black);
    }

    form > .sub-container:last-child {
      display: flex;
      align-items: center;
      justify-content: end;
    }

    simple-button {
      margin-top: 15px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .row > p {
      margin: 0px;
      font-family: 'Nunito', sans-serif;
      color: var(--color-black);
    }

    @media only screen and (max-width: 950px) {
      form {
        width: 90%;
        height: 90%;
        flex-direction: column;
        flex-direction: row;
      }

      form::before {
        display: none;
      }

      form > .sub-container:first-child {
        width: 100%;
        height: 100%;
        padding: 0px 12px;
      }

      form > .sub-container:last-child {
        display: none;
        width: 0px;
        height: 0px;
      }

      .row {
        flex-direction: column;
        justify-content: start;
        align-items: start;
        gap: 25px;
      }
    }
  `

  render() {
    return html`
      <form id="form">
        <div class="sub-container">
          <h2>Welcome Back</h2>

          <simple-input id="email" type="email" placeholder="Your email" required></simple-input>
          <simple-input id="password" type="password" placeholder="Your password" required></simple-input>

          <div class="row">
            <simple-checkbox id="session" >Keep me logged in!</simple-checkbox>
            <simple-link>Forget password?</simple-link>
          </div>

          <simple-button @click=${this.__buttonClick}>Login</simple-button>
        </div>

        <div class="sub-container">
          <img src="svgs/svg-people.svg" alt="Students" width="490" height="490"/>
        </div>
      </form>
    `
  }

  __buttonClick (e) {

    const email = this.shadowRoot.getElementById('email').value
    const password = this.shadowRoot.getElementById('password').value
    const session = this.shadowRoot.getElementById('session').checked
  }
}

window.customElements.define('app-login', Login)
