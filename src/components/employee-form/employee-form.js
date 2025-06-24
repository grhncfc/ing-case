import { LitElement, html, css } from 'lit';
import { i18n } from '../../i18n/i18n.js';
import styles from './employee-form.css?inline';

export class EmployeeForm extends LitElement {
  static properties = {
    formData: { type: Object },
    errors: { type: Object },
    loading: { type: Boolean },
    mode: { type: String }, // 'add' or 'edit'
  };

  constructor() {
    super();
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: 'Analytics',
      position: 'Junior'
    };
    this.errors = {};
    this.loading = false;
    this.mode = 'add';
  }

  static styles = css([`${styles}`]);

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this._handleLanguageChangeBound = this.handleLanguageChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this._handleLanguageChangeBound);
  }

  handleLanguageChange() {
    this.requestUpdate();
  }

  setFormData(data) {
    this.formData = { ...this.formData, ...data };
  }

  resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: 'Analytics',
      position: 'Junior'
    };
    this.errors = {};
  }

  displayToInputDate(displayDate) {
    if (!displayDate) return '';
    const parts = displayDate.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return displayDate;
  }

  inputToDisplayDate(inputDate) {
    if (!inputDate) return '';
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return inputDate;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  handleInputChange(field, event) {
    this.formData[field] = event.target.value;
    this.clearError(field);
  }

  clearError(field) {
    if (this.errors[field]) {
      this.errors = { ...this.errors, [field]: null };
    }
  }

  handleInputBlur(field) {
    let error = null;
    if (['firstName', 'lastName', 'email', 'dateOfEmployment', 'dateOfBirth', 'phone'].includes(field)) {
      const value = (this.formData[field] || '').trim();
      if (!value) {
        error = 'required';
      } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'email';
      }
    }
    this.errors = { ...this.errors, [field]: error };
  }

  validateForm() {
    const errors = {};

    if (!this.formData.firstName.trim()) {
      errors.firstName = 'required';
    }
    if (!this.formData.lastName.trim()) {
      errors.lastName = 'required';
    }

    if (!this.formData.email.trim()) {
      errors.email = 'required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      errors.email = 'email';
    }

    if (!this.formData.dateOfEmployment) {
      errors.dateOfEmployment = 'required';
    }

    if (!this.formData.dateOfBirth) {
      errors.dateOfBirth = 'required';
    }

    if (!this.formData.phone.trim()) {
      errors.phone = 'required';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  handleSubmit(event) {
    event.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.dispatchEvent(new CustomEvent('form-submit', {
      detail: { formData: this.formData },
      bubbles: true,
      composed: true
    }));
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent('form-cancel', {
      bubbles: true,
      composed: true
    }));
  }

  handlePhoneInput(event) {
    const input = event.target;
    const prefix = '+(90) ';

    if (!input.value.startsWith(prefix) || input.value.length < prefix.length) {
      this.formData = { ...this.formData, phone: prefix };
      requestAnimationFrame(() => {
        input.value = prefix;
        input.setSelectionRange(prefix.length, prefix.length);
      });
      this.clearError('phone');
      return;
    }

    let numbers = input.value.substring(prefix.length).replace(/[^\d]/g, '');
    numbers = numbers.slice(0, 10);

    let formatted = '';
    if (numbers.length > 0) formatted += numbers.slice(0, 3);
    if (numbers.length > 3) formatted += ' ' + numbers.slice(3, 6);
    if (numbers.length > 6) formatted += ' ' + numbers.slice(6, 8);
    if (numbers.length > 8) formatted += ' ' + numbers.slice(8, 10);

    const newValue = prefix + formatted;
    this.formData = { ...this.formData, phone: newValue };

    requestAnimationFrame(() => {
      input.value = newValue;
      input.setSelectionRange(newValue.length, newValue.length);
    });

    this.clearError('phone');
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label class="form-label" for="firstName">${i18n.t('form.firstName')} *</label>
          <input
            type="text"
            id="firstName"
            class="form-input ${this.errors.firstName ? 'error' : ''}"
            .value=${this.formData.firstName}
            @input=${(e) => this.handleInputChange('firstName', e)}
            @blur=${() => this.handleInputBlur('firstName')}
          >
          ${this.errors.firstName ? html`<div class="error-message">${i18n.t('validation.' + this.errors.firstName)}</div>` : ''}
        </div>

        <div class="form-group">
          <label class="form-label" for="lastName">${i18n.t('form.lastName')} *</label>
          <input
            type="text"
            id="lastName"
            class="form-input ${this.errors.lastName ? 'error' : ''}"
            .value=${this.formData.lastName}
            @input=${(e) => this.handleInputChange('lastName', e)}
            @blur=${() => this.handleInputBlur('lastName')}
          >
          ${this.errors.lastName ? html`<div class="error-message">${i18n.t('validation.' + this.errors.lastName)}</div>` : ''}
        </div>

        <div class="form-group">
          <label class="form-label" for="dateOfEmployment">${i18n.t('form.dateOfEmployment')} *</label>
          <input
            type="date"
            id="dateOfEmployment"
            class="form-input ${this.errors.dateOfEmployment ? 'error' : ''}"
            .value=${this.formData.dateOfEmployment}
            @input=${(e) => this.handleInputChange('dateOfEmployment', e)}
            @blur=${() => this.handleInputBlur('dateOfEmployment')}
          >
          ${this.errors.dateOfEmployment ? html`<div class="error-message">${i18n.t('validation.' + this.errors.dateOfEmployment)}</div>` : ''}
        </div>

        <div class="form-group">
          <label class="form-label" for="dateOfBirth">${i18n.t('form.dateOfBirth')} *</label>
          <input
            type="date"
            id="dateOfBirth"
            class="form-input ${this.errors.dateOfBirth ? 'error' : ''}"
            .value=${this.formData.dateOfBirth}
            @input=${(e) => this.handleInputChange('dateOfBirth', e)}
            @blur=${() => this.handleInputBlur('dateOfBirth')}
          >
          ${this.errors.dateOfBirth ? html`<div class="error-message">${i18n.t('validation.' + this.errors.dateOfBirth)}</div>` : ''}
        </div>

        <div class="form-group">
          <label class="form-label" for="phone">${i18n.t('form.phone')} *</label>
          <input
            type="text"
            id="phone"
            class="form-input ${this.errors.phone ? 'error' : ''}"
            .value=${this.formData.phone || '+(90) '}
            @input=${this.handlePhoneInput}
            @blur=${() => this.handleInputBlur('phone')}
          >
          ${this.errors.phone ? html`<div class="error-message">${i18n.t('validation.' + this.errors.phone)}</div>` : ''}
        </div>

        <div class="form-group">
          <label class="form-label" for="email">${i18n.t('form.email')} *</label>
          <input
            type="email"
            id="email"
            class="form-input ${this.errors.email ? 'error' : ''}"
            .value=${this.formData.email}
            @input=${(e) => this.handleInputChange('email', e)}
            @blur=${() => this.handleInputBlur('email')}
          >
          ${this.errors.email ? html`<div class="error-message">${i18n.t('validation.' + this.errors.email)}</div>` : ''}
        </div>

        <div class="form-group">
          <label class="form-label" for="department">${i18n.t('form.department')}</label>
          <select
            id="department"
            class="form-select"
            .value=${this.formData.department}
            @change=${(e) => this.handleInputChange('department', e)}
          >
            <option value="Analytics">${i18n.t('department.analytics')}</option>
            <option value="Tech">${i18n.t('department.tech')}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="position">${i18n.t('form.position')}</label>
          <select
            id="position"
            class="form-select"
            .value=${this.formData.position}
            @change=${(e) => this.handleInputChange('position', e)}
          >
            <option value="Junior">${i18n.t('position.junior')}</option>
            <option value="Medior">${i18n.t('position.medior')}</option>
            <option value="Senior">${i18n.t('position.senior')}</option>
          </select>
        </div>

        <div class="form-actions">
          <slot name="actions"></slot>
          <button type="button" class="btn btn-secondary" @click=${this.handleCancel}>
            ${i18n.t('form.cancel')}
          </button>
          <button type="submit" class="btn btn-primary" ?disabled=${this.loading}>
            ${this.loading ? html`
              <div class="spinner"></div>
              Loading...
            ` : html`
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              ${i18n.t('form.save')}
            `}
          </button>
        </div>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm); 