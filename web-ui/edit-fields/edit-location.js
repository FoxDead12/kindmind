import { LitElement, css, html } from 'lit'
import '../components/inputs/simple-select'

export class FieldEditLocation extends LitElement {

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
      <simple-select
        placeholder="Select you location"
        .items=${this.options}
        .value=${this.value}
        id="data"
      >
      </simple-select>
    `
  }

  async _load () {
    try {
      const result = await app.executeJob('GET', '/profile/field.php?field=location', 3000);

      if (result?.body?.value) {
        this.value = result.body.value
      }

      this.options = result.body.options
    } catch (e) {
      console.log(e)
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

    if (!this.shadowRoot.getElementById('data').value || this.shadowRoot.getElementById('data').value == '') {
      this.shadowRoot.getElementById('data').invalid = true
      isValid = false
    }

    if (isValid === false) {
      app.openToast('Fill in all the necessary fields!', 'error')
    }

    return isValid
  }

  async save () {
    const isValid = this.validate()
    if (!isValid) return

    app.openLoader('Saving data!')
    try {
      const result = await app.executeJob('PATCH', '/profile/edit.php', 3000, {
        field: 'location',
        value: this.shadowRoot.getElementById('data').value
      })
      app.openToast(result.message, 'success')
    } catch (e) {
      app.openToast(e.message, 'error')
    }

    app.closeLoader()
    this.parent.remove()
  }
}
window.customElements.define('field-edit-location', FieldEditLocation)
