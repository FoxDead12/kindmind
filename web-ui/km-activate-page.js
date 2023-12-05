import { LitElement, css, html } from 'lit'

export class Activate extends LitElement {

  static properties = {
    loading: { type: Boolean }
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

    .checkmark {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      display: block;
      stroke-width: 2;
      stroke: var(--color-blue);
      stroke-miterlimit: 10;
      box-shadow: inset 0px 0px 0px #4bb71b;
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      position:relative;
      top: 5px;
      right: 5px;
    margin: 0 auto;
    }
    .checkmark__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: var(--color-blue);
      fill: #fff;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;

    }

    .checkmark__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }

    @keyframes stroke {
      100% {
          stroke-dashoffset: 0;
      }
    }

    @keyframes scale {
      0%, 100% {
          transform: none;
      }

      50% {
          transform: scale3d(1.1, 1.1, 1);
      }
    }

    @keyframes fill {
      100% {
          box-shadow: inset 0px 0px 0px 30px var(--color-blue);
      }
    }

    .container {
      z-index: 1;
      overflow: hidden;
      position: absolute;

      max-width: 500px;
      height: 300px;
      background: white;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      margin: auto auto;
      border-radius: 10px;
      box-shadow: 0px 0px 50px 33px rgba(0,0,0,0.1);

      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      padding: 12px;
    }

    svg {
      filter: drop-shadow(rgba(0,0,0,0.1) 2px 4px 6px);
    }

    p {
      font-size: 20px;
      font-family: 'Nunito', sans-serif;
      text-align: center;
    }
  `

  constructor() {
    super()
    this.loading = true;
    app.openLoader('Activating your account!');

    this.__activateAccount()
  }

  render() {

    if (this.loading == true) return;

    return html `
      <div class="container">

        <div class="success-animation">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
        </div>

        <p>Account activated successfully, you can log in to our page!</p>
      </div>
    `
  }

  async __activateAccount () {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token === '' || token === undefined || !token) {
      window.location.href = 'https://www.google.pt/?hl=pt-PT';
    }

    try {
      const result = await app.executeJob('POST', '/auth/activate.php', 3000, {
        token
      });

      this.loading = false;

      setTimeout (() => {
        app.changeRoute('/login')
      }, 2000)
    } catch (e) {
      console.error(e)
      app.openToast(e.message, 'error')
    }

    app.closeLoader();
  }
}

window.customElements.define('km-activate-page', Activate)
