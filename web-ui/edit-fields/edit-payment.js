import { LitElement, css, html } from 'lit'
import '../components/inputs/simple-input'

export class FieldEditPayment extends LitElement {

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
      <simple-input
        id="data"
        type="number"
        placeholder="Hourly rate"
        value=${this.value}
        required
      >
      </simple-input>
    `
  }

  async _load () {
    try {
      const result = await app.executeJob('GET', '/profile/field.php?field=payment', 3000);
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

  validate () {
    let isValid = true

    if (this.shadowRoot.getElementById('data').value === null || this.shadowRoot.getElementById('data').value == '' || this.shadowRoot.getElementById('data').value == 0) {
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
        field: 'payment',
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
window.customElements.define('field-edit-payment', FieldEditPayment)
