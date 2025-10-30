export class PerformanceReviews {
    constructor() {
        this.reviews = [];
        this.performanceMetrics = ['Exceeds Expectations', 'Meets Expectations', 'Needs Improvement', 'Unsatisfactory'];
    }

    render() {
        return `
            <div class="performance-section">
                <div class="section-header">
                    <h3><i class="fas fa-chart-line"></i> Performance Reviews</h3>
                    <button class="btn btn-primary" onclick="hrModule.scheduleReview()">
                        <i class="fas fa-plus"></i> Schedule Review
                    </button>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">89%</div>
                        <div class="stat-label">Satisfactory Performance</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">12</div>
                        <div class="stat-label">Reviews This Month</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">45</div>
                        <div class="stat-label">Total Employees Reviewed</div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Review Date</th>
                                <th>Reviewer</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderPerformanceReviews()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderPerformanceReviews() {
        return `
            <tr>
                <td>Michael Brown</td>
                <td>2024-01-15</td>
                <td>HR Manager</td>
                <td>
                    <span class="status-badge status-active">Exceeds Expectations</span>
                </td>
                <td><span class="status-badge status-active">Completed</span></td>
                <td class="action-buttons">
                    <button class="btn-icon" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Download Report">
                        <i class="fas fa-download"></i>
                    </button>
                </td>
            </tr>
            <tr>
                <td>Emily Davis</td>
                <td>2024-01-18</td>
                <td>Department Head</td>
                <td>
                    <span class="status-badge status-pending">Meets Expectations</span>
                </td>
                <td><span class="status-badge status-pending">Scheduled</span></td>
                <td class="action-buttons">
                    <button class="btn-icon" title="Reschedule">
                        <i class="fas fa-calendar"></i>
                    </button>
                    <button class="btn-icon" title="Cancel">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        `;
    }
}
