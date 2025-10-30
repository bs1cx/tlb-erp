import { hrService } from '../services/hr.js';

class HRStore {
    constructor() {
        this.employees = [];
        this.stats = {};
        this.leaveRequests = [];
        this.recruitmentData = {};
        this.loading = false;
    }

    async initialize() {
        this.loading = true;
        try {
            await Promise.all([
                this.loadEmployees(),
                this.loadStats(),
                this.loadLeaveRequests(),
                this.loadRecruitmentData()
            ]);
        } catch (error) {
            console.error('Error initializing HR store:', error);
        } finally {
            this.loading = false;
        }
    }

    async loadEmployees() {
        this.employees = await hrService.getEmployees();
    }

    async loadStats() {
        this.stats = await hrService.getHRStats();
    }

    async loadLeaveRequests() {
        this.leaveRequests = await hrService.getLeaveRequests();
    }

    async loadRecruitmentData() {
        this.recruitmentData = await hrService.getRecruitmentData();
    }

    getEmployeeById(id) {
        return this.employees.find(emp => emp.id === parseInt(id));
    }

    getEmployeesByDepartment(department) {
        return this.employees.filter(emp => emp.department === department);
    }

    getPendingLeaveRequests() {
        return this.leaveRequests.filter(request => request.status === 'pending');
    }

    getActiveRecruitment() {
        return this.recruitmentData.jobPostings?.filter(job => job.status === 'active') || [];
    }
}

export const hrStore = new HRStore();
