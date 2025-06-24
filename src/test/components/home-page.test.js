import { fixture, html, expect } from '@open-wc/testing';
import '../../components/home-page/home-page';
import sinon from 'sinon';
import { employeeService } from '../../services/employee-service.js';

describe('home-page', () => {
  beforeEach(() => {
    window.showToast = () => {};
  });

  afterEach(() => {
    sinon.restore();
  });

  it('renders the page title', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    const title = el.shadowRoot.querySelector('.page-title');
    expect(title).to.exist;
  });

  it('renders search input', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    const input = el.shadowRoot.querySelector('.search-input');
    expect(input).to.exist;
  });

  it('changes view mode', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    el.handleViewModeChange('list');
    expect(el.viewMode).to.equal('list');
    el.handleViewModeChange('table');
    expect(el.viewMode).to.equal('table');
  });

  it('loads employees and filters', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    sinon.stub(employeeService, 'getAllEmployees').returns([
      { id: '1', firstName: 'A', department: 'Tech', position: 'Junior' },
      { id: '2', firstName: 'B', department: 'Analytics', position: 'Senior' }
    ]);
    el.loadEmployees();
    expect(el.employees.length).to.be.at.least(2);
  });

  it('filters employees by search', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    el.employees = [
      { id: '1', firstName: 'Alice', department: 'Tech', position: 'Junior' },
      { id: '2', firstName: 'Bob', department: 'Analytics', position: 'Senior' }
    ];
    sinon.stub(employeeService, 'searchEmployees').returns([{ id: '2', firstName: 'Bob', department: 'Analytics', position: 'Senior' }]);
    el.searchQuery = 'Bob';
    el.filterEmployees();
    expect(el.filteredEmployees.length).to.equal(1);
    expect(el.filteredEmployees[0].firstName).to.equal('Bob');
  });

  it('handles page change', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    el.currentPage = 1;
    el.handlePageChanged({ detail: { page: 2 } });
    expect(el.currentPage).to.equal(2);
  });

  it('handles sort requested', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    el.sortField = 'firstName';
    el.sortDirection = 'asc';
    el.handleSortRequested({ detail: { field: 'firstName' } });
    expect(el.sortDirection).to.equal('desc');
    el.handleSortRequested({ detail: { field: 'lastName' } });
    expect(el.sortField).to.equal('lastName');
    expect(el.sortDirection).to.equal('asc');
  });

  it('handles employee deleted', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    sinon.stub(employeeService, 'deleteEmployee');
    sinon.stub(el, 'loadEmployees');
    el.handleEmployeeDeleted({ detail: { id: '1' } });
    expect(employeeService.deleteEmployee.calledWith('1')).to.be.true;
    expect(el.loadEmployees.called).to.be.true;
  });

  it('handles selection changed', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    el.handleSelectionChanged({ detail: { selectedEmployees: ['1', '2'] } });
    expect(el.selectedEmployees).to.deep.equal(['1', '2']);
  });

  it('renders loading state', async () => {
    const el = await fixture(html`<home-page></home-page>`);
    el.loading = true;
    await el.updateComplete;
    expect(el.shadowRoot.textContent).to.include('Loading');
  });
}); 