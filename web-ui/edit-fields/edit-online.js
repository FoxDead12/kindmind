import { LitElement, css, html } from 'lit'
import '../components/inputs/simple-checkbox'

export class FieldEditOnline extends LitElement {

  static properties = {
    load: { type: Boolean },
    parent: { type: LitElement },
  }

  constructor () {
    super ()
    this.load = true
    this.value = ''
    this._load()
  }

  render () {
    if (this.load === true) return

    return html `
      <simple-checkbox id="data" ?checked=${this.value} id="session">Online classes!</simple-checkbox>
    `
  }

  async _load () {
    try {
      const result = await app.executeJob('GET', '/profile/field.php?field=online', 3000);
      this.value = result.body.value
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

  async save () {

    app.openLoader('Saving data!')
    const state = this.shadowRoot.getElementById('data').checked ? 1 : 0
    try {
      const result = await app.executeJob('PATCH', '/profile/edit.php', 3000, {
        field: 'online',
        value: state
      })
      app.openToast(result.message, 'success')
    } catch (e) {
      app.openToast(e.message, 'error')
    }

    app.closeLoader()
    this.parent.remove()
  }
}
window.customElements.define('field-edit-online', FieldEditOnline)
