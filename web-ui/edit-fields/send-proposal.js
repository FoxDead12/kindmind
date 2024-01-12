import { LitElement, css, html } from 'lit'
import '../components/inputs/simple-input'
import '../components/inputs/simple-text-area'

export class SendProposal extends LitElement {

  static properties = {
    load: { type: Boolean },
    parent: { type: LitElement },
    data: {type: Object}
  }

  constructor () {
    super ()

    this.load = true
    app.closeLoader()
  }

  firstUpdated () {
  }

  render () {
    return html `
      <simple-input id="date" type="date" placeholder="Choose a day" required></simple-input>
      <simple-input id="time" type="time" placeholder="Choose a hour" required></simple-input>

      <simple-text-area id="description" placeholder="Write a message to teacher about what you want"></simple-text-area>
    `
  }

}
window.customElements.define('send-proposal', SendProposal)
