import { LitElement, css, html } from 'lit'
import '../components/inputs/simple-input'
import '../components/inputs/simple-text-area'
import '../components/inputs/simple-checkbox'
import { user as User } from '../svgs/user'

export class SendProposal extends LitElement {

  static properties = {
    parent: { type: LitElement },
    data: {type: Object},
    loading: { type: Boolean },
    setTime: { type: Boolean }
  }

  static styles = css `
    :host {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 24px;
    }

    simple-text-area, simple-checkbox, .professor-info {
      grid-column: 1 / -1;
    }

    img, .user-image {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 5px;
      object-fit: cover;
      position: relative;
      display: flex;
    }

    .icon-user > svg {
      color: #333;
    }

    .professor-info {
      display: flex;
      background-color: #eee;
      padding: 12px;
      border-radius: 5px;
    }

    .professor-info > div {
      display: flex;
      flex-direction: column;
      margin: 0px 24px;
      gap: 4px;
    }

    .professor-info > div > h5 {
      margin: 0px;
      padding: 0px;
      font-family: Nunito, sans-serif;
      font-size: 20px;
      color: #333;
      font-weight: bold;
    }

    .professor-info > div > h5:last-child {
      font-size: 16px;
      font-weight: normal;
    }
  `

  constructor () {
    super ()
    this.loading = true
    this.setTime = true
  }

  firstUpdated () {
    this.parent._buttonText = 'Send'
    this.__getProfessor()
  }

  render () {
    if (this.loading === true) return

    return html `
      <div class="professor-info">
        ${this.professor.image_url ? html `
          <img class="user-image" src="${this.professor.image_url}"/>
        ` : html `
          <span class="user-image">${User}</span>
        `}

        <div>
          <h5>${this.professor.full_name}</h5>
          <h5>Hourly rate: ${this.professor.hour_payment}€</h5>
        </div>
      </div>

      <simple-checkbox @change=${() => this.setTime ? this.setTime = false : this.setTime = true} id="check">I don't want to set the date and time yet</simple-checkbox>

      <simple-input ?disabled=${!this.setTime} id="date" type="date" placeholder="Choose a day" required></simple-input>
      <simple-input ?disabled=${!this.setTime} id="time" type="time" placeholder="Choose a hour" required></simple-input>
      <simple-input id="duration" type="number" placeholder="Set duration of class" required></simple-input>

      <simple-text-area id="description" rows="5" placeholder="Write a message to teacher about what you want"></simple-text-area>
    `
  }

  async __getProfessor () {
    try {
      this.professor = await app.executeJob('GET', '/professores/professor.php?id=' + this.data.id_professor, 3000);
      this.professor = this.professor.body
    } catch (e) {
      app.openToast(e.message, 'error')
    }

    this.loading = false
    app.closeLoader()
  }

  async save () {
    app.openLoader('Creating proposal!')

    var timeStamp = null
    if (this.setTime === true) {
      timeStamp = this.shadowRoot.getElementById('date').value + ' ' + this.shadowRoot.getElementById('time').value
    }

    try {
      const result = await app.executeJob('POST', '/proposal/create.php', 5000, {
        message: this.shadowRoot.getElementById('description').value,
        to_professor: this.data.id_professor,
        duration: this.shadowRoot.getElementById('duration').value,
        date_class: timeStamp
      })

      app.openToast(result.message, 'success')
    } catch (e) {
      app.openToast(e.message, 'error')
    }

    app.closeLoader()
    this.parent.remove()
  }
}
window.customElements.define('send-proposal', SendProposal)
