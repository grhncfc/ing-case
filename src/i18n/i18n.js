import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get stored language or default to English
const getStoredLanguage = () => {
  return localStorage.getItem('language') || 'en';
};

// Store language preference
const setStoredLanguage = (language) => {
  localStorage.setItem('language', language);
};

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Employees',
      'nav.addEmployee': 'Add New',
      
      // Home page
      'home.title': 'ING',
      'home.subtitle': 'Employee List',
      'home.addEmployee': 'Add Employee',
      'home.search': 'Search employees...',
      'home.noEmployees': 'No employees found.',
      
      // Table headers
      'table.id': 'ID',
      'table.firstName': 'First Name',
      'table.lastName': 'Last Name',
      'table.dateOfEmployment': 'Date of Employment',
      'table.dateOfBirth': 'Date of Birth',
      'table.phone': 'Phone',
      'table.email': 'Email',
      'table.department': 'Department',
      'table.position': 'Position',
      'table.actions': 'Actions',
      
      // Actions
      'actions.edit': 'Edit',
      'actions.delete': 'Delete',
      'actions.view': 'View',
      
      // Employee form
      'form.add': 'Add Employee',
      'form.edit': 'Edit Employee',
      'form.firstName': 'First Name',
      'form.lastName': 'Last Name',
      'form.dateOfEmployment': 'Date of Employment',
      'form.dateOfBirth': 'Date of Birth',
      'form.phone': 'Phone',
      'form.email': 'Email',
      'form.department': 'Department',
      'form.position': 'Position',
      'form.save': 'Save Changes',
      'form.cancel': 'Cancel',
      
      // Validation
      'validation.required': 'This field is required',
      'validation.email': 'Please enter a valid email',
      'validation.salary': 'Please enter a valid salary',
      'validation.phoneFormat': 'Please enter a valid Turkish mobile phone number',
      
      // Messages
      'message.ok': 'Ok',
      'message.success': 'Success!',
      'message.employeeAdded': 'Employee added successfully',
      'message.employeeUpdated': 'Employee updated successfully',
      'message.employeeDeleted': 'Employee deleted successfully',
      'message.confirmDelete': 'Are you sure you want to delete this employee?',
      
      // Departments
      'department.analytics': 'Analytics',
      'department.tech': 'Tech',
      
      // Positions
      'position.junior': 'Junior',
      'position.medior': 'Medior',
      'position.senior': 'Senior',
      
      // Modal
      'modal.confirmTitle': 'Are you sure?',
      'modal.createContent': 'Do you want to create a new employee?',
      'modal.editContent': 'Do you want to save changes for edit?',
      'modal.deleteContent': 'Selected Employee record of <b>{{name}}</b> will be deleted.',
      'modal.proceed': 'Proceed',
      'modal.cancel': 'Cancel'
    }
  },
  tr: {
    translation: {
      // Navigation
      'nav.home': 'Çalışanlar',
      'nav.addEmployee': 'Yeni Ekle',
      
      // Home page
      'home.title': 'ING',
      'home.subtitle': 'Çalışan Listesi',
      'home.addEmployee': 'Çalışan Ekle',
      'home.search': 'Çalışan ara...',
      'home.noEmployees': 'Çalışan bulunamadı.',
      
      // Table headers
      'table.id': 'ID',
      'table.firstName': 'Ad',
      'table.lastName': 'Soyad',
      'table.dateOfEmployment': 'İşe Giriş Tarihi',
      'table.dateOfBirth': 'Doğum Tarihi',
      'table.phone': 'Telefon',
      'table.email': 'E-posta',
      'table.department': 'Departman',
      'table.position': 'Pozisyon',
      'table.actions': 'İşlemler',
      
      // Actions
      'actions.edit': 'Düzenle',
      'actions.delete': 'Sil',
      'actions.view': 'Görüntüle',
      
      // Employee form
      'form.add': 'Çalışan Ekle',
      'form.edit': 'Çalışanı Düzenle',
      'form.firstName': 'Ad',
      'form.lastName': 'Soyad',
      'form.dateOfEmployment': 'İşe Giriş Tarihi',
      'form.dateOfBirth': 'Doğum Tarihi',
      'form.phone': 'Telefon',
      'form.email': 'E-posta',
      'form.department': 'Departman',
      'form.position': 'Pozisyon',
      'form.save': 'Kaydet',
      'form.cancel': 'İptal',
      
      // Validation
      'validation.required': 'Bu alan zorunludur',
      'validation.email': 'Lütfen geçerli bir e-posta adresi girin',
      'validation.salary': 'Lütfen geçerli bir maaş girin',
      'validation.phoneFormat': 'Lütfen geçerli bir Türk cep telefonu numarası girin',
      
      // Messages
      'message.ok': 'Tamam',
      'message.success': 'Başarılı!',
      'message.employeeAdded': 'Çalışan başarıyla eklendi',
      'message.employeeUpdated': 'Çalışan başarıyla güncellendi',
      'message.employeeDeleted': 'Çalışan başarıyla silindi',
      'message.confirmDelete': 'Bu çalışanı silmek istediğinizden emin misiniz?',
      
      // Departments
      'department.analytics': 'Analitik',
      'department.tech': 'Teknoloji',
      
      // Positions
      'position.junior': 'Junior',
      'position.medior': 'Medior',
      'position.senior': 'Senior',
      
      // Modal
      'modal.confirmTitle': 'Emin misiniz?',
      'modal.createContent': 'Yeni bir çalışan oluşturmak istiyor musunuz?',
      'modal.editContent': 'Düzenleme için değişiklikleri kaydetmek istiyor musunuz?',
      'modal.deleteContent': '<b>{{name}}</b> çalışan kaydı silinecek.',
      'modal.proceed': 'Devam',
      'modal.cancel': 'İptal'
    }
  }
};

export const i18n = i18next;

i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    lng: getStoredLanguage(),
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Export language management functions
export const changeLanguage = (language) => {
  i18next.changeLanguage(language);
  setStoredLanguage(language);
  window.dispatchEvent(new CustomEvent('language-changed', { 
    detail: { language } 
  }));
};

export const getCurrentLanguage = () => {
  return i18next.language;
}; 