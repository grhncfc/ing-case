import { LitElement, html, css } from 'lit';
import styles from './toast-message.css?inline';

export class ToastMessage extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    message: { type: String },
    duration: { type: Number },
  };

  static styles = css([`${styles}`]);

  constructor() {
    super();
    this.open = false;
    this.message = '';
    this.duration = 2500;
    this._timeout = null;
  }

  show(message, duration = 2500) {
    this.message = message;
    this.duration = duration;
    this.open = true;
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      this.open = false;
    }, this.duration);
  }

  render() {
    return html`
      <div class="toast">${this.message}</div>
    `;
  }
}

customElements.define('toast-message', ToastMessage); 