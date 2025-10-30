export class EmployeeList {
    constructor() {
        this.employees = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
    }

    async init() {
        await this.loadEmployees();
        return this.render();
    }

    async loadEmployees() {
        try {
            // Mock data
            this.employees = [
                {
                    id: 1,
                    name: "John Smith",
                    position: "Sales Manager",
                    department: "Sales",
                    email: "john@company.com",
                    phone: "+1-555-0101",
                    status: "active",
                    joinDate: "2022-03-15",
                    salary: 85000
                },
                {
                    id: 2,
                    name: "Sarah Johnson",
                    position: "Senior Accountant",
                    department: "Finance",
                    email: "sarah@company.com",
                    phone: "+1-555-0102",
                    status: "active",
                    joinDate: "2021-08-22",
                    salary: 75000
                },
                {
                    id: 3,
                    name: "Michael Chen",
                    position: "Software Developer",
                    department: "IT",
                    email: "michael@company.com",
                    phone: "+1-555-0103",
                    status: "active",
                    joinDate: "2023-01-10",
                    salary: 92000
                },
                {
                    id: 4,
                    name: "Emily Davis",
                    position: "HR Specialist",
                    department: "HR",
                    email: "emily@company.com",
                    phone: "+1-555-0104",
                    status: "on-leave",
                    joinDate: "2020-11-05",
                    salary: 68000
                }
            ];
        } catch (error) {
            console.error('Employee list loading error:', error);
        }
    }

    render() {
        return `
            <div class="employee-list-section">
                <div class="list-header">
                    <h3><i class="fas fa-users"></i> Employee Directory</h3>
                    <div class="list-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search employees..." id="employeeSearch">
                        </div>
                        <select class="filter-select" id="departmentFilter">
                            <option value="">All Departments</option>
                            <option value="Sales">Sales</option>
                            <option value="Finance">Finance</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                        <button class="btn btn-primary" onclick="hrModule.showAddEmployee()">
                            <i class="fas fa-user-plus"></i> Add Employee
                        </button>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Join Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.employees.map(employee => `
                                <tr>
                                    <td>
                                        <div class="employee-info">
                                            <strong>${employee.name}</strong>
                                            <div class="employee-id">ID: ${employee.id.toString().padStart(4, '0')}</div>
                                        </div>
                                    </td>
                                    <td>${employee.position}</td>
                                    <td>
                                        <span class="department-badge department-${employee.department.toLowerCase()}">
                                            ${employee.department}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="contact-info">
                                            <div><i class="fas fa-envelope"></i> ${employee.email}</div>
                                            <div><i class="fas fa-phone"></i> ${employee.phone}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="status-badge status-${employee.status}">
                                            ${employee.status === 'active' ? 'Active' : 
                                              employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>${employee.joinDate}</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-icon" title="View Profile" onclick="hrModule.viewEmployee(${employee.id})">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn-icon" title="Edit" onclick="hrModule.editEmployee(${employee.id})">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-icon" title="Send Message" onclick="hrModule.messageEmployee(${employee.id})">
                                                <i class="fas fa-envelope"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <button class="btn btn-secondary" disabled>Previous</button>
                    <span class="page-info">Page 1 of 1</span>
                    <button class="btn btn-secondary" disabled>Next</button>
                </div>
            </div>
        `;
    }
}
