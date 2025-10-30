import { reportsService } from '../services/reports.js';

class ReportsStore {
    constructor() {
        this.reports = [];
        this.templates = [];
        this.stats = {};
        this.loading = false;
        this.currentReport = null;
    }

    async initialize() {
        this.loading = true;
        try {
            await Promise.all([
                this.loadReports(),
                this.loadTemplates(),
                this.loadStats()
            ]);
        } catch (error) {
            console.error('Error initializing reports store:', error);
        } finally {
            this.loading = false;
        }
    }

    async loadReports() {
        this.reports = await reportsService.getReports();
    }

    async loadTemplates() {
        this.templates = await reportsService.getReportTemplates();
    }

    async loadStats() {
        this.stats = await reportsService.getReportStats();
    }

    async generateReport(reportId, parameters = {}) {
        this.loading = true;
        try {
            const result = await reportsService.generateReport(reportId, parameters);
            if (result.success) {
                // Update the report's last run date
                const report = this.reports.find(r => r.id === reportId);
                if (report) {
                    report.lastRun = new Date().toISOString().split('T')[0];
                    report.status = 'completed';
                }
            }
            return result;
        } finally {
            this.loading = false;
        }
    }

    getReportsByCategory(category) {
        if (!category || category === 'All') return this.reports;
        return this.reports.filter(report => report.category === category);
    }

    getTemplatesByCategory(category) {
        if (!category || category === 'All') return this.templates;
        return this.templates.filter(template => template.category === category);
    }

    getPopularReports(limit = 5) {
        return this.reports
            .sort((a, b) => b.lastRun.localeCompare(a.lastRun))
            .slice(0, limit);
    }
}

export const reportsStore = new ReportsStore();
