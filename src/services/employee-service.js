// Employee data service with localStorage persistence
class EmployeeService {
  constructor() {
    this.storageKey = 'employees';
    this.initializeData();
  }

  initializeData() {
    const data = localStorage.getItem(this.storageKey);
    
    if (!data) {
      const initialEmployees = this.generateSampleEmployees();
      localStorage.setItem(this.storageKey, JSON.stringify(initialEmployees));
    }
  }

  generateSampleEmployees() {
    const firstNames = [
      'Ahmet', 'Mehmet', 'Ayse', 'Fatma', 'Mustafa', 'Ali', 'Hasan', 'Huseyin', 'Ibrahim', 'Osman',
      'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Jennifer',
      'Maria', 'Carlos', 'Ana', 'Jose', 'Carmen', 'Juan', 'Isabella', 'Diego', 'Sofia', 'Miguel',
      'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella', 'Benjamin',
      'Mia', 'Lucas', 'Charlotte', 'Mason', 'Amelia', 'Ethan', 'Harper', 'Alexander', 'Evelyn', 'Henry',
      'Abigail', 'Sebastian', 'Emily', 'Jack', 'Elizabeth', 'Owen', 'Sofia', 'Daniel', 'Avery', 'Jackson',
      'Ella', 'Samuel', 'Madison', 'Aiden', 'Scarlett', 'Dylan', 'Victoria', 'Nathan', 'Luna', 'Isaac',
      'Grace', 'Kyle', 'Chloe', 'Andrew', 'Penelope', 'Joshua', 'Layla', 'Christopher', 'Riley', 'Amber',
      'Zoe', 'Caleb', 'Nora', 'Ryan', 'Lily', 'Asher', 'Hannah', 'Adrian', 'Lillian', 'Leo',
      'Aria', 'Hunter', 'Addison', 'Grayson', 'Eleanor', 'Jordan', 'Natalie', 'Ian', 'Luna', 'Connor',
      'Savannah', 'Cameron', 'Brooklyn', 'Theodore', 'Aubrey', 'Tyler', 'Paisley', 'Ezra', 'Audrey', 'Brayden',
      'Skylar', 'Kayden', 'Bella', 'Blake', 'Claire', 'Hayden', 'Lucy', 'Jace', 'Anna', 'Miles',
      'Caroline', 'Sawyer', 'Nova', 'Jason', 'Genesis', 'Declan', 'Emilia', 'Weston', 'Kennedy', 'Micah',
      'Samantha', 'Easton', 'Willow', 'Landon', 'Allison', 'Roman', 'Maya', 'Axel', 'Ruby', 'Brooks',
      'Eva', 'Cooper', 'Scarlett', 'Maddox', 'Ariana', 'Josiah', 'Ellie', 'Isaiah', 'Aaliyah', 'Adam',
      'Stella', 'Nathaniel', 'Gabriella', 'Ian', 'Alice', 'Santiago', 'Madelyn', 'Elias', 'Cora', 'Jaxson',
      'Violet', 'Theo', 'Melanie', 'Greyson', 'Piper', 'Bryson', 'Faith', 'Maverick', 'Julia', 'Luis'
    ];

    const lastNames = [
      'Yilmaz', 'Kaya', 'Demir', 'Celik', 'Sahin', 'Yildiz', 'Ozdemir', 'Arslan', 'Dogan', 'Kilic',
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
      'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
      'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
      'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
      'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
      'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
      'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
      'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
      'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez',
      'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes',
      'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham',
      'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Hererra', 'Gibson',
      'Ellis', 'Tran', 'Cohen', 'Meyer', 'Schmidt', 'Wagner', 'Schneider', 'Reed', 'Holmes', 'Palmer',
      'Mills', 'Nichols', 'Grant', 'Knight', 'Ferguson', 'Rose', 'Stone', 'Hawkins', 'Dunn', 'Perkins',
      'Hudson', 'Spencer', 'Gardner', 'Stephens', 'Payne', 'Pierce', 'Berry', 'Matthews', 'Arnold', 'Wagner'
    ];

    const departments = ['Analytics', 'Tech'];
    const positions = ['Junior', 'Medior', 'Senior'];

    const employees = [];
    
    for (let i = 1; i <= 150; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      const startYear = 2018;
      const endYear = 2024;
      const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const dateOfEmployment = `${year}-${month}-${day}`;
      
      const birthYear = Math.floor(Math.random() * (2002 - 1970 + 1)) + 1970;
      const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const dateOfBirth = `${birthYear}-${birthMonth}-${birthDay}`;

      const phonePart1 = Math.floor(Math.random() * 900) + 100;
      const phonePart2 = Math.floor(Math.random() * 900) + 100;
      const phonePart3 = Math.floor(Math.random() * 90) + 10;
      const phonePart4 = Math.floor(Math.random() * 90) + 10;
      const phone = `+(90) ${phonePart1} ${phonePart2} ${phonePart3} ${phonePart4}`;

      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@sourtimes.org`;
      
      employees.push({
        id: i.toString(),
        firstName,
        lastName,
        dateOfEmployment,
        dateOfBirth,
        phone,
        email,
        department,
        position
      });
    }

    return employees;
  }

  getAllEmployees() {
    const employees = localStorage.getItem(this.storageKey);
    return employees ? JSON.parse(employees) : [];
  }

  getEmployeeById(id) {
    const employees = this.getAllEmployees();
    return employees.find(emp => emp.id === id);
  }

  addEmployee(employeeData) {
    const employees = this.getAllEmployees();
    const newEmployee = {
      id: Date.now().toString(),
      ...employeeData
    };
    employees.push(newEmployee);
    localStorage.setItem(this.storageKey, JSON.stringify(employees));
    return newEmployee;
  }

  updateEmployee(id, employeeData) {
    const employees = this.getAllEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...employeeData, id: id };
      localStorage.setItem(this.storageKey, JSON.stringify(employees));
      return employees[index];
    }
    return null;
  }

  deleteEmployee(id) {
    const employees = this.getAllEmployees();
    const filteredEmployees = employees.filter(emp => emp.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredEmployees));
    return true;
  }

  searchEmployees(query) {
    const lowerCaseQuery = query.toLowerCase().trim();
    const employees = this.getAllEmployees();
    
    if (!lowerCaseQuery) {
      return employees;
    }

    return employees.filter(employee => {
      const firstName = employee.firstName.toLowerCase();
      const lastName = employee.lastName.toLowerCase();
      const email = employee.email.toLowerCase();
      const department = employee.department.toLowerCase();
      const position = employee.position.toLowerCase();
      
      if (firstName.includes(lowerCaseQuery) ||
          lastName.includes(lowerCaseQuery) ||
          email.includes(lowerCaseQuery) ||
          department.includes(lowerCaseQuery) ||
          position.includes(lowerCaseQuery)) {
        return true;
      }
      
      const queryWords = lowerCaseQuery.split(/\s+/).filter(word => word.length > 0);
      
      if (queryWords.length > 1) {
        const fullName = `${firstName} ${lastName}`;
        if (fullName.includes(lowerCaseQuery)) {
          return true;
        }
        
        const allWordsMatch = queryWords.every(word => 
          firstName.includes(word) || lastName.includes(word)
        );
        
        if (allWordsMatch) {
          return true;
        }
      }
      
      return false;
    });
  }
}

export const employeeService = new EmployeeService(); 