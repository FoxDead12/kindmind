import { LitElement, css, html } from 'lit'

export class FieldEditSubjects extends LitElement {

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
      asdasdasd
    `
  }

  async _load () {
    try {
      const result = await app.executeJob('GET', '/profile/field.php?field=subjects', 3000);
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
