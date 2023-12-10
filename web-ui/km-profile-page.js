import { LitElement, css, html } from 'lit'
import { user } from './svgs/user'
import { location } from './svgs/location'
import { pencil } from './svgs/pencil'

export class KmProfile extends LitElement {

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
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0px 0px 15px 1px rgba(0,0,0,0.05);
    }

    .container > .sub-title {
      position: relative;
      font-family: 'Nunito', sans-serif;
      color: #333;
      margin: 0px;
      padding: 0px;
      font-size: 1.3rem;
      display: flex;
    }

    .container > .content {
      font-family: 'Nunito', sans-serif;
      color: #333;
      margin: 0px;
      padding: 0px;
      font-size: 1rem;
      margin-top: 16px;
    }

    .container > .list-skills {
      list-style: none;
      margin: 0px;
      padding: 0px;
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .container > .list-skills > li {
      font-family: 'Nunito', sans-serif;
      color: #333;
      border: 1px solid var(--color-blue);
      color: var(--color-blue);
      padding: 8px 16px;
      border-radius: 50px;
    }

    .row {
      margin: 0px 25px;
      display: grid;
      grid-template-columns: auto 70%;
      gap: 25px;
    }

    .row .container {
      margin: 0px;
    }

    .container.first {
      display: flex;
    }

    .user-image {
      display: flex;
      position: relative;
      width: 88px;
      height: 88px;
      border-radius: 50%;
      box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.1);
      cursor: pointer;
      background: transparent;
    }

    .user-image > svg {
      color: #333;
    }

    .user-name {
      margin: 0px;
      padding: 0px;
      font-family: 'Nunito', sans-serif;
      font-size: 2.3rem;
      font-weight: 600;
      color: #333;
      margin-left: 25px;
    }

    .location-icon {
      display: flex;
      position: relative;
      width: 24px;
      height: 24px;
    }

    .location-info {
      display: flex;
      align-items: center;
      justify-content: start;
      margin-left: 25px;
      color: #7e8d97;
      margin-top: 4px;
    }

    .location-info > h5 {
      margin: 0px;
      padding: 0px;
      font-family: 'Nunito', sans-serif;
      margin-left: 4px;
      font-size: 1rem;
      font-weight: 600;
    }

    .sub-title-row {
      font-family: 'Nunito', sans-serif;
      font-weight: 600;
      font-size: 1.3rem;
      margin: 0px;
      padding: 0px;
      color: #333;
      font-weight: bold;
    }

    .sub-title-row  > span {
    }

    .icon {
      position: relative;
      display: flex;
      width: 17px;
      height: 17px;
      border: 2px solid var(--color-blue);
      color: var(--color-blue);
      border-radius: 32px;
      padding: 4px;
      margin-left: 12px;
      cursor: pointer;
    }

    .icon > svg {
      stroke-width: 2;
    }
  `

  constructor () {
    super ()
  }

  render () {
    return html `
      <div class="container first">
        ${app.session_data.image_url ? html `
          <img class="user-image" src="https://www.upwork.com/profile-portraits/c1suxN8lNHIVHLSdWrZSD3EssUCtNOIq2Ogfkt2exMHN8Kd_RkcFJapqlxjKmlbVkq"/>
        ` : html `
          <span class="user-image">${user}</span>
        `}

        <div>
          <h5 class="user-name">David Jose da Costa Xavier</h5>
          <div class="location-info">
            <span class="location-icon">
              ${location}
            </span>
            <h5>Portugal, Porto</h5>
          </div>
        </div>
      </div>

      <div class="container">
          <h4 class="sub-title">Description <span class="icon">${pencil}</span></h4>
          <p class="content">É um facto estabelecido de que um leitor é distraído pelo conteúdo legível de uma página quando analisa a sua mancha gráfica. Logo, o uso de Lorem Ipsum leva a uma distribuição mais ou menos normal de letras, ao contrário do uso de "Conteúdo aqui, conteúdo aqui", tornando-o texto legível. Muitas ferramentas de publicação electrónica e editores de páginas web usam actualmente o Lorem Ipsum como o modelo de texto usado por omissão, e uma pesquisa por "lorem ipsum" irá encontrar muitos websites ainda na sua infância. Várias versões têm evoluído ao longo dos anos, por vezes por acidente, por vezes propositadamente (como no caso do humor).</p>

          <br><br>
          <h4 class="sub-title">Skills <span class="icon">${pencil}</span></h4>
          <ul class="list-skills">
            <li>Matematica</li>
            <li>Matematica</li>
            <li>Matematica</li>
            <li>Matematica</li>
            <li>Matematica</li>
          </ul>
        </div>

      <!-- <div class="row">
        <div class="container">
          <h4 class="sub-title-row">Hour/Class: <span>12€<span></h4>
        </div>

        <div class="container">
          <h4 class="sub-title">Description</h4>
          <p class="content">É um facto estabelecido de que um leitor é distraído pelo conteúdo legível de uma página quando analisa a sua mancha gráfica. Logo, o uso de Lorem Ipsum leva a uma distribuição mais ou menos normal de letras, ao contrário do uso de "Conteúdo aqui, conteúdo aqui", tornando-o texto legível. Muitas ferramentas de publicação electrónica e editores de páginas web usam actualmente o Lorem Ipsum como o modelo de texto usado por omissão, e uma pesquisa por "lorem ipsum" irá encontrar muitos websites ainda na sua infância. Várias versões têm evoluído ao longo dos anos, por vezes por acidente, por vezes propositadamente (como no caso do humor).</p>

          <br><br>
          <h4 class="sub-title">Skills</h4>
          <ul class="list-skills">
            <li>Matematica</li>
            <li>Matematica</li>
            <li>Matematica</li>
            <li>Matematica</li>
            <li>Matematica</li>
          </ul>
        </div>

      </div> -->
    `
  }
}
window.customElements.define('km-profile-page', KmProfile)
