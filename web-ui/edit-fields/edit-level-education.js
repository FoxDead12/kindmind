import { LitElement, css, html } from 'lit'
import {repeat} from 'lit/directives/repeat.js';
import '../components/inputs/simple-select'
import {close} from '../svgs/close'

export class FieldEditSubjects extends LitElement {

  static properties = {
    load: { type: Boolean },
    parent: { type: LitElement },
    options: {type: Array},
    value: {type: Array}
  }

  static styles = css `
    .subjects-container {
      background: #eee;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      display: flex;
      margin-top: 24px;
    }

    ul {
      position: relative;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      list-style: none;
      gap: 12px;
      padding: 12px 12px;
      margin: 0px;
    }

    li {
      overflow: hidden;
      position: relative;
      background: var(--color-blue);
      padding: 8px 12px;
      border-radius: 50px;
      display: grid;
      grid-template-columns: auto 22px;
      gap: 4px;
    }

    li p {
      margin: 0px;
      padding: 0px;
      color: white;
      font-family: 'Nunito', sans-serif;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    li span {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    li svg {
      color: white;
      width: 22px;
      height: 22px;
      cursor: pointer;
    }

    simple-select {
      z-index: 1;
    }
  `

  constructor () {
    super ()
    this.load = true
    this.value = []
    this._load()
  }

  render () {
    if (this.load === true) return

    return html `
      <simple-select
        placeholder="Select your level education"
        .items=${this.options}
        id="data"
        @key-change=${this.__valueChange}
        @item-selected=${this.__itemSelect}
      >
      </simple-select>

      <div class="subjects-container">
        <!-- SHOW SELECT SUBJECTS -->
          <ul>
            ${repeat(this.value, (item) => item.id, (item) => {
              return html `
                <li><p>${item.name}</p> <span @click=${this.__removeItem} .item="${item}">${close}</span></li>
              `
            })}
          </ul>
      </div>
    `
  }

  async _load () {
    try {
      const result = await app.executeJob('GET', '/profile/field.php?field=level_education', 3000);
      if (result.body) {
        result.body.value.map(level => {
          this.value.push({
            id: level[0],
            name: level[1]
          })
        })
      }

    } catch (e) {
      app.openToast(e.message, 'error')
    }

    app.closeLoader()
    this.load = false
  }

  async __itemSelect (e) {
    const item = e.detail.item;

    if (this.value.filter(subject => subject.id == item.id).length != 0) {
      app.openToast('Subject already choose!', 'warning')
      return
    }

    this.value.push(item)
    this.requestUpdate()
  }

  async __valueChange (e) {
    const value = e.detail.value

    try {
      const result = await app.executeJob('GET', '/filter/level_education.php?value=' + value, 3000);
      const temp = []
      result.body.result.map (item => {
        temp.push({
          id: item[0],
          name: item[1]
        })
      })

      this.options = temp
    } catch (e) {
    }
  }

  __removeItem (e) {
    const item = e.currentTarget.item;
    this.value = this.value.filter(subject => subject.id != item.id)
  }

  async save () {
    app.openLoader('Saving data!')
    try {
      const result = await app.executeJob('PATCH', '/profile/edit.php', 3000, {
        field: 'level_education',
        value: this.value
      })
      app.openToast(result.message, 'success')
    } catch (e) {
      app.openToast(e.message, 'error')
    }

    app.closeLoader()
    this.parent.remove()

    return true
  }
}
window.customElements.define('field-edit-level-education', FieldEditSubjects)
