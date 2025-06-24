import { fixture, html, expect } from '@open-wc/testing';
import '../../components/employee-form/employee-form';

describe('employee-form', () => {
  it('initializes with default form data', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el.formData.firstName).to.equal('');
    expect(el.formData.lastName).to.equal('');
    expect(el.formData.department).to.equal('Analytics');
    expect(el.formData.position).to.equal('Junior');
  });

  it('validates required fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.formData = { ...el.formData, firstName: '', lastName: '', email: '', dateOfEmployment: '', dateOfBirth: '', phone: '' };
    expect(el.validateForm()).to.be.false;
    expect(el.errors.firstName).to.equal('required');
    expect(el.errors.lastName).to.equal('required');
    expect(el.errors.email).to.equal('required');
    expect(el.errors.dateOfEmployment).to.equal('required');
    expect(el.errors.dateOfBirth).to.equal('required');
    expect(el.errors.phone).to.equal('required');
  });

  it('validates email format', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.formData = { ...el.formData, email: 'invalid-email', firstName: 'A', lastName: 'B', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '+(90) 123 456 78 90' };
    expect(el.validateForm()).to.be.false;
    expect(el.errors.email).to.equal('email');
  });

  it('resets form data', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.formData = { ...el.formData, firstName: 'A', lastName: 'B' };
    el.resetForm();
    expect(el.formData.firstName).to.equal('');
    expect(el.formData.lastName).to.equal('');
  });

  it('sets form data with setFormData', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.setFormData({ firstName: 'X', lastName: 'Y' });
    expect(el.formData.firstName).to.equal('X');
    expect(el.formData.lastName).to.equal('Y');
  });

  it('converts display date to input date', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el.displayToInputDate('01/02/2020')).to.equal('2020-02-01');
    expect(el.displayToInputDate('')).to.equal('');
    expect(el.displayToInputDate('2020-02-01')).to.equal('2020-02-01');
  });

  it('converts input date to display date', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el.inputToDisplayDate('2020-02-01')).to.equal('01/02/2020');
    expect(el.inputToDisplayDate('')).to.equal('');
    expect(el.inputToDisplayDate('invalid')).to.equal('invalid');
  });

  it('handles input change and clears error', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.errors = { firstName: 'required' };
    el.handleInputChange('firstName', { target: { value: 'A' } });
    expect(el.formData.firstName).to.equal('A');
    expect(el.errors.firstName).to.be.null;
  });

  it('handles input blur and sets error', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.formData.firstName = '';
    el.handleInputBlur('firstName');
    expect(el.errors.firstName).to.equal('required');
    el.formData.email = 'bad';
    el.handleInputBlur('email');
    expect(el.errors.email).to.equal('email');
  });

  it('handles phone input formatting', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const event = { target: { value: '+(90) 1234567890', setSelectionRange: () => {} } };
    el.handlePhoneInput(event);
    expect(el.formData.phone.startsWith('+(90)')).to.be.true;
  });

  it('dispatches form-submit event on valid submit', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.formData = { firstName: 'A', lastName: 'B', email: 'a@b.com', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phone: '+(90) 123 456 78 90', department: 'Tech', position: 'Junior' };
    const submitEvent = new Event('submit');
    let called = false;
    el.addEventListener('form-submit', () => { called = true; });
    el.handleSubmit({ preventDefault: () => {} });
    expect(called).to.be.true;
  });

  it('dispatches form-cancel event on cancel', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    let called = false;
    el.addEventListener('form-cancel', () => { called = true; });
    el.handleCancel();
    expect(called).to.be.true;
  });
}); 