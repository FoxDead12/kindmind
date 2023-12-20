import { LitElement, css, html } from 'lit'
import {repeat} from 'lit/directives/repeat.js';
import '../components/inputs/simple-select'
import {close} from '../svgs/close'

export class FieldEditSubjects extends LitElement {

  static properties = {
    load: { type: Boolean },
    parent: { type: LitElement },
    options: {type: Array}
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
      width: 100%;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      list-style: none;
      gap: 15px;
      padding: 12px;
    }

    li {
      position: relative;
      background: var(--color-blue);
      padding: 8px 12px;
      border-radius: 50px;
      display: flex;
      justify-content: space-between;
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

    li svg {
      color: white;
      width: 22px;
      height: 22px;
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
        placeholder="Select your subjects"
        .items=${this.options}
        .value=${1}
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
                <li><p>${item.name}</p> ${close}</li>
              `
            })}
          </ul>
      </div>
    `
  }

  async __itemSelect (e) {
    const item = e.detail.item;
    this.value.push(item)
    this.requestUpdate()
  }

  async __valueChange (e) {
    const value = e.detail.value

    try {
      const result = await app.executeJob('GET', '/filter/subjects.php?value=' + value, 3000);
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

  async _load () {
    try {
      const result = await app.executeJob('GET', '/profile/field.php?field=subjects', 3000);
      if (result.body) {
        this.value = result.body.value
      }

    } catch (e) {
      app.openToast(e.message, 'error')
    }

    app.closeLoader()
    this.load = false
  }

  async save () {

    // app.openLoader('Saving data!')
    // const state = this.shadowRoot.getElementById('data').checked ? 1 : 0
    // try {
    //   const result = await app.executeJob('PATCH', '/profile/edit.php', 3000, {
    //     field: 'presencial',
    //     value: state
    //   })
    //   app.openToast(result.message, 'success')
    // } catch (e) {
    //   app.openToast(e.message, 'error')
    // }

    // app.closeLoader()
    // this.parent.remove()

    return true
  }
}
window.customElements.define('field-edit-subjects', FieldEditSubjects)
