import { LitElement, css, html } from 'lit'

export class MessageManager extends LitElement {
  static properties = {
    proposal: { type: Object }
  }

  static styles = css `
    :host {
      background-color: #eee;
      width: 100%;
    }

    .messages {
      display: flex;
      flex-direction: column;
      gap: 24px 0px;
      padding: 12px;
    }
  `

  constructor () {
    super ()
  }

  render () {
    return html `
      <div class="messages">
        ${this.proposal.messages.map (message => {
          return this._renderMessage (message)
        })}
      </div>
    `
  }

  _renderMessage (message) {

    var image_url = ''
    var name_user = ''

    if (message.id_from_user === app.session_data.id) {
      this.type = "me"
      image_url = app.session_data.image_url
      name_user = app.session_data.full_name
    } else {
      this.type = "other"

      if (this.proposal?.student) {
        image_url = this.proposal.student.image_url
        name_user = this.proposal.student.full_name
      } else {
        image_url = this.proposal.professor.image_url
        image_url = this.proposal.professor.image_url
      }
    }

    message.message = message.message.replace('\n', '<br>')

    return html `
      <style>
        .message-container {
          display: flex;
          align-items: self-start;
          gap: 8px;
          margin: 0px 0px;
        }

        /* .message-container.right {
          flex-direction: row-reverse;
          text-align: end;
        } */

        img {
          object-fit: cover;
          border-radius: 50px;
        }

        h5 {
          margin: 0px;
          padding: 0px;
          font-size: 1.1rem;
          color: #333;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
        }

        span {
          font-size: .9rem;
          color: #333;
          font-weight: 500;
          opacity: .4;
        }

        p {
          grid-column: 2 / -1;
          margin: 0px;
          padding: 0px;
          margin-top: 0px;
          font-family: 'Nunito', sans-serif;
          font-size: 1rem;
          margin-top: 4px;
        }
      </style>
      <div class="message-container ${this.type === 'me' ? 'right' : ''}">
        <img src="${image_url}" width="50" height="50" />
        <div>
          <h5>${name_user} <span>${ message.create_at}</span></h5>
          <p .innerHTML=${message.message}></p>
        </div>
      </div>
    `
  }
}
window.customElements.define('message-manager', MessageManager)
