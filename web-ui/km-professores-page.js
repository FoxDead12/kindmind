import { LitElement, css, html } from 'lit'
import {repeat} from 'lit/directives/repeat.js';
import {user as UserIcon} from './svgs/user'

export class Professores extends LitElement {

  static properties = {
    _items: { type: Array }
  }

  static styles = css `
    :host {
      position: relative;
      width: 1250px;
      margin: 0px auto;
      display: flex;
      flex-direction: column;
    }

    .professores-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-auto-rows: 400px;
      gap: 25px;
      justify-content: center;
      padding: 25px;
    }

    .filter-container {
      padding: 0px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .filter-container h5 {
      font-family: 'Nunito', sans-serif;
      color: #333;
      font-size: 2rem;
      padding: 0px;
      margin: 0px;
    }
  `

  constructor () {
    super ();

    this._items = []
    this._load()
  }

  firstUpdated () {
    // EXECUTE REQUEST TO GET PROFESSORES
  }

  render () {
    return html `
      <div class="filter-container">
        <h5>Teachers</h5>

        <div>

        </div>
      </div>

      <div class="professores-container">
        <!-- PROFESSORES -->
        ${repeat(this._items, (professor) => professor.id, (professor) => {
          return html `
            <professor-card .data=${professor}></professor-card>
          `
        })}
      </div>
    `
  }

  async _load () {
    try {
      const result = await app.executeJob('GET', '/professores/professores.php', 3000);
      this._items = result.body.result
    } catch (e) {
      app.openToast(e.message, 'error')
    }

  }
}
window.customElements.define('km-professores-page', Professores)


class ProfessorCard extends LitElement {
  static properties = {
    data: { type: Object }
  }

  static styles = css `
    :host {
      position: relative;
      display: flex;
    }

    a {
      text-decoration: none;
      position: relative;
      width: 100%;
      background: white;
      border-radius: 10px;
      box-shadow: 0px 0px 10px 5px rgba(69,123,159,0.1);
      overflow: hidden;
      padding: 24px;
      cursor: pointer;
    }

    a:hover {
      background: rgba(69,123,159,0.1);
    }

    img, .icon-user  {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 5px;
      object-fit: cover;
    }

    .icon-user > svg {
      color: #333;
    }

    .container {
      display: flex;
      justify-content: normal;
      align-items: center;
    }

    h5 {
      font-family: 'Nunito', sans-serif;
      color: #333;
      font-size: 17px;
      padding: 0px;
      margin: 0px;
      margin-left: 15px;
      align-items: center;
      font-weight: 500;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    h4 {
      font-family: 'Nunito', sans-serif;
      color: #333;
      font-size: 24px;
      padding: 0px;
      margin: 0px;
      margin-left: 15px;
      align-items: center;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .description-content {
      padding: 0px;
      margin: 0px;
      margin-top: 32px;
      font-family: 'Nunito', sans-serif;
      color: #333;
      font-size: 16px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 5; /* number of lines to show */
      line-clamp: 5;
      -webkit-box-orient: vertical;
    }

    .skills-container {
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      max-height: 40px;
      gap: 8px;
      position: relative;
    }

    .skill {
      border: 1px solid var(--color-blue);
      flex: none;
      padding: 8px 16px;
      font-family: 'Nunito', sans-serif;
      color: var(--color-blue);
      border-radius: 20px;
      word-wrap: break-word;
    }

    .hidden {
      display: none !important;
    }
  `

  constructor () {
    super ()
  }

  firstUpdated () {
    this.__skillListManager()
  }

  render () {
    return html `
      <a href=${"/km/professores/" + this.data.id} @click=${this._open}>
        <div class="container">
          ${this.data.image_url ? html `
            <img src="${this.data.image_url}" />
          ` : html `
            <span class="icon-user">${UserIcon}</span>
          `}

          <div>
            <h4>${this.data.full_name}</h4>
            <h5>${this.data.country} ${this.data.city}</h5>
          </div>
        </div>

        <p class="description-content">${this.data.description}</p>

        <div class="skills-container" id="skills-list">
          ${this.data.subjects?.map(subject => {
            return html `
              <div class="skill">${subject}</div>
            `
          })}
        </div>
      </a>
    `
  }

  __skillListManager () {
    if (!this.data.subjects || this.data.subjects.length === 1) return;

    const widthList = this.shadowRoot.getElementById('skills-list').offsetWidth;
    const lastItemWidth = 61; // MAX WIDTH OF LAST ELEMENT
    let diffWidth = widthList - lastItemWidth - (this.shadowRoot.getElementById('skills-list').children.length * 8)
    let array = [...this.shadowRoot.getElementById('skills-list').children]

    let count = this.shadowRoot.getElementById('skills-list').children.length
    for (const children of array) {
      const temp = diffWidth - children.offsetWidth;
      if (temp < 0) {
        children.classList.add('hidden')
      } else {
        count--
      }

      diffWidth -= children.offsetWidth
    }

    const div = document.createElement('div')
    div.innerHTML = count + '+'
    div.classList.add('skill')
    this.shadowRoot.getElementById('skills-list').appendChild(div)
  }

  _open (e) {
    e.preventDefault()
    app.changeRoute('/km/professores/' + this.data.id)
  }
}
window.customElements.define('professor-card', ProfessorCard)
