export class RecruitmentList {
    constructor() {
        this.jobOpenings = [];
        this.applicants = [];
    }

    render() {
        return `
            <div class="recruitment-section">
                <div class="section-header">
                    <h3><i class="fas fa-briefcase"></i> Recruitment</h3>
                    <button class="btn btn-primary" onclick="hrModule.createJobPosting()">
                        <i class="fas fa-plus"></i> New Job Posting
                    </button>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">12</div>
                        <div class="stat-label">Open Positions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">45</div>
                        <div class="stat-label">Total Applicants</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">8</div>
                        <div class="stat-label">Interviews Scheduled</div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Applicants</th>
                                <th>Status</th>
                                <th>Posted Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderJobOpenings()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderJobOpenings() {
        return `
            <tr>
                <td>Senior Developer</td>
                <td>Technology</td>
                <td>15</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td>2024-01-10</td>
                <td class="action-buttons">
                    <button class="btn-icon" title="View Applicants">
                        <i class="fas fa-users"></i>
                    </button>
                    <button class="btn-icon" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
            <tr>
                <td>HR Specialist</td>
                <td>Human Resources</td>
                <td>8</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td>2024-01-12</td>
                <td class="action-buttons">
                    <button class="btn-icon" title="View Applicants">
                        <i class="fas fa-users"></i>
                    </button>
                    <button class="btn-icon" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }
}
