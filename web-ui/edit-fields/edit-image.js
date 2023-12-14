import { LitElement, css, html } from 'lit'
import '../components/inputs/simple-input'

export class FieldEditImage extends LitElement {

  static properties = {
    load: { type: Boolean },
    parent: { type: LitElement },
  }

  static styles = css `

    :host {
      display: flex;
      flex-direction: column;
    }

    input {
      float: none;
      position: relative;
      height: 25px;
      padding: 12px 12px;
      font-size: 1rem;
      border: 1px solid #d5d5d5;
      border-radius: 5px;
      outline-color: var(--color-blue);
      font-family: 'Nunito', sans-serif;
      color: var(--color-black);
    }

    .invalid {
      outline-color: var(--color-red);
      border: 1px solid var(--color-red);
    }

    input::placeholder {
      color: #333;
    }

    div {
      margin-top: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }

    img {
      background: #d4d4d4;
      border-radius: 50%;
      overview: hidden;
      border: none;
      outline: none;
      object-fit: cover;
      box-shadow: 0px 0px 10px 5px rgba(69,123,159,0.1);
    }
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
      <input id="data" accept="image/*" type="file" @change=${this.__change}/>
      <div>
        <img class="img" width="128" height="128"/>
        <img class="img" width="60" height="60"/>
        <img class="img" width="40" height="40"/>
        <img class="img" width="32" height="32"/>
      </div>
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

  validate () {
    let isValid = true

    if (!this.file || this.file === null || this.file == '') {
      this.shadowRoot.getElementById('data').invalid = true
      isValid = false
    }

    if (isValid === false) {
      app.openToast('Need select a picture first!', 'error')
    }

    return isValid
  }

  async save () {
    const valid = this.validate()
    if (!valid) return false

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

      setTimeout(() => {
        location.reload();
      }, 1500)
    } catch (e) {
      app.openToast(e.message, 'error')
    }

    app.closeLoader()
    this.parent.remove()
  }

  __change (e) {
    const [file] = e.currentTarget.files
    if (file) {
      this.file = file
      this.shadowRoot.querySelectorAll('.img').forEach(img => {
        img.src = URL.createObjectURL(file)
      })
    }

  }
}
window.customElements.define('field-edit-image', FieldEditImage)
