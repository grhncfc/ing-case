import { LitElement, html, css } from 'lit';
import styles from './pagination-controls.css?inline';

export class PaginationControls extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
  }

  static styles = css([`${styles}`]);

  getPageNumbers() {
    const total = this.totalPages;
    if (total <= 1) return [];
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const current = this.currentPage;
    if (current < 5) return [1, 2, 3, 4, 5, '...', total];
    if (current > total - 4) {
      const pages = [];
      for (let i = total - 4; i <= total; i++) pages.push(i);
      return [1, '...', ...pages];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  }

  _dispatchPageChange(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.dispatchEvent(new CustomEvent('page-changed', { detail: { page } }));
  }

  render() {
    if (this.totalPages <= 1) {
      return html``;
    }

    return html`
      <div class="pagination-controls">
        <button
          class="pagination-btn arrow"
          ?disabled=${this.currentPage === 1}
          @click=${() => this._dispatchPageChange(this.currentPage - 1)}
        >
          &lt;
        </button>

        ${this.getPageNumbers().map(pageNum =>
          typeof pageNum === 'string'
            ? html`<span class="pagination-dots">...</span>`
            : html`
                <button
                  class="pagination-btn ${pageNum === this.currentPage ? 'active' : ''}"
                  @click=${() => this._dispatchPageChange(pageNum)}
                >
                  ${pageNum}
                </button>
              `
        )}

        <button
          class="pagination-btn arrow"
          ?disabled=${this.currentPage === this.totalPages}
          @click=${() => this._dispatchPageChange(this.currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    `;
  }
}

customElements.define('pagination-controls', PaginationControls); 