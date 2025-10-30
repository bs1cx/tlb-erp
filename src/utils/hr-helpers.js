export class HRHelpers {
    static calculateTenure(hireDate) {
        const hire = new Date(hireDate);
        const today = new Date();
        const years = today.getFullYear() - hire.getFullYear();
        const months = today.getMonth() - hire.getMonth();
        
        if (months < 0) {
            return `${years - 1} years, ${12 + months} months`;
        }
        return `${years} years, ${months} months`;
    }

    static formatEmployeeStatus(status) {
        const statusMap = {
            active: { class: 'status-active', text: 'Active' },
            inactive: { class: 'status-inactive', text: 'Inactive' },
            suspended: { class: 'status-pending', text: 'Suspended' },
            terminated: { class: 'status-delayed', text: 'Terminated' }
        };
        
        return statusMap[status] || statusMap.active;
    }

    static calculateLeaveBalance(employeeId, leaveType) {
        // Mock implementation - in real app, this would calculate from actual data
        const balances = {
            vacation: 15,
            sick: 10,
            personal: 5
        };
        
        return balances[leaveType] || 0;
    }

    static generateEmployeeId() {
        return 'EMP' + Date.now().toString().slice(-6);
    }

    static validateEmployeeData(data) {
        const errors = [];
        
        if (!data.name?.trim()) errors.push('Name is required');
        if (!data.email?.trim()) errors.push('Email is required');
        if (!data.department?.trim()) errors.push('Department is required');
        if (!data.position?.trim()) errors.push('Position is required');
        
        return errors;
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    static getDepartmentColor(department) {
        const colors = {
            technology: '#3b82f6',
            marketing: '#8b5cf6',
            sales: '#10b981',
            hr: '#f59e0b',
            finance: '#ef4444',
            operations: '#64748b'
        };
        
        return colors[department.toLowerCase()] || '#64748b';
    }
}
