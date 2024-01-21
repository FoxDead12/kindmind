import { LitElement, css, html } from 'lit'
import '../components/inputs/simple-text-area'

class FieldEditAbout extends LitElement {

  static properties = {
    load: { type: Boolean },
    parent: { type: LitElement },
  }

  static styles = css `
  `

  constructor () {
    super ()
    this.load = true
    this.value = ''
    this._load()
  }

  render () {
    if (this.load === true) return

    return html `
      <simple-text-area
        rows="5"
        placeholder="Profile Overview"
        .value="${this.value}"
        id="data"
      >
      </simple-text-area>
    `
  }

  async _load () {
    try {
      const result = await app.executeJob('GET', '/profile/field.php?field=about', 3000);
      if (result.body) {
        this.value = result.body.value
      }
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

  validate () {
    let isValid = true

    if (this.shadowRoot.getElementById('data').value === null || this.shadowRoot.getElementById('data').value == '') {
      this.shadowRoot.getElementById('data').invalid = true
      isValid = false
    }

    if (isValid === false) {
      app.openToast('Fill in all the necessary fields!', 'error')
    }

    return isValid
  }

  async save () { // NECESSARY
    const isValid = this.validate()
    if (!isValid) return false

    app.openLoader('Saving data!')
    try {
      const result = await app.executeJob('PATCH', '/profile/edit.php', 3000, {
        field: 'about',
        value: this.shadowRoot.getElementById('data').value
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
window.customElements.define('field-edit-about', FieldEditAbout)
