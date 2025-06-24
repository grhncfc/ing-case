# ING Case Employee Management

A modern, responsive employee management system built with Lit, Vaadin Router, and internationalization support for English and Turkish.

## Features

- **Modern UI**: Clean, responsive design with table and list view modes
- **Internationalization**: Full support for English and Turkish languages with persistent language preference
- **Employee Management**: Add, edit, delete, and view employee information
- **Search Functionality**: Search employees by name, email, department, or position
- **Data Persistence**: Local storage for data persistence across sessions
- **Sample Data**: App initializes with 150 sample employees if no data is present
- **Modular Architecture**: Component-based structure for maintainability

## Technology Stack

- **Lit**: Modern web components framework
- **Vaadin Router**: Client-side routing
- **i18next**: Internationalization library
- **Vite**: Build tool and development server

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── app-navbar.js          # Navigation bar with language switcher
│   │   ├── home-page.js           # Main dashboard page
│   │   ├── add-employee-page.js   # Add new employee form
│   │   ├── edit-employee-page.js  # Edit employee form
│   │   ├── employee-table.js      # Table view component
│   │   └── employee-list.js       # List view component
│   ├── services/
│   │   └── employee-service.js    # Data management service
│   ├── i18n/
│   │   └── i18n.js               # Internationalization configuration
│   ├── test/
│   │   ├── components/
│   │   │   ├── app-navbar.test.js
│   │   │   ├── app-modal.test.js
│   │   │   ├── toast-message.test.js
│   │   │   ├── employee-form.test.js
│   │   │   ├── employee-list.test.js
│   │   │   ├── employee-table.test.js
│   │   │   ├── add-employee-page.test.js
│   │   │   ├── edit-employee-page.test.js
│   │   │   ├── pagination-controls.test.js
│   │   │   └── home-page.test.js
│   │   └── services/
│   │       └── employee-service.test.js
│   └── main.js                   # Application entry point
├── index.html                    # Main HTML file
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── web-test-runner.config.js     # Web Test Runner configuration
└── README.md                    # This file
```

## Employee Data Structure

Each employee has the following properties:

- **id**: Unique identifier (auto-generated)
- **firstName**: Employee's first name
- **lastName**: Employee's last name
- **dateOfEmployment**: Date of employment (YYYY-MM-DD)
- **dateOfBirth**: Date of birth (YYYY-MM-DD)
- **phone**: Phone number (e.g., +(90) 123 456 78 90)
- **email**: Employee's email address
- **department**: Either "Analytics" or "Tech"
- **position**: Either "Junior", "Medior", or "Senior"

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ing-case-gurhan-cifci
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run all tests with web-test-runner

## Usage

### Navigation
- Use the navigation bar to switch between pages
- Click the flag icons to change language (English/Turkish)
- Language preference is automatically saved and restored

### Home Page
- View all employees in table or list format
- Use the search bar to filter employees
- Click "Add New Employee" to create a new employee
- Use action buttons to view, edit, or delete employees

### Adding Employees
- Navigate to the "Add Employee" page
- Fill in the required fields (first name, last name, email, etc.)
- Select department (Analytics/Tech) and position (Junior/Medior/Senior)
- Click "Save" to add the employee

### Editing Employees
- Click the "Edit" button on any employee
- Modify the employee information
- Click "Save" to update or "Delete" to remove the employee

### View Modes
- **Table View**: Traditional table layout with all employee details
- **List View**: Card-based layout for better mobile experience

## Internationalization

The application supports two languages:

### English
- Default language
- All UI elements and messages translated
- Department names: Analytics, Tech
- Position names: Junior, Medior, Senior

### Turkish
- Full Turkish translation
- Department names: Analitik, Teknoloji
- Position names: Junior, Medior, Senior

Language preference is stored in localStorage and persists across browser sessions.

## Browser Support

The application uses modern web standards and is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding New Features
1. Create new components in `src/components/`
2. Add translations to `src/i18n/i18n.js`
3. Update routing in `src/main.js` if needed
4. Add tests in `src/test/` directory

### Styling
- Components use CSS-in-JS with Lit's `css` template literal
- Responsive design with mobile-first approach
- Consistent color scheme and typography

### Data Management
- All data is stored in localStorage
- Employee service handles all CRUD operations
- Data is automatically initialized with 150 sample employees if none exist

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Color System

The project uses CSS variables for primary color theming:

- `--primary-color`: The main brand color (default: #f37021)
- `--primary-color-rgba`: The main brand color with 0.7 alpha (default: rgba(243, 112, 33, 0.7))
- `--primary-color-navigation-rgba`: The main brand color with 0.5 alpha (default: rgba(243, 112, 33, 0.5))

Update these in `index.html` to change the color scheme globally.

## Toast Message Component

A reusable `<toast-message>` web component is available for showing temporary notifications. Use it by calling:

```js
window.showToast('Your message here');
```

This is used for all success notifications (add, edit, delete) instead of modals.

## Testing

The project uses [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) and [@open-wc/testing](https://open-wc.org/docs/testing/testing/) for unit and component tests. Test files are located in:

- `src/test/components/` for component tests
- `src/test/services/` for service tests

### Running Tests

To run all tests:

```bash
npm test
```

This will launch web-test-runner and execute all `.test.js` files under `src/test/`.

### Writing Tests
- Use [@open-wc/testing](https://open-wc.org/docs/testing/testing/) helpers like `fixture`, `expect`, and `oneEvent` for web component tests.
- Place new component tests in `src/test/components/` and service tests in `src/test/services/`.

### Example Test
```js
import { fixture, html, expect } from '@open-wc/testing';
import '../../components/app-modal/app-modal.js';

describe('app-modal', () => {
  it('renders title slot', async () => {
    const el = await fixture(html`<app-modal open><span slot="title">Test</span></app-modal>`);
    const titleSlot = el.shadowRoot.querySelector('slot[name="title"]');
    expect(titleSlot).to.exist;
  });
});
``` 