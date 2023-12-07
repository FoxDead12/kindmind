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
      overflow: hidden;
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
      display: none;
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
      display: none;
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
    }

    form > .sub-container:first-child > h2 > span {
      color: var(--color-red);
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

    .background {
      z-index: 2;
      width: 100vw;
      height: 100vh;
    }

    .register-link {
      text-align: center;
    }
  `

  render() {
    return html`
      <img class="background" src="svgs/wave-2.svg" alt="Wave background" width="490" height="490"/>
      <form id="form">
        <div class="sub-container">
          <h2>Welcome Back to <span>KindMind!<span></h2>

          <simple-input id="email" type="email" placeholder="Your email" required></simple-input>
          <simple-input id="password" type="password" placeholder="Your password" required></simple-input>

          <div class="row">
            <simple-checkbox id="session" >Keep me logged in!</simple-checkbox>
            <simple-link href="/">Forget password?</simple-link>
          </div>

          <simple-button @click=${this.__buttonClick}>Login</simple-button>
          <simple-link class="register-link" href="/register">Don't have an account?</simple-link>

        </div>

        <div class="sub-container">
          <img src="svgs/svg-people.svg" alt="Students" width="490" height="490"/>
        </div>
      </form>
    `
  }

  validate () {
    var isValid = true;
    var inputs = this.shadowRoot.querySelectorAll('simple-input')
    inputs.forEach (input => {
      if (input.value === '' && !input.value) {
        input.invalid = true
        isValid = false
      }
    })

    if (isValid === false) {
      app.openToast('Fill in all the necessary fields!', 'error')
    }

    return isValid
  }


  async __buttonClick (e) {
    const valid = this.validate()
    if (valid === false) return;

    app.openLoader('Validating your login!');
    const email = this.shadowRoot.getElementById('email').value
    const password = this.shadowRoot.getElementById('password').value
    const session = this.shadowRoot.getElementById('session').checked
    let IsError = false;
    try {
      const result = await app.executeJob('POST', '/auth/login.php', 3000, {email, password, session});
      app.openToast(result.message, 'success')

      //SAVE TOKEN IN COOKIES AND SESSION
      app.session_data.token = result.body.token;
      app.setTokenCookie(result.body.token)
    } catch (e) {
      console.error(e)
      IsError = true
      app.openToast(e.message, 'error')
    }

    app.closeLoader();

    if (IsError === false) {
      //Redirect after two seconds
      await new Promise(resolve => setTimeout(resolve, 1000));
      app.changeRoute('/nx/home');
    }
  }
}

window.customElements.define('app-login', Login)
