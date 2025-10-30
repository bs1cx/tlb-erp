export class ReportTemplates {
    constructor() {
        this.templates = [
            {
                id: 1,
                name: 'Financial Summary',
                description: 'Comprehensive financial performance overview',
                category: 'Financial',
                modules: ['finance', 'sales'],
                frequency: 'Monthly',
                complexity: 'Advanced'
            },
            {
                id: 2,
                name: 'Inventory Analysis',
                description: 'Stock levels and inventory turnover analysis',
                category: 'Operations',
                modules: ['inventory'],
                frequency: 'Weekly',
                complexity: 'Intermediate'
            },
            {
                id: 3,
                name: 'HR Analytics',
                description: 'Employee performance and attendance reports',
                category: 'Human Resources',
                modules: ['hr'],
                frequency: 'Quarterly',
                complexity: 'Intermediate'
            },
            {
                id: 4,
                name: 'Customer Insights',
                description: 'Customer behavior and satisfaction metrics',
                category: 'Customer Service',
                modules: ['crm'],
                frequency: 'Monthly',
                complexity: 'Advanced'
            },
            {
                id: 5,
                name: 'Sales Dashboard',
                description: 'Real-time sales performance metrics',
                category: 'Financial',
                modules: ['sales', 'crm'],
                frequency: 'Daily',
                complexity: 'Basic'
            },
            {
                id: 6,
                name: 'Operational Efficiency',
                description: 'Logistics and operational performance',
                category: 'Operations',
                modules: ['logistics', 'inventory'],
                frequency: 'Monthly',
                complexity: 'Advanced'
            }
        ];
    }

    render() {
        return `
            <div class="templates-section">
                <div class="section-header">
                    <h3><i class="fas fa-layer-group"></i> Report Templates</h3>
                    <button class="btn btn-primary" onclick="reportsModule.createTemplate()">
                        <i class="fas fa-plus"></i> New Template
                    </button>
                </div>

                <div class="templates-grid">
                    ${this.renderTemplates()}
                </div>
            </div>
        `;
    }

    renderTemplates() {
        return this.templates.map(template => `
            <div class="template-card">
                <div class="template-header">
                    <div class="template-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <div class="template-info">
                        <h4>${template.name}</h4>
                        <span class="category-badge category-${template.category.toLowerCase().replace(' ', '-')}">
                            ${template.category}
                        </span>
                    </div>
                </div>
                <p class="template-description">${template.description}</p>
                <div class="template-meta">
                    <div class="meta-item">
                        <i class="fas fa-sync"></i>
                        <span>${template.frequency}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-cube"></i>
                        <span>${template.complexity}</span>
                    </div>
                </div>
                <div class="template-modules">
                    ${template.modules.map(module => `
                        <span class="module-tag">${module}</span>
                    `).join('')}
                </div>
                <div class="template-actions">
                    <button class="btn btn-sm btn-primary" onclick="reportsModule.useTemplate(${template.id})">
                        Use Template
                    </button>
                    <button class="btn-icon" onclick="reportsModule.previewTemplate(${template.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}
