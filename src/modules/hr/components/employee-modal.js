export class EmployeeModal {
    constructor() {
        this.modal = null;
    }

    init() {
        this.createModal();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal hidden';
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="employeeModalTitle">Add Employee</h3>
                    <button class="btn-icon" onclick="this.close()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="employeeForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>First Name *</label>
                                <input type="text" id="firstName" required>
                            </div>
                            <div class="form-group">
                                <label>Last Name *</label>
                                <input type="text" id="lastName" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Position *</label>
                            <input type="text" id="position" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Department *</label>
                                <select id="department" required>
                                    <option value="">Select Department</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Finance">Finance</option>
                                    <option value="IT">IT</option>
                                    <option value="HR">HR</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Operations">Operations</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Status</label>
                                <select id="status">
                                    <option value="active">Active</option>
                                    <option value="on-leave">On Leave</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" id="email" required>
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="tel" id="phone">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Salary</label>
                                <input type="number" id="salary" step="0.01">
                            </div>
                            <div class="form-group">
                                <label>Join Date</label>
                                <input type="date" id="joinDate">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Address</label>
                            <textarea id="address" rows="3"></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.close()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Employee</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        // Form submit event
        this.modal.querySelector('#employeeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    open(employeeData = null) {
        if (employeeData) {
            this.populateForm(employeeData);
            this.modal.querySelector('#employeeModalTitle').textContent = 'Edit Employee';
        } else {
            this.clearForm();
            this.modal.querySelector('#employeeModalTitle').textContent = 'Add Employee';
        }
        this.modal.classList.remove('hidden');
    }

    close() {
        this.modal.classList.add('hidden');
    }

    populateForm(employeeData) {
        const form = this.modal.querySelector('#employeeForm');
        form.querySelector('#firstName').value = employeeData.name.split(' ')[0] || '';
        form.querySelector('#lastName').value = employeeData.name.split(' ')[1] || '';
        form.querySelector('#position').value = employeeData.position || '';
        form.querySelector('#department').value = employeeData.department || '';
        form.querySelector('#status').value = employeeData.status || 'active';
        form.querySelector('#email').value = employeeData.email || '';
        form.querySelector('#phone').value = employeeData.phone || '';
        form.querySelector('#salary').value = employeeData.salary || '';
        form.querySelector('#joinDate').value = employeeData.joinDate || '';
        form.querySelector('#address').value = employeeData.address || '';
    }

    clearForm() {
        const form = this.modal.querySelector('#employeeForm');
        form.reset();
    }

    async saveEmployee() {
        const form = this.modal.querySelector('#employeeForm');
        const formData = new FormData(form);
        
        const employeeData = {
            name: `${formData.get('firstName')} ${formData.get('lastName')}`,
            position: formData.get('position'),
            department: formData.get('department'),
            status: formData.get('status'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            salary: parseFloat(formData.get('salary')) || 0,
            joinDate: formData.get('joinDate'),
            address: formData.get('address')
        };

        try {
            // Save logic here
            console.log('Saving employee:', employeeData);
            this.close();
            // Refresh employee list
            if (window.hrModule) {
                await window.hrModule.refresh();
            }
        } catch (error) {
            console.error('Error saving employee:', error);
        }
    }
}
