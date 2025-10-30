export class ReportsStats {
    constructor() {
        this.stats = {
            totalReports: 156,
            scheduledReports: 12,
            reportTemplates: 28,
            dataSources: 8
        };
    }

    render() {
        return `
            <div class="reports-stats">
                <div class="stat-card">
                    <div class="stat-icon total">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.stats.totalReports}</div>
                        <div class="stat-label">Total Reports</div>
                        <div class="stat-trend positive">
                            <i class="fas fa-arrow-up"></i>
                            +23 this month
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon scheduled">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.stats.scheduledReports}</div>
                        <div class="stat-label">Scheduled Reports</div>
                        <div class="stat-trend">
                            <i class="fas fa-sync"></i>
                            5 running now
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon templates">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.stats.reportTemplates}</div>
                        <div class="stat-label">Report Templates</div>
                        <div class="stat-trend positive">
                            <i class="fas fa-arrow-up"></i>
                            +3 new templates
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon sources">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.stats.dataSources}</div>
                        <div class="stat-label">Data Sources</div>
                        <div class="stat-trend">
                            <i class="fas fa-check"></i>
                            All connected
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
