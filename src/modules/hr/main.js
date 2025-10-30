import { HRStats } from './components/hr-stats.js';
import { EmployeeList } from './components/employee-list.js';
import { EmployeeModal } from './components/employee-modal.js';

export class HRModule {
    constructor() {
        this.hrStats = new HRStats();
        this.employeeList = new EmployeeList();
        this.employeeModal = new EmployeeModal();
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Load HR styles
            this.loadStyles();
            
            // Initialize components
            this.employeeModal.init();
            
            this.initialized = true;
            console.log('HR Module initialized');
        } catch (error) {
            console.error('HR Module initialization error:', error);
        }
    }

    async render() {
        await this.init();

        const statsHTML = await this.hrStats.init();
        const employeeListHTML = await this.employeeList.init();

        return `
            <div class="hr-module">
                <div class="module-header">
                    <div class="header-content">
                        <h1><i class="fas fa-user-tie"></i> Human Resources</h1>
                        <p>Manage employees, departments, and HR operations</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="hrModule.showAddEmployee()">
                            <i class="fas fa-user-plus"></i> Add Employee
                        </button>
                        <button class="btn btn-secondary" onclick="hrModule.exportHRData()">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>

                ${statsHTML}

                <div class="quick-actions-section">
                    <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
                    <div class="action-grid">
                        <button class="action-card" onclick="hrModule.showAddEmployee()">
                            <div class="action-icon">
                                <i class="fas fa-user-plus"></i>
                            </div>
                            <span>Add Employee</span>
                        </button>
                        <button class="action-card" onclick="hrModule.manageDepartments()">
                            <div class="action-icon">
                                <i class="fas fa-sitemap"></i>
                            </div>
                            <span>Manage Departments</span>
                        </button>
                        <button class="action-card" onclick="hrModule.processPayroll()">
                            <div class="action-icon">
                                <i class="fas fa-money-bill-wave"></i>
                            </div>
                            <span>Process Payroll</span>
                        </button>
                        <button class="action-card" onclick="hrModule.generateReports()">
                            <div class="action-icon">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                            <span>HR Reports</span>
                        </button>
                    </div>
                </div>

                ${employeeListHTML}
            </div>
        `;
    }

    loadStyles() {
        // Check if styles are already loaded
        if (document.getElementById('hr-styles')) return;

        const link = document.createElement('link');
        link.id = 'hr-styles';
        link.rel = 'stylesheet';
        link.href = './src/modules/hr/styles/hr.css';
        document.head.appendChild(link);
    }

    // Public methods
    async showAddEmployee() {
        this.employeeModal.open();
    }

    async editEmployee(employeeId) {
        // Find employee data and open modal in edit mode
        const employee = this.employeeList.employees.find(emp => emp.id === employeeId);
        if (employee) {
            this.employeeModal.open(employee);
        }
    }

    async viewEmployee(employeeId) {
        console.log('Viewing employee:', employeeId);
        // Implement view employee details
    }

    async messageEmployee(employeeId) {
        console.log('Messaging employee:', employeeId);
        // Implement messaging functionality
    }

    async refresh() {
        // Refresh the module
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            contentArea.innerHTML = await this.render();
        }
    }

    async manageDepartments() {
        console.log('Opening department management');
        // Implement department management
    }

    async processPayroll() {
        console.log('Processing payroll');
        // Implement payroll processing
    }

    async generateReports() {
        console.log('Generating HR reports');
        // Implement report generation
    }

    async exportHRData() {
        console.log('Exporting HR data');
        // Implement data export
    }
}

// Global instance
window.hrModule = new HRModule();
