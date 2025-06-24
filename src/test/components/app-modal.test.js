import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../../components/app-modal/app-modal';

describe('app-modal', () => {
  it('renders title, content, and actions slots', async () => {
    const el = await fixture(html`
      <app-modal open>
        <span slot="title">Test Title</span>
        <span slot="content">Test Content</span>
        <button slot="actions">Action</button>
      </app-modal>
    `);

    const titleSlot = el.shadowRoot.querySelector('slot[name="title"]');
    const contentSlot = el.shadowRoot.querySelector('slot[name="content"]');
    const actionsSlot = el.shadowRoot.querySelector('slot[name="actions"]');
    expect(titleSlot).to.exist;
    expect(contentSlot).to.exist;
    expect(actionsSlot).to.exist;

    const titleNodes = titleSlot.assignedNodes({ flatten: true });
    const contentNodes = contentSlot.assignedNodes({ flatten: true });
    expect(titleNodes.some(n => n.textContent.includes('Test Title'))).to.be.true;
    expect(contentNodes.some(n => n.textContent.includes('Test Content'))).to.be.true;
  });

  it('dispatches modal-closed event on close', async () => {
    const el = await fixture(html`<app-modal open></app-modal>`);
    setTimeout(() => el.close());
    const event = await oneEvent(el, 'modal-closed');
    expect(event).to.exist;
  });

  it('does not render when not open', async () => {
    const el = await fixture(html`<app-modal></app-modal>`);
    expect(el.shadowRoot.innerHTML.replace(/<!---->/g, '').replace(/<!--\?-->/g, '').trim()).to.equal('');
  });
}); 