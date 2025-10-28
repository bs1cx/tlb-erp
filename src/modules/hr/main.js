export default {
  name: 'HRPage',
  template: `
    <div class="hr">
      <div class="page-header">
        <h1><i class="fas fa-user-tie"></i> Human Resources</h1>
        <button class="btn btn-primary" @click="addEmployee">
          <i class="fas fa-user-plus"></i> Add Employee
        </button>
      </div>

      <div class="hr-stats">
        <div class="stat-card">
          <div class="stat-value">24</div>
          <div class="stat-label">Total Employees</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">3</div>
          <div class="stat-label">On Leave</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$85K</div>
          <div class="stat-label">Monthly Payroll</div>
        </div>
      </div>

      <div class="employees-section">
        <h3>Employee Directory</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id">
              <td>{{ employee.name }}</td>
              <td>{{ employee.position }}</td>
              <td>{{ employee.department }}</td>
              <td>{{ employee.email }}</td>
              <td>
                <span :class="['status-badge', employee.status]">
                  {{ employee.status }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm" @click="viewEmployee(employee)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm" @click="editEmployee(employee)">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,

  data() {
    return {
      employees: [
        {
          id: 1,
          name: 'John Smith',
          position: 'Sales Manager',
          department: 'Sales',
          email: 'john@company.com',
          status: 'active'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          position: 'Accountant',
          department: 'Finance',
          email: 'sarah@company.com',
          status: 'active'
        }
      ]
    }
  },

  methods: {
    addEmployee() {
      alert('Add employee functionality coming soon!')
    },
    viewEmployee(employee) {
      alert(`Viewing employee: ${employee.name}`)
    },
    editEmployee(employee) {
      alert(`Editing employee: ${employee.name}`)
    }
  },

  mounted() {
    const user = localStorage.getItem('tlb_user')
    if (!user) {
      this.$router.push('/login')
    }
  }
}
