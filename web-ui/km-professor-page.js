import { LitElement, css, html } from 'lit'

export class Professor extends LitElement {
  static properties = {
    id: { type: Int16Array },
    loading: { type: Boolean }
  }

  static styles = css `
    :host {
      position: relative;
      width: 1250px;
      margin: 0px auto;
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .container {
      margin: 0px 25px;
      margin-top: 25px;
      padding: 0px;
      border-radius: 10px;
    }
  `

  constructor () {
    super ();
  }

  firstUpdated () {
    this._load();
  }

  render () {
    if (this.load === true) return

    return html `
      <div class="container">
        <img src=""/>
      </div>
    `
  }

  async _load () {
    this.loading = true;
    app.openLoader('Getting professor data!')

    try {
      const result = await app.executeJob('GET', '/professores/professor.php?id=' + this.id, 3000)
      this.professor = result.body

    } catch (e) {
      app.openToast(e.message, 'error')
    }
    this.loading = false;
    app.closeLoader()
  }
}
window.customElements.define('km-professor-page', Professor)
