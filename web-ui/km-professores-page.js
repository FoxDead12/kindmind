import { LitElement, css, html } from 'lit'

export class Professores extends LitElement {

  static properties = {
  }

  static styles = css `
    :host {
      position: relative;
      width: 1250px;
      margin: 0px auto;
      display: flex;
      flex-direction: column;
    }

    .professores-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-auto-rows: 400px;
      gap: 25px;
      justify-content: center;
      padding: 25px;
    }

    .filter-container {
      padding: 0px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .filter-container h5 {
      font-family: 'Nunito', sans-serif;
      color: #333;
      font-size: 2rem;
      padding: 0px;
      margin: 0px;
    }
  `

  constructor () {
    super ();

  }

  firstUpdated () {
    // EXECUTE REQUEST TO GET PROFESSORES
  }

  render () {
    return html `
      <div class="filter-container">
        <h5>Teachers</h5>
      </div>

      <div class="professores-container">
        <!-- PROFESSORES -->
        <professor-card></professor-card>
        <professor-card></professor-card>
        <professor-card></professor-card>
        <professor-card></professor-card>
        <professor-card></professor-card>
        <professor-card></professor-card>
        </a>
      </div>
    `
  }
}
window.customElements.define('km-professores-page', Professores)


class ProfessorCard extends LitElement {

  static properties = {
    data: { type: Object }
  }

  static styles = css `
    :host {
      position: relative;
      display: flex;
    }

    a {
      position: relative;
      width: 100%;
      background: white;
      border-radius: 10px;
      box-shadow: 0px 0px 10px 5px rgba(69,123,159,0.1);
      overflow: hidden;
      padding: 24px;
      cursor: pointer;
    }

    a:hover {
      background: rgba(69,123,159,0.1);
    }

    img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 5px;
    }

    .container {
      display: flex;
      justify-content: normal;
      align-items: center;
    }

    h5 {
      font-family: 'Nunito', sans-serif;
      color: #333;
      font-size: 17px;
      padding: 0px;
      margin: 0px;
      margin-left: 15px;
      align-items: center;
      font-weight: 500;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    h4 {
      font-family: 'Nunito', sans-serif;
      color: #333;
      font-size: 24px;
      padding: 0px;
      margin: 0px;
      margin-left: 15px;
      align-items: center;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .description-content {
      padding: 0px;
      margin: 0px;
      margin-top: 32px;
      font-family: 'Nunito', sans-serif;
      color: #333;
      font-size: 16px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3; /* number of lines to show */
      line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .skills-container {
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      max-height: 40px;
      gap: 8px;
      position: relative;
    }

    .skill {
      border: 1px solid var(--color-blue);
      flex: none;
      padding: 8px 16px;
      font-family: 'Nunito', sans-serif;
      color: var(--color-blue);
      border-radius: 20px;
      word-wrap: break-word;
    }

    .hidden {
      display: none !important;
    }
  `

  constructor () {
    super ()
  }

  firstUpdated () {
    this.__skillListManager()
  }

  render () {
    return html `
      <a>
        <div class="container">
          <img src="https://www.upwork.com/profile-portraits/c1suxN8lNHIVHLSdWrZSD3EssUCtNOIq2Ogfkt2exMHN8Kd_RkcFJapqlxjKmlbVkq" />
          <div>
            <h4>David Jose da Costa Xavier</h4>
            <h5>Portugal, Porto</h5>
          </div>
        </div>

        <p class="description-content">Ensino Matemática, Física e Estatística. Formado na FEUP e MIT em Engenharia Mecânica e Dados c/ experiência como Investigador nas melhores universidades da Alemanha (RWTH, TUM e Darmstadt) Ensino Matemática, Física e Estatística. Formado na FEUP e MIT em Engenharia Mecânica e Dados c/ experiência como Investigador nas melhores universidades da Alemanha (RWTH, TUM e Darmstadt)</p>

        <div class="skills-container" id="skills-list">
          <div class="skill">Matemática</div>
          <div class="skill">Álgebra</div>
          <div class="skill">Fisica</div>
          <div class="skill">Inteligencia Artificial</div>
        </div>
      </a>
    `
  }

  __skillListManager () {
    const widthList = this.shadowRoot.getElementById('skills-list').offsetWidth;
    const lastItemWidth = 61; // MAX WIDTH OF LAST ELEMENT
    let diffWidth = widthList - lastItemWidth - (this.shadowRoot.getElementById('skills-list').children.length * 8)
    let array = [...this.shadowRoot.getElementById('skills-list').children]

    let count = this.shadowRoot.getElementById('skills-list').children.length
    for (const children of array) {
      const temp = diffWidth - children.offsetWidth;
      if (temp < 0) {
        children.classList.add('hidden')
      } else {
        count--
      }

      diffWidth -= children.offsetWidth
    }

    const div = document.createElement('div')
    div.innerHTML = count + '+'
    div.classList.add('skill')
    this.shadowRoot.getElementById('skills-list').appendChild(div)
  }
}
window.customElements.define('professor-card', ProfessorCard)
