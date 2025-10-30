export class HRStats {
    constructor() {
        this.stats = {
            totalEmployees: 0,
            activeEmployees: 0,
            onLeave: 0,
            departments: 0,
            avgTenure: 0
        };
    }

    async init() {
        await this.loadStats();
        return this.render();
    }

    async loadStats() {
        try {
            // Mock data - gerçek uygulamada API'den gelecek
            this.stats = {
                totalEmployees: 156,
                activeEmployees: 142,
                onLeave: 8,
                departments: 12,
                avgTenure: 2.8
            };
        } catch (error) {
            console.error('HR stats loading error:', error);
        }
    }

    render() {
        return `
            <div class="hr-stats-grid">
                <div class="stat-card">
                    <div class="stat-icon employees">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.stats.totalEmployees}</div>
                        <div class="stat-label">Total Employees</div>
                        <div class="stat-trend positive">
                            <i class="fas fa-arrow-up"></i>
                            +12 this year
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon active">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.stats.activeEmployees}</div>
                        <div class="stat-label">Active Employees</div>
                        <div class="stat-trend positive">
                            <i class="fas fa-check"></i>
                            94.7% active rate
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon leave">
                        <i class="fas fa-umbrella-beach"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.stats.onLeave}</div>
                        <div class="stat-label">On Leave</div>
                        <div class="stat-trend warning">
                            <i class="fas fa-clock"></i>
                            5.1% of workforce
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon departments">
                        <i class="fas fa-sitemap"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${this.stats.departments}</div>
                        <div class="stat-label">Departments</div>
                        <div class="stat-trend">
                            <i class="fas fa-building"></i>
                            6 teams
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
