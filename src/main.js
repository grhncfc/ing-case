import { Router } from '@vaadin/router';
import { i18n } from './i18n/i18n.js';
import './components/app-navbar/app-navbar.js';
import './components/home-page/home-page.js';
import './components/add-employee-page/add-employee-page.js';
import './components/edit-employee-page/edit-employee-page.js';
import './components/toast-message/toast-message.js';
import './components/not-found-page/not-found-page.js';

// Initialize i18n
await i18n.init();

// Router configuration
const routes = [
  {
    path: '/',
    component: 'home-page'
  },
  {
    path: '/add',
    component: 'add-employee-page'
  },
  {
    path: '/edit/:id',
    component: 'edit-employee-page'
  },
  {
    path: '/(.*)',
    component: 'not-found-page'
  }
];

// Initialize router
const router = new Router(document.querySelector('#router'));
router.setRoutes(routes);

// Handle language changes
window.addEventListener('language-changed', (event) => {
  document.documentElement.lang = event.detail.language;
});

window.showToast = (message, duration = 2500) => {
  let toast = document.querySelector('toast-message');
  if (!toast) {
    toast = document.createElement('toast-message');
    document.body.appendChild(toast);
  }
  toast.show(message, duration);
}; 