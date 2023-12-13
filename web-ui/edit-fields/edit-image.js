import { LitElement, css, html } from 'lit'
import '../components/inputs/simple-input'

export class FieldEditImage extends LitElement {

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
      <input accept="image/*" type="file" @change=${this.__change}/>

      <img id="img"/>
    `
  }

  async _load () {
    try {
      const result = await app.executeJob('GET', '/profile/field.php?field=image', 3000);
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
    app.openLoader('Saving data!')
    try {
      const formData = new FormData();
      formData.append("file", this.file);

      const file = await app.executeJob('POST', '/profile/profile-image.php', 3000, formData)

      const result = await app.executeJob('PATCH', '/profile/edit.php', 3000, {
        field: 'image',
        value: file.body.file_name
      })
      app.openToast(result.message, 'success')
    } catch (e) {
      app.openToast(e.message, 'error')
    }

    app.closeLoader()
    this.parent.remove()
    location.reload();
  }

  __change (e) {
    const [file] = e.currentTarget.files
    if (file) {
      this.file = file
      this.shadowRoot.getElementById('img').src = URL.createObjectURL(file)
    }

  }
}
window.customElements.define('field-edit-image', FieldEditImage)
