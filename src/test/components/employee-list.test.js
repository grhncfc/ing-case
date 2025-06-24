import { fixture, html, expect } from '@open-wc/testing';
import '../../components/employee-list/employee-list';

describe('employee-list', () => {
  it('renders no data message when employees is empty', async () => {
    const el = await fixture(html`<employee-list .employees=${[]}></employee-list>`);
    expect(el.shadowRoot.textContent).to.include('No employees found.');
  });

  it('renders employee cards when employees are present', async () => {
    const employees = [{ id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '123', department: 'Tech', position: 'Junior' }];
    const el = await fixture(html`<employee-list .employees=${employees}></employee-list>`);
    expect(el.shadowRoot.textContent).to.include('A B');
  });

  it('shows delete modal when handleDelete is called', async () => {
    const employees = [{ id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '123', department: 'Tech', position: 'Junior' }];
    const el = await fixture(html`<employee-list .employees=${employees}></employee-list>`);
    el.handleDelete('1');
    expect(el.showDeleteModal).to.be.true;
    expect(el.employeeToDelete.id).to.equal('1');
  });
}); 