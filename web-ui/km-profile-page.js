import { LitElement, css, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { user } from './svgs/user'
import { location } from './svgs/location'
import { pencil } from './svgs/pencil'
import { pc } from './svgs/pc'
import { book } from './svgs/book'
import { euro } from './svgs/euro'
import { close } from './svgs/close'
import './components/actions/simple-button';
export class KmProfile extends LitElement {

  static properties = {
    load: {type: Boolean}
  }

  static styles = css `
    :host {
      position: relative;
      width: 1250px;
      margin: 0px auto;
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .container {
      margin: 0px 25px;
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0px 0px 15px 1px rgba(0,0,0,0.05);
    }

    .container > .sub-title {
      position: relative;
      font-family: 'Nunito', sans-serif;
      color: #333;
      margin: 0px;
      padding: 0px;
      font-size: 1.3rem;
      display: flex;
    }

    .container > .content {
      font-family: 'Nunito', sans-serif;
      color: #333;
      margin: 0px;
      padding: 0px;
      font-size: 1rem;
      margin-top: 16px;
    }

    .container > .list-skills {
      list-style: none;
      margin: 0px;
      padding: 0px;
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      border-bottom: 1px solid #eee;
      padding-bottom: 16px;
    }

    .container > .list-skills > li {
      font-family: 'Nunito', sans-serif;
      color: #333;
      border: 1px solid var(--color-blue);
      color: var(--color-blue);
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 50px;
    }

    .list-skills.red {

    }

    .list-skills.red > li {
      border: none;
      color: white;
      background:  var(--color-red);
    }

    .row {
      margin: 0px 25px;
      display: grid;
      grid-template-columns: auto 70%;
      gap: 25px;
    }

    .row .container {
      margin: 0px;
    }

    .container.first {
      display: flex;
    }

    .container.first > div {
      width: 100%;
    }

    .user-image {
      display: flex;
      position: relative;
      width: 88px;
      height: 88px;
      border-radius: 50%;
      box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.1);
      cursor: pointer;
      background: transparent;
      object-fit: cover;

    }

    .user-image > svg {
      color: #333;
    }

    .user-name {
      margin: 0px;
      padding: 0px;
      font-family: 'Nunito', sans-serif;
      font-size: 2.3rem;
      font-weight: 600;
      color: #333;
      margin-left: 25px;
    }

    .location-icon {
      display: flex;
      position: relative;
      width: 24px;
      height: 24px;
    }

    .location-info {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: start;
      margin-left: 25px;
      color: #7e8d97;
      margin-top: 4px;
    }

    .location-info > h5 {
      margin: 0px;
      padding: 0px;
      font-family: 'Nunito', sans-serif;
      margin-left: 4px;
      font-size: 1rem;
      font-weight: 500;
    }

    .sub-title-row {
      position: relative;
      font-family: 'Nunito', sans-serif;
      font-weight: 600;
      font-size: 1.3rem;
      margin: 0px;
      padding: 0px;
      color: #333;
      font-weight: bold;
    }

    .content-row {
      font-family: 'Nunito', sans-serif;
      font-size: 1.2rem;
      display: flex;
      margin: 0px;
      padding: 0px;
      margin-top: 8px;
    }

    .icon-attribute {
      display: flex;
      position: relative;
      width: 24px;
      height: 24px;
      color: rgb(126, 141, 151);
      color: var(--color-blue);
      margin-right: 8px;
    }

    .edit-container {
      position: absolute;
      display: flex;
      width: 24px;
      height: 24px;
      right: 0px;
      top: 0px;
      color: var(--color-blue);
      cursor: pointer;
      border-radius: 50px;
    }

    .image-container {
      position: relative;
    }

    .edit-container.image {
      top: calc(100% - 25px);
      background: white;
      padding: 4px;
    }
  `

  constructor () {
    super ()
    this.__loadUser()
  }

  render () {
    if (this.load === true) return

    return html `
      <div class="container first">
        <span class="image-container">
          ${app.session_data.image_url ? html `
          <img class="user-image" src="${app.session_data.image_url}" width="88" height="88"/>
          ` : html `
          <span class="user-image">${user}</span>
          `}
          <div class="edit-container image" @click="${this.__openEditMenu}" field="image" >${pencil}</div>
        </span>


        <div>
          <h5 class="user-name">${this.data.full_name}</h5>
          <div class="location-info">
            <span class="location-icon">
              ${location}
            </span>
            <h5>${this.data.location ? this.data.location : 'NOT SET'} <div class="edit-container" @click="${this.__openEditMenu}" field="location" >${pencil}</div></h5>
          </div>
        </div>
      </div>
      ${app.session_data.role === 1 ? html `
        <div class="row">
          <div class="container">
            <h4 class="sub-title-row">Online / Remote: <div class="edit-container" @click="${this.__openEditMenu}" field="online" >${pencil}</div></h4>
            <p class="content-row"><span class="icon-attribute">${pc}</span>${this.data.teacher.online === 1 ? 'Yes' : 'No'}</p>
            <br/><br/>
            <h4 class="sub-title-row">Presencial: <div class="edit-container" @click="${this.__openEditMenu}" field="presencial" >${pencil}</div></h4>
            <p class="content-row"><span class="icon-attribute">${book}</span>${this.data.teacher.presencial === 1 ? 'Yes' : 'No'}</p>
            <br/><br/>
            <h4 class="sub-title-row">Hour / Class: <div class="edit-container" @click="${this.__openEditMenu}" field="payment" >${pencil}</div></h4>
            <p class="content-row"><span class="icon-attribute">${euro}</span>${this.data.teacher.payment ? this.data.teacher.payment + '€' : 'NOT SET'}</p>
            <br/>
          </div>

          <div class="container">
            <h4 class="sub-title">About Me <div class="edit-container" @click="${this.__openEditMenu}" field="about" >${pencil}</div></h4>
            <p class="content">${this.data.teacher.description ? this.data.teacher.description : ''}</p>

            <br/>
            <h4 class="sub-title">Subjects <div class="edit-container" @click="${this.__openEditMenu}" field="subjects">${pencil}</div></h4>
            <ul class="list-skills">
              <li>Matematica</li>
              <li>Matematica</li>
              <li>Matematica</li>
              <li>Matematica</li>
              <li>Matematica</li>
            </ul>
          </div>
        </div>

        <div class="container">
          <h4 class="sub-title">About Class <div class="edit-container" @click="${this.__openEditMenu}" field="about-class" >${pencil}</div></h4>
          <p class="content">${this.data.teacher.about_class ? this.data.teacher.about_class : ''}</p>
          <br/>
          <h4 class="sub-title">Education Levels <div class="edit-container">${pencil}</div></h4>
          <ul class="list-skills red">
            <li>1º Ciclo</li>
            <li>2º Ciclo</li>
            <li>3º Ciclo</li>
            <li>4º Ciclo</li>
            <li>5º Ciclo</li>
          </ul>
        </div>
      ` : ''}
    `
  }

  async __loadUser () {
    this.load = true
    app.openLoader('Getting your data!')
    try {
      const result = await app.executeJob('GET', '/profile/user.php', 3000);
      this.data = result.body
    } catch (e) {
      if (e.code >= 300) {
        app.openToast(e.message, 'warning')
      } else {
        app.openToast(e.message, 'error')
      }
    }

    app.closeLoader()
    this.load = false
  }

  __openEditMenu (e) {
    const element = document.createElement('km-edit-field-profile')
    element.fieldName = e.currentTarget.getAttribute('field');
    element.updateParent = this.__loadUser.bind(this)
    this.shadowRoot.appendChild(element);
  }

}
window.customElements.define('km-profile-page', KmProfile)

class WizardEditField extends LitElement {

  static properties = {
    fieldName: { type: String },
    updateParent: { type: Function },
    _title: { type: String },
    _description: { type: String }
  }

  static styles = css `
    .container {
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0, .5);

      left: 0px;
      top: 0px;
      z-index: 9;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .form {
      position: relative;
      background: white;
      border-radius: 10px;
      padding: 24px;
      box-shadow: 0px 0px 10px 5px rgba(69,123,159,0.1);
      width: 700px;
    }

    h5 {
      position: relative;
      margin: 0px;
      padding: 0px;
      font-size: 2rem;
      font-family: 'Nunito', sans-serif;
      color: #333;
    }

    p {
      font-family: 'Nunito', sans-serif;
      font-size: 1rem;
      color: rgb(126, 141, 151);
    }

    .button-container {
      display: flex;
      justify-content: end;
      margin-top: 25px;
    }

    simple-button {
      width: 250px;
    }

    .close-button {
      display: flex;
      position: absolute;
      width: 32px;
      height: 32px;
      right: -10px;
      top: -10px;
      background: white;
      border-radius: 50px;
      padding: 2px;
      cursor: pointer;
      color: #333;
    }

    .close-button:hover {
      color: var(--color-blue);
    }
  `

  constructor () {
    super ()

    this._fieldsEdit = {
      about: {
        title: 'Profile overview',
        description: "Use this space to show clients you have the skills and experience they're looking for.<ul><li>Describe your strengths and skills</li><li>Highlight projects, accomplishments and education</li><li>Keep it short and make sure it's error-free</li></ul>"
      },
      location: {
        title: 'Edit Your Location',
        description: 'Indicate your location to find out your nationality and the area of in-person classes'
      },
      payment: {
        title: 'Change hourly rate',
        description: 'Enter the amount you will receive per hour.'
      },
      presencial: {
        title: 'Change your presencial class status',
        description: 'Tell if you give face-to-face classes or not.'
      },
      online: {
        title: 'Change your online class status',
        description: 'Tell if you give online classes or not.'
      },
      about_class: {
        title: 'Class overview',
        description: "Use this space to show clients about your job.<ul><li>How do you plan classes</li><li>Study plan for the client</li><li>How to lead the class</li></ul>"
      },
      image: {
        title: 'Change profile picture',
        description: ""
      },
      subjects: {
        title: 'Select subjects you want teach',
        description: "Choose the subjects that you feel comfortable teaching, and you can choose to teach the ones you want!"
      }
    }

    app.openLoader('Getting data field!')
  }

  firstUpdated () {
    this.__setField()

    window.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 27:
          this.remove();
        break;
      }
    }, true)
  }

  render () {
    return html `
      <div class="container" id="container">
        <div class="form">
          <div class="close-button" @click=${() => this.remove()}>${close}</div>

          <h5>${this._title}</h5>
          <p>${unsafeHTML(this._description)}</p>
          <div id="content"></div>

          <div class="button-container">
            <simple-button @click="${this.__onClick}">Save</simple-button>
          </div>
        </div>
      </div>
    `
  }

  __setField () {
    switch (this.fieldName) {
      case 'about':
        this._title = this._fieldsEdit.about.title
        this._description = this._fieldsEdit.about.description
        this.__loadComponent('field-edit-about')
        break
      case 'location':
        this._title = this._fieldsEdit.location.title
        this._description = this._fieldsEdit.location.description
        this.__loadComponent('field-edit-location')
        break
      case 'payment':
        this._title = this._fieldsEdit.payment.title
        this._description = this._fieldsEdit.payment.description
        this.__loadComponent('field-edit-payment')
        break
      case 'presencial':
        this._title = this._fieldsEdit.presencial.title
        this._description = this._fieldsEdit.presencial.description
        this.__loadComponent('field-edit-presencial')
        break
      case 'online':
        this._title = this._fieldsEdit.online.title
        this._description = this._fieldsEdit.online.description
        this.__loadComponent('field-edit-online')
        break
      case 'about-class':
        this._title = this._fieldsEdit.about_class.title
        this._description = this._fieldsEdit.about_class.description
        this.__loadComponent('field-edit-about-class')
        break
      case 'image':
        this._title = this._fieldsEdit.image.title
        this._description = this._fieldsEdit.image.description
        this.__loadComponent('field-edit-image')
        break
      case 'subjects':
        this._title = this._fieldsEdit.subjects.title
        this._description = this._fieldsEdit.subjects.description
        this.__loadComponent('field-edit-subjects')
        break
    }
  }

  __loadComponent (comp) {
    let element
    switch (comp) {
      case 'field-edit-about':
        import ('./edit-fields/edit-about')
        element = document.createElement('field-edit-about')
      break
      case 'field-edit-location':
        import ('./edit-fields/edit-location')
        element = document.createElement('field-edit-location')
        break;
      case 'field-edit-payment':
        import ('./edit-fields/edit-payment')
        element = document.createElement('field-edit-payment')
        break;
      case 'field-edit-presencial':
        import ('./edit-fields/edit-presencial')
        element = document.createElement('field-edit-presencial')
        break;
      case 'field-edit-online':
        import ('./edit-fields/edit-online')
        element = document.createElement('field-edit-online')
        break;
      case 'field-edit-about-class':
        import ('./edit-fields/edit-about-class')
        element = document.createElement('field-edit-about-class')
        break;
      case 'field-edit-image':
        import ('./edit-fields/edit-image')
        element = document.createElement('field-edit-image')
        break
      case 'field-edit-subjects':
        import ('./edit-fields/edit-subjects')
        element = document.createElement('field-edit-subjects')
        break
    }

    element.parent = this
    this.element = element
    this.shadowRoot.getElementById('content').appendChild(element)
  }

  async __onClick (e) {
    const result = await this.element.save()
    if (result) await this.updateParent()
  }
}
window.customElements.define('km-edit-field-profile', WizardEditField)
