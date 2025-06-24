import { fixture, html, expect } from '@open-wc/testing';
import '../../components/edit-employee-page/edit-employee-page';
import sinon from 'sinon';
import { employeeService } from '../../services/employee-service.js';
import { Router } from '@vaadin/router';

describe('edit-employee-page', () => {
  beforeEach(() => {
    window.showToast = () => {};
  });

  afterEach(() => {
    sinon.restore();
  });

  it('renders loading state', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.loading = true;
    await el.updateComplete;
    expect(el.shadowRoot.textContent).to.include('Loading');
  });

  it('renders not found state', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.loading = false;
    el.notFound = true;
    await el.updateComplete;
    expect(el.shadowRoot.textContent).to.include('Not Found');
  });

  it('loads employee and renders form', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.employeeId = '1';
    sinon.stub(employeeService, 'getEmployeeById').returns({ id: '1', firstName: 'A', lastName: 'B' });
    await el.loadEmployee();
    expect(el.employee).to.deep.equal({ id: '1', firstName: 'A', lastName: 'B' });
  });

  it('handles form submit and opens confirm modal', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.handleFormSubmit({ detail: { formData: { name: 'Test' } } });
    expect(el.showConfirmModal).to.be.true;
    expect(el.pendingFormData).to.deep.equal({ name: 'Test' });
  });

  it('proceeds and closes confirm modal', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.employeeId = '1';
    el.pendingFormData = { name: 'Test' };
    el.showConfirmModal = true;
    sinon.stub(employeeService, 'updateEmployee').returns({ id: '1', name: 'Test' });
    const goStub = sinon.stub(Router, 'go');
    el.handleConfirmProceed();
    expect(el.showConfirmModal).to.be.false;
    expect(el.loading).to.be.false;
  });

  it('handles error in handleConfirmProceed', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.employeeId = '1';
    el.pendingFormData = { name: 'Test' };
    el.showConfirmModal = true;
    sinon.stub(employeeService, 'updateEmployee').throws(new Error('fail'));
    const alertStub = sinon.stub(window, 'alert');
    el.handleConfirmProceed();
    expect(alertStub.called).to.be.true;
  });

  it('cancels confirm modal', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.showConfirmModal = true;
    el.pendingFormData = { name: 'Test' };
    el.handleConfirmCancel();
    expect(el.showConfirmModal).to.be.false;
    expect(el.pendingFormData).to.be.null;
  });

  it('cancels form and navigates away', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    const goStub = sinon.stub(Router, 'go');
    el.handleFormCancel();
    expect(goStub.calledWith('/')).to.be.true;
  });

  it('opens and cancels delete modal', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.handleDelete();
    expect(el.showDeleteModal).to.be.true;
    el.handleDeleteCancel();
    expect(el.showDeleteModal).to.be.false;
  });

  it('confirms delete and navigates away', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.employeeId = '1';
    sinon.stub(employeeService, 'deleteEmployee');
    const goStub = sinon.stub(Router, 'go');
    el.handleDeleteConfirm();
    expect(el.showDeleteModal).to.be.false;
  });

  it('handles error in handleDeleteConfirm', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    el.employeeId = '1';
    sinon.stub(employeeService, 'deleteEmployee').throws(new Error('fail'));
    const alertStub = sinon.stub(window, 'alert');
    el.handleDeleteConfirm();
    expect(alertStub.called).to.be.true;
  });

  it('closes deleted modal and navigates away', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    const goStub = sinon.stub(Router, 'go');
    el.handleDeletedModalClose();
    expect(el.showDeletedModal).to.be.false;
    expect(goStub.calledWith('/')).to.be.true;
  });

  it('closes save modal and navigates away', async () => {
    const el = await fixture(html`<edit-employee-page></edit-employee-page>`);
    const goStub = sinon.stub(Router, 'go');
    el.handleModalClose();
    expect(el.showSaveModal).to.be.false;
    expect(goStub.calledWith('/')).to.be.true;
  });
}); 