import { expect } from '@open-wc/testing';
import { employeeService } from '../../services/employee-service';

describe('employeeService', () => {
  beforeEach(() => {
    localStorage.clear();
    employeeService.initializeData();
  });

  it('adds a new employee', () => {
    const employee = { firstName: 'Test', lastName: 'User', email: 'test@company.com', department: 'Tech', position: 'Junior', dateOfEmployment: '2022-01-01', dateOfBirth: '1990-01-01', phone: '+(90) 123 456 78 90' };
    const added = employeeService.addEmployee(employee);
    expect(added.firstName).to.equal('Test');
    expect(employeeService.getAllEmployees().some(e => e.id === added.id)).to.be.true;
  });

  it('updates an employee', () => {
    const employee = employeeService.addEmployee({ firstName: 'A', lastName: 'B', email: 'a@b.com', department: 'Tech', position: 'Junior', dateOfEmployment: '2022-01-01', dateOfBirth: '1990-01-01', phone: '+(90) 123 456 78 90' });
    const updated = employeeService.updateEmployee(employee.id, { email: 'updated@b.com' });
    expect(updated.email).to.equal('updated@b.com');
  });

  it('deletes an employee', () => {
    const employee = employeeService.addEmployee({ firstName: 'A', lastName: 'B', email: 'a@b.com', department: 'Tech', position: 'Junior', dateOfEmployment: '2022-01-01', dateOfBirth: '1990-01-01', phone: '+(90) 123 456 78 90' });
    employeeService.deleteEmployee(employee.id);
    expect(employeeService.getEmployeeById(employee.id)).to.be.undefined;
  });

  it('searches employees by name', () => {
    employeeService.addEmployee({ firstName: 'Jane', lastName: 'Doe', email: 'jane@company.com', department: 'Tech', position: 'Junior', dateOfEmployment: '2022-01-01', dateOfBirth: '1990-01-01', phone: '+(90) 123 456 78 90' });
    const results = employeeService.searchEmployees('Jane');
    expect(results.some(e => e.firstName === 'Jane')).to.be.true;
  });
}); 