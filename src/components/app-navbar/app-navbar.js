import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { i18n, changeLanguage, getCurrentLanguage } from '../../i18n/i18n.js';
import styles from './app-navbar.css?inline';

import ukFlagSvg from '../../assets/Flag_of_the_United_Kingdom.svg?raw';
import turkeyFlagSvg from '../../assets/Flag_of_Turkey.svg?raw';
import ingLogoSvg from '../../assets/ING_Identifier_FC.svg?raw';
import personSvg from '../../assets/person_apron.svg?raw';
import addSvg from '../../assets/add.svg?raw';

export class AppNavbar extends LitElement {
  static properties = {
    currentLanguage: { type: String },
    currentPath: {type: String}
  };

  constructor() {
    super();
    this.currentLanguage = getCurrentLanguage();
    this.currentPath = window.location.pathname;
  }

  static styles = css([`${styles}`]);

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this.handleLanguageChange.bind(this));
    window.addEventListener('vaadin-router-location-changed', this._onLocationChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this.handleLanguageChange.bind(this));
    window.removeEventListener('vaadin-router-location-changed', this._onLocationChange.bind(this));
  }

  handleLanguageChange(event) {
    this.currentLanguage = event.detail.language;
  }

  handleLanguageSwitch(language) {
    changeLanguage(language);
  }
  
  
  _onLocationChange = () => {
    this.currentPath = window.location.pathname;
  };

  render() {
    return html`
      <nav class="navbar">
        <a href="/" class="logo" @click=${this.handleNavigation}>
          <div class="logo-svg" .innerHTML=${ingLogoSvg}></div>
          <span>${i18n.t('home.title')}</span>
        </a>
        
        <div class="nav-links">
          <a href="/" class="nav-link ${this.currentPath === '/' ? 'active' : ''}" @click=${this.handleNavigation}>
            <div class="person" .innerHTML=${personSvg}></div>
            ${i18n.t('nav.home')}
          </a>
          <a href="/add" class="nav-link ${this.currentPath === '/add' ? 'active' : ''}" @click=${this.handleNavigation}>
            <div class="person" .innerHTML=${addSvg}></div>
            ${i18n.t('nav.addEmployee')}
          </a>
          
          <div class="language-switcher">
            <button 
              class="flag-button ${this.currentLanguage === 'en' ? 'active' : ''}"
              @click=${() => this.handleLanguageSwitch('en')}
              title="English"
            >
              <div class="flag" .innerHTML=${ukFlagSvg}></div>
            </button>
            <button 
              class="flag-button ${this.currentLanguage === 'tr' ? 'active' : ''}"
              @click=${() => this.handleLanguageSwitch('tr')}
              title="Türkçe"
            >
              <div class="flag" .innerHTML=${turkeyFlagSvg}></div>
            </button>
          </div>
        </div>
      </nav>
    `;
  }

  handleNavigation(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    Router.go(href);
  }
}

customElements.define('app-navbar', AppNavbar); 