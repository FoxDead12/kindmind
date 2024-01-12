import { LitElement, css, html } from 'lit'
import { record as Record } from './svgs/record'
import { location as Location} from './svgs/location'
import { user as User } from './svgs/user'
import './components/actions/simple-button'

export class Professor extends LitElement {
  static properties = {
    id: { type: Int16Array },
    loading: { type: Boolean },
    professor: { type: Object }
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

    @media only screen and (max-width: 1350px) {
      :host {
        width: 100%;
      }
    }

    .container {
      margin: 0px 25px;
      margin-top: 25px;
      padding: 0px;
      border-radius: 10px;
      display: grid;
      grid-template-columns: 400px auto;
      gap: 64px;
    }

    .sub-container {
      display: flex;
      flex-direction: column;
      align-content: space-evenly;
      flex-wrap: wrap;
      align-items: flex-start;
    }

    .sub-container:first-child {
      position: fixed;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.1);
      max-width: 400px;
    }

    .sub-container:last-child {
      grid-column: 2;
      background: white;
      padding: 24px;
      box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.1);
      border-radius: 10px;
    }

    .user-image {
      width: 400px;
      height: 400px;
      object-fit: cover;
      border-radius: 10px;
      color: #333;
    }

    @media only screen and (max-width: 1350px) {
      .container {
        grid-template-columns: 300px auto;
      }

      .sub-container:first-child {
        max-width: 300px;
      }

      .user-image {
        width: 300px;
        height: 300px;
      }
    }

    @media only screen and (max-width: 950px) {
      .container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .sub-container:first-child {
        position: relative;
        max-width: 100%;
      }

      .user-image {
        min-width: 100%;
        height: auto;
        aspect-ratio : 1/1;
      }
    }

    .subjects-list, .locations-list, .level-list {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      margin: 0px;
      padding: 0px;
      gap: 12px;
    }

    .subjects-list > li {
      border: 1px solid var(--color-blue);
      background: color-mix(in srgb, var(--color-blue) 10%, white);
      margin: 0px;
      padding: 8px 12px;
      color: var(--color-blue);
      border-radius: 24px;
      font-family: 'Nunito', sans-serif;
      font-size: 15px;
      font-weight: 600;
    }

    .locations-list > li {
      border: 1px solid #d9d9d9;
      border-radius: 24px;
      padding: 8px 12px;
      color: #333;
      font-family: 'Nunito', sans-serif;
      font-weight: 600;
      display: flex;
      align-items: center;
    }

    .locations-list > li > svg {
      width: 22px;
      height: 22px;
      padding-right: 10px;
      color: #333;
    }

    .level-list {
      margin-top: 8px;
      margin-bottom: 16px;
    }

    .level-list > li {
      border: 1px solid var(--color-red);
      background: color-mix(in srgb, var(--color-red) 10%, white);
      margin: 0px;
      padding: 8px 12px;
      color: var(--color-red);
      border-radius: 24px;
      font-family: 'Nunito', sans-serif;
      font-size: 15px;
      font-weight: 600;
    }

    .hour-rate {
      border: 1px solid #d9d9d9;
      border-radius: 24px;
      padding: 8px 12px;
      color: #333;
      font-family: 'Nunito', sans-serif;
      font-weight: 600;
      display: flex;
      align-items: center;
      margin-top: 8px;
      margin-bottom: 16px;
    }

    .title {
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      color: #333;
      font-size: 1.5rem;
      margin: 32px 0px 8px 0px;
      padding: 0px;
    }

    .title.separator {
      border-top: 1px solid #d4d4d4;
      padding-top: 32px;
      width: 100%;
    }

    .text{
      font-family: 'Nunito', sans-serif;
      color: #333;
      padding: 0px;
      margin: 0px;
      font-size: 16px;
      line-height: 28px;
    }

    .professor-name {
      font-family: 'Nunito', sans-serif;
      color: #333;
      text-align: center;
      width: 100%;
      margin: 0px 0px;
      margin-top: 12px;
      padding: 0px;
      font-weight: 700;
      font-size: 34px;
    }

    simple-button {
      width: 100%;
      margin-top: 16px;
    }

    @media only screen and (max-width: 1350px) {
      .professor-name {
        font-size: 28px;
      }
    }
  `

  constructor () {
    super ();
  }

  connectedCallback() {
    super.connectedCallback()
    this._load();
  }

  render () {
    if (this.loading === true) return

    return html `
      <div class="container">
        <div class="sub-container">
          ${this.professor.image_url ? html `
            <img class="user-image" src="${this.professor.image_url}"/>
          ` : html `
            <span class="user-image">${User}</span>
          `}
          <h1 class="professor-name">${this.professor.full_name}</h1>
          <simple-button @click=${this.__openContract} icon="message">Contact</simple-button>
        </div>

        <div class="sub-container">
          <ul class="subjects-list">
            ${this.professor.subjects.map(subject => {
              return html `
                <li>${subject.name}</li>
              `
            })}
          </ul>

          <h2 class="title separator">About Professor</h2>
          <span class="hour-rate">Hourly rate: ${this.professor.hour_payment}€</span>
          <p class="text">${this.professor.description}</p>

          <h2 class="title">Class Location</h2>
          <ul class="locations-list">
            ${this.professor.online ? html `<li>${Record} Online</li>` : ''}
            ${this.professor.presencial ? html `<li>${Location} Presencial</li>` : ''}
          </ul>

          <h2 class="title separator">About Class</h2>
          <ul class="level-list">
            ${this.professor.level_education.map(level => {
              return html `
                <li>${level.name}</li>
                `
            })}
          </ul>
          <p class="text">${this.professor.about_class}</p>
        </div>
      </div>
    `
  }

  async _load () {
    this.loading = true;
    app.openLoader('Getting professor data!')

    try {
      const result = await app.executeJob('GET', '/professores/professor.php?id=' + this.id, 3000)
      this.professor = result.body
    } catch (e) {
      app.openToast(e.message, 'error')
    }
    this.loading = false;
    app.closeLoader()
  }

  __openContract () {
    import ('./km-profile-page.js')
    const element = document.createElement('km-edit-field-profile')
    element.fieldName = 'proposal';
    element.updateParent = null
    element.data = {
      id_professor: this.id
    }
    this.shadowRoot.appendChild(element);
  }
}
window.customElements.define('km-professor-page', Professor)
