import { LitElement, html, css } from 'lit';
import styles from './app-modal.css?inline';

export class AppModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
  };

  static styles = css([`${styles}`]);

  constructor() {
    super();
    this.open = false;
  }

  close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('modal-closed', { bubbles: true, composed: true }));
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div class="modal" role="dialog" aria-modal="true" tabindex="-1">
        <button class="close-btn" @click=${this.close} aria-label="Close">&times;</button>
        <div class="modal-title">
          <slot name="title"></slot>
        </div>
        <div class="modal-content">
          <slot name="content"></slot>
        </div>
        <div class="modal-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('app-modal', AppModal); 