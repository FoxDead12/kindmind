import { LitElement, css, html } from 'lit'

class SimpleTextArea extends LitElement {

  static properties = {
    placeholder: { type: String },
    required: { type: Boolean },
    value: { type: String },
    invalid: { type: Boolean },
    rows: { type: Int8Array }
  }

  static styles = css `
    :host {
      display: flex;
    }

    textarea {
      float: none;
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

    .invalid {
      outline-color: var(--color-red);
      border: 1px solid var(--color-red);
    }

    input::placeholder {
      color: #333;
    }
  `

  constructor () {
    super ()

    this.value = ''
    this.invalid = false
  }

  render () {
    return html `
      <textarea class="${this.invalid === true ? `invalid` : ''}" @keypress=${this.__keypress} @focus=${this.__focus} @blur=${this.__blur} @change=${this.__change} rows="${this.rows}" cols="50" .placeholder=${this.placeholder} .required=${this.required} .value=${this.value}></textarea>
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

  __focus (e) {
    if (this.type === 'date') {
      e.currentTarget.type = 'date'
    }
  }

  __blur (e) {
    if (this.type === 'date') {
      if (this.value === '') {
        e.currentTarget.type = 'text'
      }
    }
  }

  __keypress (e) {
    if (this.invalid === true) {
      this.invalid = false
    }
  }
}
window.customElements.define('simple-text-area', SimpleTextArea)
