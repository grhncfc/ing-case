import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { i18n } from '../../i18n/i18n.js';
import { employeeService } from '../../services/employee-service.js';
import '../app-modal/app-modal.js';
import '../employee-form/employee-form.js';
import styles from './edit-employee-page.css?inline';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class EditEmployeePage extends LitElement {
  static properties = {
    employeeId: { type: String },
    employee: { type: Object },
    loading: { type: Boolean },
    notFound: { type: Boolean },
    showSaveModal: { type: Boolean },
    showDeleteModal: { type: Boolean },
    showConfirmModal: { type: Boolean },
    pendingFormData: { type: Object },
    showDeletedModal: { type: Boolean },
  };

  constructor() {
    super();
    this.employeeId = '';
    this.employee = null;
    this.loading = true;
    this.notFound = false;
    this.showSaveModal = false;
    this.showDeleteModal = false;
    this.showConfirmModal = false;
    this.pendingFormData = null;
    this.showDeletedModal = false;
  }

  static styles = css([`${styles}`]);

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployee();
    window.addEventListener('language-changed', this._handleLanguageChangeBound = this.handleLanguageChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this._handleLanguageChangeBound);
  }

  handleLanguageChange() {
    this.requestUpdate();
  }

  async loadEmployee() {
    const pathSegments = window.location.pathname.split('/');
    this.employeeId = pathSegments[pathSegments.length - 1];
    
    try {
      const employee = employeeService.getEmployeeById(this.employeeId);
      
      if (!employee) {
        this.notFound = true;
        this.loading = false;
        return;
      }

      this.employee = employee;
      
    } catch (error) {
      console.error('Error loading employee:', error);
      this.notFound = true;
    } finally {
      this.loading = false;
    }
  }

  handleFormSubmit(event) {
    const { formData } = event.detail;
    this.pendingFormData = formData;
    this.showConfirmModal = true;
  }

  handleConfirmProceed() {
    this.showConfirmModal = false;
    this.loading = true;
    try {
      const updatedEmployee = employeeService.updateEmployee(this.employeeId, this.pendingFormData);
      if (updatedEmployee) {
        window.showToast(i18n.t('message.employeeUpdated'));
        setTimeout(() => {
          Router.go('/');
        }, 1000);
      } else {
        alert('Employee not found or could not be updated.');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('An error occurred while updating the employee.');
    } finally {
      this.loading = false;
      this.pendingFormData = null;
    }
  }

  handleConfirmCancel() {
    this.showConfirmModal = false;
    this.pendingFormData = null;
  }

  handleFormCancel() {
    Router.go('/');
  }

  handleDelete() {
    this.showDeleteModal = true;
  }

  handleDeleteConfirm() {
    try {
      employeeService.deleteEmployee(this.employeeId);
      this.showDeleteModal = false;
      window.showToast(i18n.t('message.employeeDeleted'));
      setTimeout(() => {
        Router.go('/');
      }, 1000);
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('An error occurred while deleting the employee.');
    }
  }

  handleDeleteCancel() {
    this.showDeleteModal = false;
  }

  handleDeletedModalClose() {
    this.showDeletedModal = false;
    Router.go('/');
  }

  handleModalClose() {
    this.showSaveModal = false;
    Router.go('/');
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <div class="spinner"></div>
          Loading...
        </div>
      `;
    }

    if (this.notFound) {
      return html`
        <div class="not-found">
          <svg class="not-found-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
          </svg>
          <h2>Employee Not Found</h2>
          <p>The employee you're looking for doesn't exist.</p>
          <button class="btn btn-secondary" @click=${this.handleFormCancel}>
            Back to Home
          </button>
        </div>
      `;
    }

    return html`
      <div class="page-header">
        <h1 class="page-title">${i18n.t('form.edit')}</h1>
        <p class="page-subtitle">${this.employee?.firstName} ${this.employee?.lastName}</p>
      </div>

      <div class="form-container">
        <employee-form
          .formData=${this.employee}
          @form-submit=${this.handleFormSubmit}
          @form-cancel=${this.handleFormCancel}
        >
          <div slot="actions">
            <button type="button" class="btn btn-danger" @click=${this.handleDelete}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              ${i18n.t('actions.delete')}
            </button>
          </div>
        </employee-form>
      </div>

      <app-modal
        .open=${this.showSaveModal}
        @modal-closed=${this.handleModalClose}
      >
        <!-- Remove the success modal, toast will be used instead -->
      </app-modal>

      <app-modal
        .open=${this.showDeleteModal}
        @modal-closed=${this.handleDeleteCancel}
      >
        <span slot="title">${i18n.t('modal.confirmTitle')}</span>
        <span slot="content">${unsafeHTML(i18n.t('modal.deleteContent', { name: `${this.employee?.firstName} ${this.employee?.lastName}` }))}</span>
        <div slot="actions">
          <button class="mdl-btn mdl-btn-proceed" @click=${this.handleDeleteConfirm}>${i18n.t('modal.proceed')}</button>
          <button class="mdl-btn mdl-btn-cancel" @click=${this.handleDeleteCancel}>${i18n.t('modal.cancel')}</button>
        </div>
      </app-modal>

      <app-modal
        .open=${this.showConfirmModal}
        @modal-closed=${this.handleConfirmCancel}
      >
        <span slot="title">${i18n.t('modal.confirmTitle')}</span>
        <span slot="content">${i18n.t('modal.editContent')}</span>
        <div slot="actions">
          <button class="mdl-btn mdl-btn-proceed" @click=${this.handleConfirmProceed.bind(this)}>${i18n.t('modal.proceed')}</button>
          <button class="mdl-btn mdl-btn-cancel" @click=${this.handleConfirmCancel.bind(this)}>${i18n.t('modal.cancel')}</button>
        </div>
      </app-modal>

      <app-modal
        .open=${this.showDeletedModal}
        @modal-closed=${this.handleDeletedModalClose}
      >
        <!-- Remove the deleted modal, toast will be used instead -->
      </app-modal>
    `;
  }
}

customElements.define('edit-employee-page', EditEmployeePage);