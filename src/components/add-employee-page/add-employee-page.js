import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { i18n } from '../../i18n/i18n.js';
import { employeeService } from '../../services/employee-service.js';
import '../app-modal/app-modal.js';
import '../employee-form/employee-form.js';
import styles from './add-employee-page.css?inline';

export class AddEmployeePage extends LitElement {
  static properties = {
    loading: { type: Boolean },
    showSaveModal: { type: Boolean },
    showConfirmModal: { type: Boolean },
    pendingFormData: { type: Object },
  };

  constructor() {
    super();
    this.loading = false;
    this.showSaveModal = false;
    this.showConfirmModal = false;
    this.pendingFormData = null;
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

  handleFormSubmit(event) {
    const { formData } = event.detail;
    this.pendingFormData = formData;
    this.showConfirmModal = true;
  }

  handleConfirmProceed() {
    this.showConfirmModal = false;
    this.loading = true;
    try {
      employeeService.addEmployee(this.pendingFormData);
      this.showSaveModal = false;
      window.showToast(i18n.t('message.employeeAdded'));
      setTimeout(() => {
        Router.go('/');
      }, 1000);
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('An error occurred while adding the employee.');
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

  handleModalClose() {
    this.showSaveModal = false;
    Router.go('/');
  }

  render() {
    return html`
      <div class="page-header">
        <h1 class="page-title">${i18n.t('form.add')}</h1>
      </div>

      <div class="form-container">
        <employee-form
          @form-submit=${this.handleFormSubmit}
          @form-cancel=${this.handleFormCancel}
        ></employee-form>
      </div>

      <app-modal
        .open=${this.showConfirmModal}
        @modal-closed=${this.handleConfirmCancel}
      >
        <span slot="title">${i18n.t('modal.confirmTitle')}</span>
        <span slot="content">${i18n.t('modal.createContent')}</span>
        <div slot="actions">
          <button class="mdl-btn mdl-btn-proceed" @click=${this.handleConfirmProceed.bind(this)}>${i18n.t('modal.proceed')}</button>
          <button class="mdl-btn mdl-btn-delete" @click=${this.handleConfirmCancel.bind(this)}>${i18n.t('modal.cancel')}</button>
        </div>
      </app-modal>

      <app-modal
        .open=${this.showSaveModal}
        @modal-closed=${this.handleModalClose}
      >
        <!-- Remove the success modal, toast will be used instead -->
      </app-modal>
    `;
  }
}

customElements.define('add-employee-page', AddEmployeePage); 