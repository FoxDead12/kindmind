import { LitElement, css, html } from 'lit'

export class SimpleCheckbox extends LitElement {
  static properties = {
    checked: { type: Boolean }
  }

  constructor() {
    super()

    this.checked = false;
  }

  static styles = css `
    :host {
      display: flex;
    }

    label {
      font-family: 'Nunito', sans-serif;
      color: #333;
      margin-left: 8px;
      font-size: 1rem;
    }

    input {
      outline-color: var(--color-blue);
    }
  `

  render() {
    return html`
      <input ?checked=${this.checked} @change=${this.__change} type="checkbox" .id="${this.id}" .name="${this.name}" />
      <label for="${this.id}">${this.innerHTML}</label>
    `
  }

  __change (e) {
    this.checked = e.currentTarget.checked

    const event = new CustomEvent('change', {
      detail: { checked: this.checked, input: e.currentTarget},
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }
}

window.customElements.define('simple-checkbox', SimpleCheckbox)
