import { fixture, html, expect } from '@open-wc/testing';
import '../../components/add-employee-page/add-employee-page';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import { employeeService } from '../../services/employee-service.js';

describe('add-employee-page', () => {
  beforeEach(() => {
    window.showToast = () => {};
  });

  afterEach(() => {
    sinon.restore();
  });

  it('renders the page title', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);
    const title = el.shadowRoot.querySelector('.page-title');
    expect(title).to.exist;
  });

  it('renders the employee form', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);
    const form = el.shadowRoot.querySelector('employee-form');
    expect(form).to.exist;
  });

  it('opens confirm modal on form submit', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);
    el.handleFormSubmit({ detail: { formData: { name: 'Test' } } });
    expect(el.showConfirmModal).to.be.true;
    expect(el.pendingFormData).to.deep.equal({ name: 'Test' });
  });

  it('proceeds and closes confirm modal', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);
    el.pendingFormData = { name: 'Test' };
    el.showConfirmModal = true;
    sinon.stub(employeeService, 'addEmployee');
    const goStub = sinon.stub(Router, 'go');
    el.handleConfirmProceed();
    expect(el.showConfirmModal).to.be.false;
    expect(el.loading).to.be.false;
  });

  it('cancels confirm modal', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);
    el.showConfirmModal = true;
    el.pendingFormData = { name: 'Test' };
    el.handleConfirmCancel();
    expect(el.showConfirmModal).to.be.false;
    expect(el.pendingFormData).to.be.null;
  });

  it('cancels form and navigates away', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);
    const goStub = sinon.stub(Router, 'go');
    el.handleFormCancel();
    expect(goStub.calledWith('/')).to.be.true;
  });

  it('closes save modal and navigates away', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);
    const goStub = sinon.stub(Router, 'go');
    el.handleModalClose();
    expect(el.showSaveModal).to.be.false;
    expect(goStub.calledWith('/')).to.be.true;
  });

  it('handles error in handleConfirmProceed', async () => {
    const el = await fixture(html`<add-employee-page></add-employee-page>`);
    el.pendingFormData = { name: 'Test' };
    el.showConfirmModal = true;
    sinon.stub(employeeService, 'addEmployee').throws(new Error('fail'));
    const alertStub = sinon.stub(window, 'alert');
    el.handleConfirmProceed();
    expect(alertStub.called).to.be.true;
  });
});