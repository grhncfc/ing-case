import { fixture, html, expect } from '@open-wc/testing';
import '../../components/app-navbar/app-navbar';

describe('app-navbar', () => {
  it('renders the logo', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    const logo = el.shadowRoot.querySelector('.logo');
    expect(logo).to.exist;
  });

  it('renders language switcher', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    const switcher = el.shadowRoot.querySelector('.language-switcher');
    expect(switcher).to.exist;
  });
}); 