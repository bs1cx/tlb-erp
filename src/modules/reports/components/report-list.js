export class ReportList {
    constructor() {
        this.reports = [
            {
                id: 1,
                name: 'Monthly Sales Performance',
                type: 'sales',
                category: 'Financial',
                lastRun: '2024-01-15',
                status: 'completed',
                schedule: 'Monthly',
                createdBy: 'Finance Manager'
            },
            {
                id: 2,
                name: 'Inventory Stock Levels',
                type: 'inventory',
                category: 'Operations',
                lastRun: '2024-01-16',
                status: 'completed',
                schedule: 'Weekly',
                createdBy: 'Inventory Manager'
            },
            {
                id: 3,
                name: 'Employee Performance Review',
                type: 'hr',
                category: 'Human Resources',
                lastRun: '2024-01-14',
                status: 'running',
                schedule: 'Quarterly',
                createdBy: 'HR Director'
            },
            {
                id: 4,
                name: 'Customer Satisfaction Analysis',
                type: 'crm',
                category: 'Customer Service',
                lastRun: '2024-01-13',
                status: 'scheduled',
                schedule: 'Monthly',
                createdBy: 'CRM Manager'
            }
        ];
    }

    render() {
        return `
            <div class="report-list-section">
                <div class="list-header">
                    <h3><i class="fas fa-list"></i> Recent Reports</h3>
                    <div class="list-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search reports...">
                        </div>
                        <select class="filter-select">
                            <option>All Categories</option>
                            <option>Financial</option>
                            <option>Operations</option>
                            <option>Human Resources</option>
                            <option>Customer Service</option>
                        </select>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Report Name</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Last Run</th>
                                <th>Schedule</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderReports()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderReports() {
        return this.reports.map(report => `
            <tr>
                <td>
                    <strong>${report.name}</strong>
                    <div style="font-size: 12px; color: #64748b;">Created by: ${report.createdBy}</div>
                </td>
                <td><span class="category-badge category-${report.category.toLowerCase().replace(' ', '-')}">${report.category}</span></td>
                <td><span class="type-badge type-${report.type}">${report.type.toUpperCase()}</span></td>
                <td>${report.lastRun}</td>
                <td>${report.schedule}</td>
                <td>${this.getStatusBadge(report.status)}</td>
                <td class="action-buttons">
                    <button class="btn-icon" title="Run Report" onclick="reportsModule.runReport(${report.id})">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn-icon" title="View Results" onclick="reportsModule.viewReport(${report.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Download" onclick="reportsModule.downloadReport(${report.id})">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon" title="Schedule" onclick="reportsModule.scheduleReport(${report.id})">
                        <i class="fas fa-clock"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getStatusBadge(status) {
        const statusMap = {
            completed: { class: 'status-active', text: 'Completed' },
            running: { class: 'status-pending', text: 'Running' },
            scheduled: { class: 'status-in-transit', text: 'Scheduled' },
            failed: { class: 'status-delayed', text: 'Failed' }
        };
        
        const statusInfo = statusMap[status] || statusMap.completed;
        return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }
}
