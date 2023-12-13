import { LitElement, css, html } from 'lit'

export class SimpleSelect extends LitElement {

  static properties = {
    placeholder: { type: String },
    value: { type: String },
    invalid: { type: Boolean },
    items: { type: Array }
  }

  static styles = css `
    :host {
      display: flex;
      position: relative;
    }

    input {
      float: none;
      position: relative;
      width: 100%;
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

    .select-container {
      position: absolute;
      top: 100%;
      left: 0px;
      border: 1px solid #d5d5d5;
      background: white;
      border-radius: 5px;
      display: none;
      flex-direction: column;
      width: calc(100% - 2px);
      border-top: 0px;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .select-container.open {
      display: flex;
    }

    .item {
      display: flex;
      padding: 12px 16px;
      cursor: pointer;
    }

    .item > p {
      margin: 0px;
      padding: 0px;
      color: #333;
      font-family: 'Nunito', sans-serif;
      user-select: none;
    }

    .item:nth-child(even) {
      background: #eee;
    }

    .item:hover {
      background: var(--color-blue);
    }

    .item:hover > p {
      color: white;
    }
  `

  constructor () {
    super ()
  }

  firstUpdated () {
    this.__setValue()
    this.__setMaxDrop()
  }

  render () {
    return html `
      <input class="${this.invalid === true ? `invalid` : ''}" id="input" type="text" .placeholder=${this.placeholder} @keyup=${this.__keypress}  @change=${this.__keypress} />
      <div class="select-container" id="drop-dow">
      </div>
    `
  }

  __setValue () {
    if (!this.value && this.value <= 0) return

    const item = this.items.filter(item => item[0] === this.value);
    this.shadowRoot.getElementById('input').value = item[0][1] + ', ' + item[0][2]
  }

  __setMaxDrop () {
    const endScreenPosY = window.innerHeight
    const startPostDropDown = this.shadowRoot.getElementById('drop-dow').getBoundingClientRect().y

    const maxSize = endScreenPosY - startPostDropDown - 25;
    this.shadowRoot.getElementById('drop-dow').style.maxHeight = maxSize + "px"
  }

  __blur () {
    this.shadowRoot.getElementById('drop-dow').classList.remove('open')
  }

  __keypress (e) {
    if (this.invalid === true) {
      this.invalid = false
    }

    const valueSearch = e.currentTarget.value
    if (valueSearch && valueSearch !== null && this.items) {
      var filterItems = this.items.filter(item => {
        const filter = item[1] + item[2]
        if (filter.toLowerCase().includes(valueSearch.toLowerCase().replace(' ', '').replace(/[^a-zA-Z0-9 ]/g, ''))) {
          return true
        } else {
          return false
        }
      })
    } else {
      var filterItems = []
    }

    this.shadowRoot.getElementById('drop-dow').classList.add('open')

    const parent = this.shadowRoot.getElementById('drop-dow');
    parent.innerHTML = ''
    filterItems.map (location => {
      const item = document.createElement('div')
      const p = document.createElement('p')
      item.appendChild(p)
      item.classList.add('item')
      item.value = location[0]
      p.innerHTML = `${location[1]}, ${location[2]}`
      item.addEventListener('click', this.__selectItem.bind(this))
      item.addEventListener('mouseenter', () => this.shadowRoot.getElementById('input').blur())
      parent.appendChild(item)
    })
  }

  __selectItem (e) {
    e.preventDefault()
    this.value = e.currentTarget.value
    if (this.value === 0) return
    const item = this.items.filter(item => item[0] === this.value);
    this.shadowRoot.getElementById('input').value = item[0][1] + ', ' + item[0][2]
    this.__blur()
  }
}
window.customElements.define('simple-select', SimpleSelect)
