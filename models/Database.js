// In-memory database for scalability (easily replaceable with real DB)
class Database {
  constructor() {
    this.users = [
      {
        id: 1,
        email: 'admin@dance.com',
        password: '$2a$10$pPFbccqEFRczEzw/a/DaVOQDuyvl50LIuQk3u9q9oWUveLvPZoKIC',
        role: 'admin',
        createdAt: new Date()
      }
    ];
    this.students = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        course: 'Classical Dance',
        joinDate: '2024-01-15',
        status: 'active',
        createdAt: new Date()
      }
    ];
    this.instructors = [
      {
        id: 1,
        name: 'Jane Smith',
        specialization: 'Classical Dance',
        experience: 10,
        phone: '1234567890',
        createdAt: new Date()
      }
    ];
    this.courses = [
      {
        id: 1,
        name: 'Classical Dance',
        level: 'Beginner',
        duration: '12 weeks',
        maxStudents: 20,
        createdAt: new Date()
      }
    ];
    this.fees = [
      {
        id: 1,
        studentId: 1,
        amount: 5000,
        dueDate: '2024-02-15',
        status: 'Paid',
        createdAt: new Date()
      }
    ];
    this.attendance = [
      {
        id: 1,
        studentId: 1,
        date: '2024-01-20',
        status: 'Present',
        createdAt: new Date()
      }
    ];
  }

  // User methods
  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  createUser(userData) {
    const newUser = {
      id: Math.max(...this.users.map(u => u.id), 0) + 1,
      ...userData,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Generic CRUD methods
  findAll(collection) {
    return this[collection] || [];
  }

  findById(collection, id) {
    return this[collection]?.find(item => item.id === parseInt(id));
  }

  create(collection, data) {
    if (!this[collection]) return null;
    const newItem = {
      id: Math.max(...this[collection].map(item => item.id), 0) + 1,
      ...data,
      createdAt: new Date()
    };
    this[collection].push(newItem);
    return newItem;
  }

  update(collection, id, data) {
    const item = this.findById(collection, id);
    if (!item) return null;
    Object.assign(item, data, { updatedAt: new Date() });
    return item;
  }

  delete(collection, id) {
    const index = this[collection]?.findIndex(item => item.id === parseInt(id));
    if (index === -1 || index === undefined) return false;
    this[collection].splice(index, 1);
    return true;
  }
}

export default new Database();
