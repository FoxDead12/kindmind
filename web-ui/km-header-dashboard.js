import { LitElement, css, html } from 'lit'
import {home} from './svgs/home'
import {calendar} from './svgs/calendar'
import {people} from './svgs/people'
import {message} from './svgs/message'
import {user} from './svgs/user'
import {groupPeople} from './svgs/user-group'

export class KmHeaderDashboard extends LitElement {
  static properties = {
    navigation: { type: Array }
  }

  static styles = css `
    :host {
      position: relative;
      background: #fff;
      width: 100%;
    }

    .container {
      width: 800px;
      margin: 22px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      margin: 0px;
      padding: 0px;
      font-size: 1.3rem;
      font-family: 'Nunito', sans-serif;
      color: white;
      font-weight: 800;
      letter-spacing: 2px;
      margin-left: 12px;
      line-height: 1rem;
    }

    .title > span {
      font-size: 1rem;
      color: var(--color-green);
    }

    ul {
      position: relative;
      list-style: none;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 32px;
      margin: 0px;
      padding: 0px;
    }

    ul li {
      position: relative;
      font-size: 1rem;
      margin: 0px;
      padding-left: 0px;
      display: flex;
      justify-content: start;
      align-items: center;
      cursor: pointer;
    }

    li p {
      z-index: 1;
      margin: 0px;
      padding: 0px;
      color: var(--color-black);
      font-family: 'Nunito', sans-serif;
      font-weight: 600;
      font-size: 15px;
    }

    li svg {
      z-index: 1;
      width: 18px;
      height: 18px;
    }

    li span {
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    ul li:hover {
      color: var(--color-blue);
    }

    ul li:hover p {
      color: var(--color-blue);
    }

    .user-content {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .user-image {
      position: relative;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.1);
      cursor: pointer;
      background: transparent;
    }

    .user-image > svg {
      color: var(--color-black);
    }
  `

  constructor () {
    super ();
  }

  firstUpdated () {
    this.__generateHeader()
  }

  render () {
    return html `
      <div class="container">
        <ul id="list">
        </ul>

        <div class="user-content">
          <img class="user-image" src="https://www.upwork.com/profile-portraits/c1suxN8lNHIVHLSdWrZSD3EssUCtNOIq2Ogfkt2exMHN8Kd_RkcFJapqlxjKmlbVkq"/>
          <!-- <span class="user-image">${user}</span> -->
        </div>
      </div>
    `
  }

  __generateHeader () {
    const parent = this.shadowRoot.getElementById('list');
    this.navigation.map (ng => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      const p = document.createElement('p');

      li.appendChild(span);
      li.appendChild(p);
      p.innerText = ng.name

      switch (ng.icon) {
        case 'home':
          span.innerHTML = home.strings
          break;
        case 'calendar':
          span.innerHTML = calendar.strings
          break;
        case 'people':
          span.innerHTML = people.strings
          break;
        case 'message':
          span.innerHTML = message.strings
          break;
        case 'groupPeople':
          span.innerHTML = groupPeople.strings
          break;
      }

      li.addEventListener('click', this.__clickHeader)
      li.href = ng.route
      parent.appendChild(li)
    })
  }

  __clickHeader (e) {
    if (e.currentTarget.href) {
      app.changeRoute(e.currentTarget.href)
    }
  }
}
window.customElements.define('km-header-dashboard', KmHeaderDashboard)
