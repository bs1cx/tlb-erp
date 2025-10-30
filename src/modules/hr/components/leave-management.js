export class LeaveManagement {
    constructor() {
        this.leaveRequests = [];
        this.leaveTypes = ['Vacation', 'Sick Leave', 'Personal Leave', 'Maternity/Paternity', 'Bereavement'];
    }

    render() {
        return `
            <div class="leave-section">
                <div class="section-header">
                    <h3><i class="fas fa-calendar-alt"></i> Leave Management</h3>
                    <button class="btn btn-primary" onclick="hrModule.requestLeave()">
                        <i class="fas fa-plus"></i> Request Leave
                    </button>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">23</div>
                        <div class="stat-label">Pending Requests</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">156</div>
                        <div class="stat-label">Approved This Month</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">5</div>
                        <div class="stat-label">Rejected</div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Leave Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderLeaveRequests()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderLeaveRequests() {
        return `
            <tr>
                <td>John Smith</td>
                <td>Vacation</td>
                <td>2024-02-01</td>
                <td>2024-02-07</td>
                <td>5 days</td>
                <td><span class="status-badge status-pending">Pending</span></td>
                <td class="action-buttons">
                    <button class="btn-icon btn-success" title="Approve">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-icon btn-danger" title="Reject">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
            <tr>
                <td>Sarah Johnson</td>
                <td>Sick Leave</td>
                <td>2024-01-20</td>
                <td>2024-01-22</td>
                <td>3 days</td>
                <td><span class="status-badge status-active">Approved</span></td>
                <td class="action-buttons">
                    <button class="btn-icon" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }
}
