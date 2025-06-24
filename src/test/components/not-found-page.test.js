import { fixture, html, expect } from '@open-wc/testing';
import '../../components/not-found-page/not-found-page';

describe('NotFoundPage', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<not-found-page></not-found-page>`);
  });

  it('renders 404 heading', () => {
    const h1 = element.shadowRoot ? element.shadowRoot.querySelector('h1') : element.querySelector('h1');
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('404');
  });

  it('renders Page Not Found text', () => {
    const p = element.shadowRoot ? element.shadowRoot.querySelector('p') : element.querySelector('p');
    expect(p).to.exist;
    expect(p.textContent).to.match(/Page Not Found/i);
  });

  it('renders Go to Home link', () => {
    const a = element.shadowRoot ? element.shadowRoot.querySelector('a') : element.querySelector('a');
    expect(a).to.exist;
    expect(a.getAttribute('href')).to.equal('/');
    expect(a.textContent).to.match(/Go to Home/i);
  });
}); 