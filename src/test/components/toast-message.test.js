import { fixture, html, expect } from '@open-wc/testing';
import '../../components/toast-message/toast-message';

describe('toast-message', () => {
  it('initializes with default values', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);
    expect(el.open).to.be.false;
    expect(el.message).to.equal('');
    expect(el.duration).to.equal(2500);
  });

  it('shows a message and closes after duration', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);
    el.show('Hello', 100);
    expect(el.open).to.be.true;
    expect(el.message).to.equal('Hello');
    expect(el.duration).to.equal(100);
    await new Promise(r => setTimeout(r, 120));
    expect(el.open).to.be.false;
  });

  it('renders the message in the DOM', async () => {
    const el = await fixture(html`<toast-message .open=${true} message="Test"></toast-message>`);
    expect(el.shadowRoot.textContent).to.include('Test');
  });
}); 