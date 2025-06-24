import { LitElement, html, css } from 'lit';

export class NotFoundPage extends LitElement {
  static styles = css`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
      text-align: center;
    }
    h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    a {
      color: #ff6200;
      text-decoration: underline;
      font-size: 1.2rem;
    }
  `;

  render() {
    return html`
      <div class="not-found-container">
        <h1>404</h1>
        <p>Page Not Found</p>
        <a href="/">Go to Home</a>
      </div>
    `;
  }
}

customElements.define('not-found-page', NotFoundPage); 