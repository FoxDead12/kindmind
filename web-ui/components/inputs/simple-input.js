import { LitElement, css, html } from 'lit'

export class SimpleInput extends LitElement {

  static properties = {
    type: { type: String },
    placeholder: { type: String },
    required: { type: Boolean },
    value: { type: String }
  }

  constructor() {
    super()

    this.value = ''
  }

  static styles = css `
    :host {
      display: flex;
    }

    input {
      position: relative;
      width: 100%;
      padding: 12px 12px;
      font-size: 1rem;
      border: 1px solid #d5d5d5;
      border-radius: 5px;
      outline-color: var(--color-blue);
      font-family: 'Nunito', sans-serif;
      color: var(--color-black);
    }

    input::placeholder {
      color: #333;
    }
  `

  render() {
    return html`
      <input @change=${this.__change} .type=${this.type} .placeholder=${this.placeholder} .required=${this.required} .value=${this.value} />
    `
  }

  __change (e) {
    this.value = e.currentTarget.value

    const event = new CustomEvent('change', {
      detail: { value: this.value, input: e.currentTarget},
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }
}

window.customElements.define('simple-input', SimpleInput)
