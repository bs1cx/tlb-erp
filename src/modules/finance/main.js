export default {
  name: 'FinancePage',
  template: `
    <div class="finance-module">
      <!-- Header -->
      <div class="module-header">
        <div class="header-content">
          <h1><i class="fas fa-file-invoice-dollar"></i> Finance & Accounting</h1>
          <p>Manage invoices, payments, and financial reports</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="showCreateInvoice">
            <i class="fas fa-plus"></i> New Invoice
          </button>
          <button class="btn btn-secondary" @click="exportFinancials">
            <i class="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <finance-stats :stats="financialStats"></finance-stats>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
        <div class="action-grid">
          <button class="action-card" @click="showCreateInvoice">
            <div class="action-icon">
              <i class="fas fa-file-invoice"></i>
            </div>
            <span>Create Invoice</span>
          </button>
          <button class="action-card" @click="showReceivePayment">
            <div class="action-icon">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <span>Receive Payment</span>
          </button>
          <button class="action-card" @click="showTaxReport">
            <div class="action-icon">
              <i class="fas fa-receipt"></i>
            </div>
            <span>Tax Report</span>
          </button>
          <button class="action-card" @click="showExpenseTracking">
            <div class="action-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <span>Expense Tracking</span>
          </button>
        </div>
      </div>

      <!-- Main Content Tabs -->
      <div class="finance-tabs">
        <div class="tab-headers">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-header', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
            <span class="tab-badge" v-if="tab.badge">{{ tab.badge }}</span>
          </button>
        </div>

        <div class="tab-content">
          <!-- Invoices Tab -->
          <div v-if="activeTab === 'invoices'" class="tab-pane">
            <invoice-list 
              :invoices="invoices"
              @edit-invoice="editInvoice"
              @delete-invoice="deleteInvoice"
              @view-invoice="viewInvoice"
            ></invoice-list>
          </div>

          <!-- Payments Tab -->
          <div v-if="activeTab === 'payments'" class="tab-pane">
            <payment-list 
              :payments="payments"
              @record-payment="showRecordPayment"
            ></payment-list>
          </div>

          <!-- Expenses Tab -->
          <div v-if="activeTab === 'expenses'" class="tab-pane">
            <expense-list 
              :expenses="expenses"
              @add-expense="showAddExpense"
            ></expense-list>
          </div>

          <!-- Tax Tab -->
          <div v-if="activeTab === 'tax'" class="tab-pane">
            <tax-overview 
              :taxData="taxData"
              @generate-report="generateTaxReport"
            ></tax-overview>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <invoice-modal 
        v-if="showInvoiceModal"
        :invoice="editingInvoice"
        @save="saveInvoice"
        @close="closeInvoiceModal"
      ></invoice-modal>

      <payment-modal 
        v-if="showPaymentModal"
        @save="savePayment"
        @close="closePaymentModal"
      ></payment-modal>
    </div>
  `,

  components: {
    'finance-stats': () => import('./components/finance-stats.js'),
    'invoice-list': () => import('./components/invoice-list.js'),
    'payment-list': () => import('./components/payment-list.js'),
    'expense-list': () => import('./components/expense-list.js'),
    'tax-overview': () => import('./components/tax-overview.js'),
    'invoice-modal': () => import('./components/invoice-modal.js'),
    'payment-modal': () => import('./components/payment-modal.js')
  },

  data() {
    return {
      activeTab: 'invoices',
      tabs: [
        { id: 'invoices', label: 'Invoices', icon: 'fas fa-file-invoice', badge: 23 },
        { id: 'payments', label: 'Payments', icon: 'fas fa-money-bill-wave', badge: 15 },
        { id: 'expenses', label: 'Expenses', icon: 'fas fa-receipt', badge: 8 },
        { id: 'tax', label: 'Tax', icon: 'fas fa-percentage' }
      ],
      showInvoiceModal: false,
      showPaymentModal: false,
      editingInvoice: null,
      financialStats: {
        totalRevenue: 0,
        outstanding: 0,
        overdue: 0,
        taxCollected: 0
      },
      invoices: [],
      payments: [],
      expenses: [],
      taxData: {}
    }
  },

  async mounted() {
    await this.loadFinancialData()
  },

  methods: {
    async loadFinancialData() {
      // Load financial data from API
      this.financialStats = {
        totalRevenue: 125430,
        outstanding: 24500,
        overdue: 8500,
        taxCollected: 15670
      }

      this.invoices = [
        {
          id: 'INV-2023-1001',
          customer: 'Acme Corporation',
          date: '2023-09-15',
          dueDate: '2023-10-15',
          amount: 2500.00,
          tax: 325.00,
          total: 2825.00,
          status: 'paid',
          currency: 'CAD'
        },
        {
          id: 'INV-2023-1002',
          customer: 'Global Tech Inc.',
          date: '2023-09-18',
          dueDate: '2023-10-18',
          amount: 1800.00,
          tax: 234.00,
          total: 2034.00,
          status: 'pending',
          currency: 'CAD'
        }
      ]

      this.payments = [
        {
          id: 'PAY-2023-0456',
          invoiceId: 'INV-2023-1001',
          customer: 'Acme Corporation',
          date: '2023-09-20',
          amount: 2825.00,
          method: 'bank_transfer',
          status: 'completed'
        }
      ]
    },

    showCreateInvoice() {
      this.editingInvoice = null
      this.showInvoiceModal = true
    },

    editInvoice(invoice) {
      this.editingInvoice = invoice
      this.showInvoiceModal = true
    },

    async saveInvoice(invoiceData) {
      // Save invoice logic
      console.log('Saving invoice:', invoiceData)
      this.showInvoiceModal = false
      await this.loadFinancialData()
    },

    closeInvoiceModal() {
      this.showInvoiceModal = false
      this.editingInvoice = null
    },

    showReceivePayment() {
      this.showPaymentModal = true
    },

    async savePayment(paymentData) {
      // Save payment logic
      console.log('Saving payment:', paymentData)
      this.showPaymentModal = false
      await this.loadFinancialData()
    },

    closePaymentModal() {
      this.showPaymentModal = false
    },

    viewInvoice(invoice) {
      console.log('Viewing invoice:', invoice)
      // Navigate to invoice detail view
    },

    deleteInvoice(invoice) {
      if (confirm(`Are you sure you want to delete invoice ${invoice.id}?`)) {
        console.log('Deleting invoice:', invoice)
        this.loadFinancialData()
      }
    },

    showTaxReport() {
      this.activeTab = 'tax'
    },

    showExpenseTracking() {
      this.activeTab = 'expenses'
    },

    showRecordPayment() {
      this.showPaymentModal = true
    },

    showAddExpense() {
      console.log('Add expense clicked')
    },

    async generateTaxReport() {
      // Generate tax report logic
      console.log('Generating tax report...')
    },

    exportFinancials() {
      console.log('Exporting financial data...')
    }
  }
}
