import { fixture, html, expect } from '@open-wc/testing';
import '../../components/pagination-controls/pagination-controls';

describe('pagination-controls', () => {
  it('initializes with default values', async () => {
    const el = await fixture(html`<pagination-controls></pagination-controls>`);
    expect(el.currentPage).to.equal(1);
    expect(el.totalPages).to.equal(1);
  });

  it('returns correct page numbers for small totalPages', async () => {
    const el = await fixture(html`<pagination-controls .totalPages=${3}></pagination-controls>`);
    expect(el.getPageNumbers()).to.eql([1, 2, 3]);
  });

  it('returns correct page numbers for large totalPages', async () => {
    const el = await fixture(html`<pagination-controls .totalPages=${10} .currentPage=${6}></pagination-controls>`);
    expect(el.getPageNumbers()).to.eql([1, '...', 5, 6, 7, '...', 10]);
  });

  it('dispatches page-changed event on button click', async () => {
    const el = await fixture(html`<pagination-controls .totalPages=${3} .currentPage=${2}></pagination-controls>`);
    setTimeout(() => el._dispatchPageChange(3));
    const event = await new Promise(resolve => el.addEventListener('page-changed', resolve));
    expect(event).to.exist;
    expect(event.detail.page).to.equal(3);
  });
}); 