import { LitElement, css, html } from 'lit'
import {repeat} from 'lit/directives/repeat.js';
import {user as UserIcon} from './svgs/user'
import {sender as SenderIcon} from './svgs/send'
import './components/actions/simple-button'
import './components/inputs/simple-input'
import './message-manager'

export class Proposals extends LitElement {

  static properties = {
    _items: { type: Array }
  }

  static styles = css `
    :host {
      position: relative;
      width: 1250px;
      margin: 0px auto;
      display: block;
    }

    .container {
      margin: 0px 25px;
      margin-top: 25px;
      padding: 0px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .proposal {
      position: relative;
      background-color: white;
      padding: 12px 12px;
      box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.1);
      border-radius: 5px;
    }
  `

  constructor () {
    super ()
    this._items = []
    this._load()
  }

  render () {
    return html `
      <div class="container">
        ${repeat (this._items, (proposal) => proposal.id, (proposal) => {
          return this._proposal(proposal)
        })}
      </div>
    `
  }

  async _load () {
    app.openLoader('Getting proposals!')

    try {
      const result = await app.executeJob('GET', '/proposal/proposals.php', 5000);
      this._items = result.body.result
    } catch (e) {
      app.openToast(e.message, 'error')
    }

    app.closeLoader()
  }

  _proposal (proposal) {
    if (proposal.class_time) {
      var [date, time] = proposal.class_time.split(" ")
    } else {
      var date = time = 'Need be defined'
    }

    const menuClick = () => {
      const element = this.shadowRoot.getElementById('message-container-' + proposal.id)
      if (element.classList.contains ('active')) {
        element.classList.remove ('active')
      } else {
        element.classList.add ('active')
      }
    }

    const sendMessage = (ProposalId) => {
      const element = this.shadowRoot.getElementById('message-' + ProposalId)
      const message = element.value

      if (message === null || message == "") {
        return
      }

      app.sendWebsocketMessage({
        message,
        to: proposal.professor.id,
        proposal_id: proposal.id
      }, 'message')

      element.value = ''
    }

    return html `
      <style>
        .professor-info {
          position: relative;
          display: grid;
          align-items: flex-start;
          grid-template-columns: auto auto 1fr;
        }

        h5 {
          font-size: 1.5rem;
          padding: 0px;
          margin: 0px;
          font-family: 'Nunito', sans-serif;
          color: #333;
          font-weight: 600;
          margin-bottom: 24px;
        }

        img, .icon-user  {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 5px;
          object-fit: cover;
        }

        .icon-user > svg {
          color: #333;
        }

        .data, .data-proposal {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          font-family: 'Nunito', sans-serif;
          font-size: 1rem;
          margin-left: 24px;
          gap: 0px 12px;
          align-items: baseline;
        }

        .data-proposal {
          grid-template-columns: auto 1fr;
        }

        .data > p, .data-proposal > p {
          margin: 0px;
          padding: 0px;
          font-size: 1rem;
        }

        .data > label, .data-proposal > label {
          font-weight: 700;
          margin: 8px 0px;
          padding: 0px;
          font-size: 1rem;
        }

        .data > label:first-child, .data-proposal > label:first-child {
          margin-top: 0px;
        }

        .state {
          position: absolute;
          right: 12px;
          top: 12px;
          display: flex;
          flex-direction: row;
          align-items: center;
          font-family: 'Nunito', sans-serif;
        }

        .state > .status {
          margin-left: 8px;
          position: relative;
          display: flex;
          width: 12px;
          height: 12px;
          border-radius: 12px;
        }

        .state.red {
          color: #F6AE2D;
        }

        .state.red .status {
          background-color: #F6AE2D;
          box-shadow: rgba(246, 174, 45, 0.5) 0px 0px 2px 1px;
        }

        .state.green {
          color: #4CAF50;
        }

        .state.green .status {
          background-color: #4CAF50;
          box-shadow: rgba(76, 175, 80, 0.5) 0px 0px 2px 1px;
        }

        .drop-down {
          position: relative;
          flex-direction: column;
          grid-column: 1 / -1;
          margin-top: 24px;
          max-height: 0px;
          overflow: hidden;
          transition: max-height 300ms ease-out;
          display: none;
        }

        .drop-down.active {
          display: grid;
          grid-template-rows: 1fr auto;
          max-height: 400px;
        }

        message-manager {
          max-height: 100%;
          height: 100%;
          overflow: auto;
          display: flex;
          flex-direction: column-reverse;
        }

        simple-button {
          margin-top: 24px;
        }

        simple-button {
          font-size: 1px !important;
        }

        .sender-message {
          display: flex;
          border: 2px solid var(--color-blue);
          border-radius: 30px;
          overflow: hidden;
          padding: 0px;
          margin: 0px;
          margin-top: 12px;
        }

        .sender-message > textarea {
          width: 100%;
          outline: none;
          border: none;
          font-size: 1rem;
          font-family: 'Nunito', sans-serif;
          color: #333;
          padding: 0px;
          margin: 0px;
          padding: 12px 18px;
          resize: none;
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        .sender-message > textarea::-webkit-scrollbar {
          display: none;
        }

        .sender-message > button {
          width: 90px;
          height: 100%;
          outline: none;
          border: none;
          margin: 0px;
          padding: 0px;
          background-color: var(--color-blue);
          color: white;
          border-radius: 0px 0px 0px 40px;
          cursor: pointer;
        }

        .sender-message > button:active svg {
          transform: scale(0.8) rotateZ(-30deg);
        }

        .sender-message > button > svg {
          width: 22px;
          height: 22px;
          transform: rotateZ(-35deg);
        }

      </style>

      <div class="proposal">
        <h5>Proposal to, <strong>${proposal.professor.full_name}</strong></h5>
        ${proposal.activate ? html `<span class="state green">Accepted <span class="status"></span></span>` : html `<span class="state red">Pending <span class="status"></span></span>`}
        <div class="professor-info">
          ${proposal.professor.image_url ? html `<img src="${proposal.professor.image_url}" />` : html `<span class="icon-user">${UserIcon}</span>`}

          <div class="data">
            <label>Date of class:</label>
            <p>${date}</p>

            <label>Time of class:</label>
            <p>${time}</p>

            <label>Duration of class:</label>
            <p>${proposal.duration}h</p>
          </div>

          <div class="data-proposal">
            <label>Message of proposal:</label>
            <p>${proposal.message}</p>
          </div>

          <simple-button @click=${menuClick}>See messages</simple-button>

          <div id="message-container-${proposal.id}" class="drop-down">
            <message-manager .proposal=${proposal}></message-manager>

            <div class="sender-message">
              <textarea id="message-${proposal.id}" .rows=${1} placeholder="Write your message here..."></textarea>
              <button @click=${() => sendMessage(proposal.id)}>${SenderIcon}</button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  async updateMessage () {
    try {
      const result = await app.executeJob('GET', '/proposal/proposals.php', 5000);
      this._items = result.body.result
    } catch (e) {
      app.openToast(e.message, 'error')
    }
  }
}
window.customElements.define('km-proposals-page', Proposals)

