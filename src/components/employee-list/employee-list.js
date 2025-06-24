import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { i18n } from '../../i18n/i18n.js';
import styles from './employee-list.css?inline';
import '../app-modal/app-modal.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    showDeleteModal: { type: Boolean },
    employeeToDelete: { type: Object },
  };

  constructor() {
    super();
    this.employees = [];
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

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

  static styles = css([`${styles}`]);

  getDepartmentClass(department) {
    const departmentMap = {
      'Analytics': 'department-analytics',
      'Tech': 'department-tech'
    };
    return departmentMap[department] || 'department-analytics';
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  handleEdit(id) {
    Router.go(`/edit/${id}`);
  }

  handleDelete(id) {
    const employee = this.employees.find(e => e.id === id);
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  handleModalClose() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  handleModalProceed() {
    this.dispatchEvent(new CustomEvent('employee-deleted', {
      detail: { id: this.employeeToDelete.id },
      bubbles: true,
      composed: true
    }));
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    window.showToast(i18n.t('message.employeeDeleted'));
  }

  render() {
    if (!this.employees || this.employees.length === 0) {
      return html`
        <div class="list-container">
          <div class="no-data">
            ${i18n.t('home.noEmployees')}
          </div>
        </div>
      `;
    }

    return html`
      <div class="list-container">
        ${this.employees.map(employee => html`
          <div class="employee-card">
            <div class="employee-header">
              <div>
                <div class="employee-name">${employee.firstName} ${employee.lastName}</div>
                <div class="employee-email">${employee.email}</div>
              </div>
            </div>
            
            <div class="employee-details">
              <div class="detail-row">
                <span class="detail-label">${i18n.t('table.dateOfEmployment')}</span>
                <span class="detail-value">${this.formatDate(employee.dateOfEmployment)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${i18n.t('table.dateOfBirth')}</span>
                <span class="detail-value">${this.formatDate(employee.dateOfBirth)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${i18n.t('table.phone')}</span>
                <span class="detail-value">${employee.phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${i18n.t('table.department')}</span>
                <span class="department-badge ${this.getDepartmentClass(employee.department)}">
                  ${i18n.t(`department.${employee.department.toLowerCase()}`)}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${i18n.t('table.position')}</span>
                <span class="detail-value">${i18n.t(`position.${employee.position.toLowerCase()}`)}</span>
              </div>
            </div>
            
            <div class="actions">
              <button class="btn btn-edit" @click=${() => this.handleEdit(employee.id)}>
                ${i18n.t('actions.edit')}
              </button>
              <button class="btn btn-delete" @click=${() => this.handleDelete(employee.id)}>
                ${i18n.t('actions.delete')}
              </button>
            </div>
          </div>
        `)}
      </div>
      <app-modal
        .open=${this.showDeleteModal}
        @modal-closed=${this.handleModalClose}
      >
        <span slot="title">${i18n.t('modal.confirmTitle')}</span>
        <span slot="content">
          ${this.employeeToDelete ? unsafeHTML(i18n.t('modal.deleteContent', { name: `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}` })) : i18n.t('modal.confirmTitle')}
        </span>
        <div slot="actions">
          <button class="mdl-btn mdl-btn-proceed" @click=${this.handleModalProceed.bind(this)}>${i18n.t('modal.proceed')}</button>
          <button class="mdl-btn mdl-btn-cancel" @click=${this.handleModalClose.bind(this)}>${i18n.t('modal.cancel')}</button>
        </div>
      </app-modal>
    `;
  }
}

customElements.define('employee-list', EmployeeList); 