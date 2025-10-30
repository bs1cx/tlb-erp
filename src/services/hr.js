export class HRService {
    constructor() {
        this.baseURL = '/api/hr';
    }

    async getEmployees() {
        try {
            // Simulated API call
            return [
                {
                    id: 1,
                    name: 'John Smith',
                    department: 'Technology',
                    position: 'Senior Developer',
                    email: 'john.smith@company.com',
                    hireDate: '2022-03-15',
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'Sarah Johnson',
                    department: 'Marketing',
                    position: 'Marketing Manager',
                    email: 'sarah.j@company.com',
                    hireDate: '2021-08-10',
                    status: 'active'
                }
            ];
        } catch (error) {
            console.error('Error fetching employees:', error);
            return [];
        }
    }

    async getHRStats() {
        return {
            totalEmployees: 142,
            activeEmployees: 135,
            newHires: 12,
            turnoverRate: '4.2%',
            departmentDistribution: {
                technology: 45,
                marketing: 23,
                sales: 34,
                hr: 8,
                finance: 18,
                operations: 14
            }
        };
    }

    async getLeaveRequests() {
        return [
            {
                id: 1,
                employeeName: 'John Smith',
                leaveType: 'Vacation',
                startDate: '2024-02-01',
                endDate: '2024-02-07',
                status: 'pending'
            },
            {
                id: 2,
                employeeName: 'Sarah Johnson',
                leaveType: 'Sick Leave',
                startDate: '2024-01-20',
                endDate: '2024-01-22',
                status: 'approved'
            }
        ];
    }

    async getRecruitmentData() {
        return {
            openPositions: 12,
            totalApplicants: 45,
            interviewsScheduled: 8,
            jobPostings: [
                {
                    id: 1,
                    title: 'Senior Developer',
                    department: 'Technology',
                    applicants: 15,
                    status: 'active'
                }
            ]
        };
    }
}

export const hrService = new HRService();
