import { LitElement, css, html } from 'lit'
import './components/inputs/simple-input'
import './components/inputs/simple-checkbox'
import './components/actions/simple-button'
import './components/actions/simple-link'

export class Register extends LitElement {

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

    form {
      z-index: 1;
      overflow: hidden;
      position: absolute;
      display: grid;
      grid-template-columns: 51% 49%;
      width: 950px;
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
      width: 51%;
      height: 100%;
      left: 0%;
      opacity: 0.3;
    }

    form > .sub-container {
      position: relative;
      display: block;
    }

    form > .sub-container:last-child {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 25px;
      padding: 0px 30px;
    }

    form > .sub-container:first-child {
      display: flex;
      align-items: start;
      justify-content: center;
      flex-direction: column;
    }

    form > .sub-container:last-child > h2 {
      margin: 0px;
      text-align: center;
      font-family: 'Nunito', sans-serif;
      font-size: 1.3rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--color-black);
      margin-bottom: 25px;
    }

    form > .sub-container:last-child > h2 > span {
      color: var(--color-red);
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .role-container {
      display: flex;
      justify-content: start;
      gap: 25px;
    }

    .role-container label {
      font-family: 'Nunito', sans-serif;
      color: #333;
      margin-left: 8px;
      font-size: 1rem;
    }

    .role-container input {
      outline-color: var(--color-blue);
    }

    simple-button {
      margin-top: 25px;
    }

    @media only screen and (max-width: 950px) {
      form {
        width: 90%;
        height: 90%;
        display: flex;
        flex-direction: column;
        flex-direction: row;
      }

      form::before {
        display: none;
      }

      form > .sub-container:last-child {
        width: 100%;
        height: 100%;
        padding: 0px 12px;
      }

      form > .sub-container:first-child {
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

  constructor() {
    super()
  }

  render() {
    return html `
      <form>
        <div class="sub-container">
          <img src="svgs/svg-people-2.svg" alt="Students" width="490" height="490"/>
        </div>

        <div class="sub-container">
          <h2><span>Change your future</span> now<br>width <span>kindmind!</span></h2>

          <div class="row">
            <simple-input id="name" type="text" placeholder="Your name" required></simple-input>
            <simple-input id="date" type="date" placeholder="Your birth date" required></simple-input>
          </div>

          <simple-input id="email" type="email" placeholder="Your email" required></simple-input>
          <div class="row">
            <simple-input id="password" type="password" placeholder="Your password" required></simple-input>
            <simple-input id="password-confirm" type="password" placeholder="Repeat password" required></simple-input>
          </div>

          <div class="role-container">
            <div>
              <input type="radio" id="student" name="role" value="0" />
              <label for="student">Student</label>
            </div>
            <div>
              <input type="radio" id="professor" name="role" value="1" />
              <label for="professor">Professor</label>
            </div>
          </div>

          <simple-button @click=${this.__buttonClick}>Create account</simple-button>
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

    const radios = this.shadowRoot.querySelectorAll('input[type=radio]');
    let selectedInput;
    radios.forEach (input => {
      if (input.checked === true) {
        selectedInput = false
      }
    })
    if (selectedInput == undefined) {
      isValid = false
    }

    if (isValid === false) {
      app.openToast('Preencha todos os campos necessarios!', 'error')
    }

    return isValid
  }

  async __buttonClick (e) {
    const valid = this.validate()
    if (valid === false) return;

    const name = this.shadowRoot.getElementById('name').value
    const email = this.shadowRoot.getElementById('email').value
    const date = this.shadowRoot.getElementById('date').value
    const password = this.shadowRoot.getElementById('password').value
    var role;

    this.shadowRoot.querySelectorAll('input[type=radio]').forEach (input => {
      if (input.checked === true) {
        role = input.value
      }
    })

    try {
      const result = await app.executeJob('POST', '/auth/register.php', 3000, {
        name,
        email,
        date,
        password,
        role
      });

      // Open the activate account
      app.openToast(result.message, 'success')

    } catch (e) {
      console.error(e)
      app.openToast(e.message, 'error')
    }
  }
}

window.customElements.define('app-register', Register)
