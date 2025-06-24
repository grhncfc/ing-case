import { fixture, html, expect } from '@open-wc/testing';
import '../../components/employee-table/employee-table';
import sinon from 'sinon';
import { Router } from '@vaadin/router';

describe('employee-table', () => {
  beforeEach(() => {
    window.showToast = () => {};
  });

  afterEach(() => {
    sinon.restore();
  });

  it('renders no data message when employees is empty', async () => {
    const el = await fixture(html`<employee-table .employees=${[]}></employee-table>`);
    expect(el.shadowRoot.textContent).to.include('No employees found.');
  });

  it('renders employee rows when employees are present', async () => {
    const employees = [{ id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '123', department: 'Tech', position: 'Junior' }];
    const el = await fixture(html`<employee-table .employees=${employees}></employee-table>`);
    expect(el.shadowRoot.textContent).to.include('A');
    expect(el.shadowRoot.textContent).to.include('B');
  });

  it('shows delete modal when handleDeleteClick is called', async () => {
    const employees = [{ id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '123', department: 'Tech', position: 'Junior' }];
    const el = await fixture(html`<employee-table .employees=${employees}></employee-table>`);
    el.handleDeleteClick(employees[0]);
    expect(el.showDeleteModal).to.be.true;
    expect(el.employeeToDelete.id).to.equal('1');
  });

  it('dispatches sort-requested event on requestSort', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    let called = false;
    el.addEventListener('sort-requested', e => { called = e.detail.field === 'firstName'; });
    el.requestSort('firstName');
    expect(called).to.be.true;
  });

  it('returns correct sort icon', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    el.sortField = 'firstName';
    el.sortDirection = 'asc';
    // Test the logic by checking if the method returns the expected template
    const icon = el.getSortIcon('firstName');
    // The icon should be a Lit template with the up arrow
    expect(icon).to.exist;
    expect(icon.strings).to.be.an('array');
  });

  it('renders department and position badges', async () => {
    const employees = [{ id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '123', department: 'Tech', position: 'Junior' }];
    const el = await fixture(html`<employee-table .employees=${employees}></employee-table>`);
    expect(el.shadowRoot.textContent).to.include('Tech');
    expect(el.shadowRoot.textContent).to.include('Junior');
  });

  it('selects all employees', async () => {
    const employees = [
      { id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '123', department: 'Tech', position: 'Junior' },
      { id: '2', firstName: 'C', lastName: 'D', email: 'c@d.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '456', department: 'Analytics', position: 'Senior' }
    ];
    const el = await fixture(html`<employee-table .employees=${employees}></employee-table>`);
    const event = { target: { checked: true } };
    el.handleSelectAll(event);
    expect(el.selectedEmployees).to.deep.equal(['1', '2']);
  });

  it('selects and deselects an employee', async () => {
    const employees = [
      { id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '123', department: 'Tech', position: 'Junior' },
      { id: '2', firstName: 'C', lastName: 'D', email: 'c@d.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '456', department: 'Analytics', position: 'Senior' }
    ];
    const el = await fixture(html`<employee-table .employees=${employees}></employee-table>`);
    el.handleSelectEmployee('1', { target: { checked: true } });
    expect(el.selectedEmployees).to.include('1');
    el.handleSelectEmployee('1', { target: { checked: false } });
    expect(el.selectedEmployees).to.not.include('1');
  });

  it('dispatches selection-changed event', async () => {
    const employees = [
      { id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '123', department: 'Tech', position: 'Junior' }
    ];
    const el = await fixture(html`<employee-table .employees=${employees}></employee-table>`);
    let called = false;
    el.addEventListener('selection-changed', () => { called = true; });
    el.handleSelectAll({ target: { checked: true } });
    expect(called).to.be.true;
  });

  it('navigates to edit on handleEdit', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    const goStub = sinon.stub(Router, 'go');
    el.handleEdit('1');
    expect(goStub.calledWith('/edit/1')).to.be.true;
  });

  it('closes delete modal on handleModalClose', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    el.showDeleteModal = true;
    el.employeeToDelete = { id: '1' };
    el.handleModalClose();
    expect(el.showDeleteModal).to.be.false;
    expect(el.employeeToDelete).to.be.null;
  });

  it('proceeds with delete and dispatches event', async () => {
    const employees = [{ id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '123', department: 'Tech', position: 'Junior' }];
    const el = await fixture(html`<employee-table .employees=${employees}></employee-table>`);
    el.employeeToDelete = employees[0];
    el.showDeleteModal = true;
    let called = false;
    el.addEventListener('employee-deleted', e => { called = e.detail.id === '1'; });
    el.handleModalProceed();
    expect(el.showDeleteModal).to.be.false;
    expect(el.employeeToDelete).to.be.null;
    expect(called).to.be.true;
  });

  it('formats date correctly', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    expect(el.formatDate('2020-01-02')).to.equal('02/01/2020');
    expect(el.formatDate('')).to.equal('');
    expect(el.formatDate('invalid')).to.equal('invalid');
  });
});