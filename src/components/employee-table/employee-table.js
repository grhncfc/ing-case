import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { i18n } from '../../i18n/i18n.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../app-modal/app-modal.js';
import styles from './employee-table.css?inline';
import editSvg from '../../assets/edit_square.svg?raw';
import deleteSvg from '../../assets/delete.svg?raw';

export class EmployeeTable extends LitElement {
  static properties = {
    employees: { type: Array },
    showDeleteModal: { type: Boolean },
    employeeToDelete: { type: Object },
    selectedEmployees: { type: Array },
    sortField: { type: String },
    sortDirection: { type: String },
  };

  constructor() {
    super();
    this.employees = [];
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    this.selectedEmployees = [];
    this.sortField = 'firstName';
    this.sortDirection = 'asc';
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

  requestSort(field) {
    this.dispatchEvent(new CustomEvent('sort-requested', { detail: { field } }));
  }

  getSortIcon(field) {
    if (this.sortField !== field) {
      return html`<span class="sort-icon">↕</span>`;
    }
    return html`<span class="sort-icon">${this.sortDirection === 'asc' ? '↑' : '↓'}</span>`;
  }

  handleSelectAll(event) {
    if (event.target.checked) {
      this.selectedEmployees = this.employees.map(emp => emp.id);
    } else {
      this.selectedEmployees = [];
    }
    this.dispatchSelectionChange();
  }

  handleSelectEmployee(employeeId, event) {
    if (event.target.checked) {
      this.selectedEmployees = [...this.selectedEmployees, employeeId];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(id => id !== employeeId);
    }
    this.dispatchSelectionChange();
  }

  dispatchSelectionChange() {
    this.dispatchEvent(new CustomEvent('selection-changed', {
      detail: { selectedEmployees: this.selectedEmployees },
      bubbles: true,
      composed: true
    }));
  }

  get isAllSelected() {
    return this.employees.length > 0 && this.selectedEmployees.length === this.employees.length;
  }

  get isIndeterminate() {
    return this.selectedEmployees.length > 0 && this.selectedEmployees.length < this.employees.length;
  }

  handleEdit(id) {
    Router.go(`/edit/${id}`);
  }

  handleDeleteClick(employee) {
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

  render() {
    if (!this.employees || this.employees.length === 0) {
      return html`
        <div class="table-container">
          <div class="no-data">
            ${i18n.t('home.noEmployees')}
          </div>
        </div>
      `;
    }

    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="select-column">
                <input
                  type="checkbox"
                  .checked=${this.isAllSelected}
                  .indeterminate=${this.isIndeterminate}
                  @change=${this.handleSelectAll}
                >
              </th>
              <th class="sortable" @click=${() => this.requestSort('firstName')}>
                ${i18n.t('table.firstName')} ${this.getSortIcon('firstName')}
              </th>
              <th class="sortable" @click=${() => this.requestSort('lastName')}>
                ${i18n.t('table.lastName')} ${this.getSortIcon('lastName')}
              </th>
              <th class="sortable" @click=${() => this.requestSort('dateOfEmployment')}>
                ${i18n.t('table.dateOfEmployment')} ${this.getSortIcon('dateOfEmployment')}
              </th>
              <th class="sortable" @click=${() => this.requestSort('dateOfBirth')}>
                ${i18n.t('table.dateOfBirth')} ${this.getSortIcon('dateOfBirth')}
              </th>
              <th class="sortable" @click=${() => this.requestSort('phone')}>
                ${i18n.t('table.phone')} ${this.getSortIcon('phone')}
              </th>
              <th class="sortable" @click=${() => this.requestSort('email')}>
                ${i18n.t('table.email')} ${this.getSortIcon('email')}
              </th>
              <th class="sortable" @click=${() => this.requestSort('department')}>
                ${i18n.t('table.department')} ${this.getSortIcon('department')}
              </th>
              <th class="sortable" @click=${() => this.requestSort('position')}>
                ${i18n.t('table.position')} ${this.getSortIcon('position')}
              </th>
              <th>${i18n.t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(employee => html`
              <tr class="${this.selectedEmployees.includes(employee.id) ? 'selected' : ''}">
                <td class="select-column">
                  <input
                    type="checkbox"
                    .checked=${this.selectedEmployees.includes(employee.id)}
                    @change=${(e) => this.handleSelectEmployee(employee.id, e)}
                  >
                </td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${this.formatDate(employee.dateOfEmployment)}</td>
                <td>${this.formatDate(employee.dateOfBirth)}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>
                  <span class="department-badge ${this.getDepartmentClass(employee.department)}">
                    ${i18n.t(`department.${employee.department.toLowerCase()}`)}
                  </span>
                </td>
                <td>${i18n.t(`position.${employee.position.toLowerCase()}`)}</td>
                <td>
                  <div class="actions">
                    <button class="btn btn-edit" @click=${() => this.handleEdit(employee.id)}>
                      <div .innerHTML=${editSvg}></div>
                    </button>
                    <button class="btn btn-delete" @click=${() => this.handleDeleteClick(employee)}>
                      <div .innerHTML=${deleteSvg}></div>
                    </button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <app-modal
        .open=${this.showDeleteModal}
        @modal-closed=${this.handleModalClose}
      >
        <span slot="title">${i18n.t('modal.confirmTitle')}</span>
        <span slot="content">
          ${this.employeeToDelete
            ? unsafeHTML(i18n.t('modal.deleteContent', { name: `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}` }))
            : i18n.t('modal.confirmTitle')}
        </span>
        <div slot="actions">
          <button class="mdl-btn mdl-btn-proceed" @click=${this.handleModalProceed}>${i18n.t('modal.proceed')}</button>
          <button class="mdl-btn mdl-btn-cancel" @click=${this.handleModalClose}>${i18n.t('modal.cancel')}</button>
        </div>
      </app-modal>
    `;
  }
}

customElements.define('employee-table', EmployeeTable); 