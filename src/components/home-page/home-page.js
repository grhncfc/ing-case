import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { i18n } from '../../i18n/i18n.js';
import { employeeService } from '../../services/employee-service.js';
import '../employee-table/employee-table.js';
import '../employee-list/employee-list.js';
import '../pagination-controls/pagination-controls.js';
import listSvg from '../../assets/list.svg?raw';
import gridSvg from '../../assets/grid.svg?raw';
import styles from './home-page.css?inline';

export class HomePage extends LitElement {
  static properties = {
    employees: { type: Array },
    filteredEmployees: { type: Array },
    viewMode: { type: String },
    searchQuery: { type: String },
    loading: { type: Boolean },
    selectedEmployees: { type: Array },
    currentPage: { type: Number },
    sortField: { type: String },
    sortDirection: { type: String },
  };

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.viewMode = 'table';
    this.searchQuery = '';
    this.loading = true;
    this.selectedEmployees = [];
    this.currentPage = 1;
    this.itemsPerPage = 9;
    this.sortField = 'firstName';
    this.sortDirection = 'asc';
  }

  static styles = css([`${styles}`]);

  get sortedEmployees() {
    if (!this.sortField) {
      return this.filteredEmployees;
    }

    return [...this.filteredEmployees].sort((a, b) => {
      let aValue = a[this.sortField];
      let bValue = b[this.sortField];

      if (this.sortField === 'dateOfEmployment') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  get totalPages() {
    return Math.ceil(this.sortedEmployees.length / this.itemsPerPage);
  }

  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.sortedEmployees.slice(startIndex, endIndex);
  }

  handlePageChanged(event) {
    this.currentPage = event.detail.page;
  }

  handleSortRequested(event) {
    const { field } = event.detail;
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();
    window.addEventListener('language-changed', this.handleLanguageChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this.handleLanguageChange.bind(this));
  }

  handleLanguageChange() {
    this.requestUpdate();
  }

  async loadEmployees() {
    this.loading = true;
    try {
      this.employees = employeeService.getAllEmployees();
      this.filterEmployees();
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      this.loading = false;
    }
  }

  filterEmployees() {
    if (!this.searchQuery) {
      this.filteredEmployees = [...this.employees];
    } else {
      this.filteredEmployees = employeeService.searchEmployees(this.searchQuery);
    }
  }

  handleSearch(event) {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
    this.filterEmployees();
  }

  handleViewModeChange(mode) {
    this.viewMode = mode;
  }

  handleEmployeeDeleted(event) {
    const { id } = event.detail;
    employeeService.deleteEmployee(id);
    this.loadEmployees();
  }

  handleSelectionChanged(event) {
    this.selectedEmployees = event.detail.selectedEmployees;
  }

  render() {
    return html`
      <div class="page-header">
        <h1 class="page-title">${i18n.t('home.subtitle')}</h1>
        
        <div class="controls">
          <div class="controls-row">
            <div class="search-container">
              <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                type="text" 
                class="search-input" 
                placeholder="${i18n.t('home.search')}"
                .value=${this.searchQuery}
                @input=${this.handleSearch}
              >
            </div>
            
            <div class="view-toggle">
              <button 
                class="view-button ${this.viewMode === 'table' ? 'active' : ''}"
                @click=${() => this.handleViewModeChange('table')}
              >
                <div .innerHTML=${listSvg}></div>
              </button>
              <button 
                class="view-button ${this.viewMode === 'list' ? 'active' : ''}"
                @click=${() => this.handleViewModeChange('list')}
              >
                <div .innerHTML=${gridSvg}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        ${this.loading ? html`
          <div class="loading">
            <div class="spinner"></div>
            Loading...
          </div>
        ` : html`
          ${this.viewMode === 'table' 
            ? html`<employee-table 
                .employees=${this.paginatedEmployees}
                .sortField=${this.sortField}
                .sortDirection=${this.sortDirection}
                @sort-requested=${this.handleSortRequested}
                @employee-deleted=${this.handleEmployeeDeleted}
                @selection-changed=${this.handleSelectionChanged}
              ></employee-table>`
            : html`<employee-list 
                .employees=${this.paginatedEmployees}
                @employee-deleted=${this.handleEmployeeDeleted}
              ></employee-list>`
          }
        `}
      </div>

      ${!this.loading && this.totalPages > 1 ? html`
        <pagination-controls
          .currentPage=${this.currentPage}
          .totalPages=${this.totalPages}
          @page-changed=${this.handlePageChanged}
        ></pagination-controls>
      ` : ''}
    `;
  }
}

customElements.define('home-page', HomePage); 