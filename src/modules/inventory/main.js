export default {
  name: 'InventoryPage',
  template: `
    <div class="inventory-module">
      <!-- Header -->
      <div class="module-header">
        <div class="header-content">
          <h1><i class="fas fa-boxes"></i> Inventory Management</h1>
          <p>Manage stock levels, track products, and optimize inventory operations</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="showAddProduct">
            <i class="fas fa-plus"></i> Add Product
          </button>
          <button class="btn btn-secondary" @click="exportInventory">
            <i class="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <inventory-stats :stats="inventoryStats"></inventory-stats>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
        <div class="action-grid">
          <button class="action-card" @click="showAddProduct">
            <div class="action-icon">
              <i class="fas fa-plus"></i>
            </div>
            <span>Add Product</span>
          </button>
          <button class="action-card" @click="showStockAdjustment">
            <div class="action-icon">
              <i class="fas fa-exchange-alt"></i>
            </div>
            <span>Stock Adjustment</span>
          </button>
          <button class="action-card" @click="showInventoryCount">
            <div class="action-icon">
              <i class="fas fa-clipboard-check"></i>
            </div>
            <span>Inventory Count</span>
          </button>
          <button class="action-card" @click="showReorderReport">
            <div class="action-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <span>Reorder Report</span>
          </button>
        </div>
      </div>

      <!-- Main Content Tabs -->
      <div class="inventory-tabs">
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
          <!-- Products Tab -->
          <div v-if="activeTab === 'products'" class="tab-pane">
            <product-list 
              :products="products"
              @edit-product="editProduct"
              @adjust-stock="showStockAdjustment"
              @view-movements="viewProductMovements"
            ></product-list>
          </div>

          <!-- Categories Tab -->
          <div v-if="activeTab === 'categories'" class="tab-pane">
            <category-management 
              :categories="categories"
              @add-category="showAddCategory"
              @edit-category="editCategory"
            ></category-management>
          </div>

          <!-- Movements Tab -->
          <div v-if="activeTab === 'movements'" class="tab-pane">
            <movement-history 
              :movements="recentMovements"
              @add-movement="showStockAdjustment"
            ></movement-history>
          </div>

          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'" class="tab-pane">
            <inventory-analytics 
              :analyticsData="analyticsData"
              @generate-report="generateReport"
            ></inventory-analytics>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <product-modal 
        v-if="showProductModal"
        :product="editingProduct"
        @save="saveProduct"
        @close="closeProductModal"
      ></product-modal>

      <stock-modal 
        v-if="showStockModal"
        :product="selectedProduct"
        @save="saveStockAdjustment"
        @close="closeStockModal"
      ></stock-modal>
    </div>
  `,

  components: {
    'inventory-stats': () => import('./components/inventory-stats.js'),
    'product-list': () => import('./components/product-list.js'),
    'category-management': () => import('./components/category-management.js'),
    'movement-history': () => import('./components/movement-history.js'),
    'inventory-analytics': () => import('./components/inventory-analytics.js'),
    'product-modal': () => import('./components/product-modal.js'),
    'stock-modal': () => import('./components/stock-modal.js')
  },

  data() {
    return {
      activeTab: 'products',
      tabs: [
        { id: 'products', label: 'Products', icon: 'fas fa-box', badge: 1234 },
        { id: 'categories', label: 'Categories', icon: 'fas fa-tags' },
        { id: 'movements', label: 'Movements', icon: 'fas fa-exchange-alt', badge: 45 },
        { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' }
      ],
      showProductModal: false,
      showStockModal: false,
      editingProduct: null,
      selectedProduct: null,
      inventoryStats: {
        totalProducts: 0,
        lowStockItems: 0,
        outOfStock: 0,
        totalValue: 0
      },
      products: [],
      categories: [],
      recentMovements: [],
      analyticsData: {}
    }
  },

  async mounted() {
    await this.loadInventoryData()
  },

  methods: {
    async loadInventoryData() {
      // Load inventory data from API
      this.inventoryStats = {
        totalProducts: 1234,
        lowStockItems: 45,
        outOfStock: 12,
        totalValue: 285000
      }

      this.products = [
        {
          id: 1,
          sku: 'LP-001',
          name: 'Laptop Pro',
          category: 'electronics',
          currentStock: 5,
          reorderLevel: 10,
          cost: 1200,
          price: 1899,
          status: 'low_stock',
          supplier: 'Tech Suppliers Inc.',
          lastUpdated: '2023-09-22'
        },
        {
          id: 2,
          sku: 'WM-045',
          name: 'Wireless Mouse',
          category: 'accessories',
          currentStock: 8,
          reorderLevel: 15,
          cost: 25,
          price: 49,
          status: 'low_stock',
          supplier: 'Accessory World',
          lastUpdated: '2023-09-21'
        },
        {
          id: 3,
          sku: 'KB-100',
          name: 'Mechanical Keyboard',
          category: 'accessories',
          currentStock: 25,
          reorderLevel: 10,
          cost: 45,
          price: 89,
          status: 'in_stock',
          supplier: 'Keyboard Masters',
          lastUpdated: '2023-09-20'
        }
      ]

      this.categories = [
        {
          id: 1,
          name: 'Electronics',
          productCount: 156,
          lowStockCount: 8
        },
        {
          id: 2,
          name: 'Accessories',
          productCount: 234,
          lowStockCount: 12
        }
      ]

      this.recentMovements = [
        {
          id: 1,
          product: 'Laptop Pro',
          type: 'sale',
          quantity: -2,
          reference: 'SO-2023-1001',
          date: '2023-09-22 14:30',
          user: 'John Smith'
        },
        {
          id: 2,
          product: 'Wireless Mouse',
          type: 'purchase',
          quantity: 50,
          reference: 'PO-2023-0456',
          date: '2023-09-21 10:15',
          user: 'Sarah Johnson'
        }
      ]
    },

    showAddProduct() {
      this.editingProduct = null
      this.showProductModal = true
    },

    editProduct(product) {
      this.editingProduct = product
      this.showProductModal = true
    },

    async saveProduct(productData) {
      // Save product logic
      console.log('Saving product:', productData)
      this.showProductModal = false
      await this.loadInventoryData()
    },

    closeProductModal() {
      this.showProductModal = false
      this.editingProduct = null
    },

    showStockAdjustment(product = null) {
      this.selectedProduct = product
      this.showStockModal = true
    },

    async saveStockAdjustment(adjustmentData) {
      // Save stock adjustment logic
      console.log('Saving stock adjustment:', adjustmentData)
      this.showStockModal = false
      await this.loadInventoryData()
    },

    closeStockModal() {
      this.showStockModal = false
      this.selectedProduct = null
    },

    viewProductMovements(product) {
      console.log('Viewing product movements:', product)
      this.activeTab = 'movements'
    },

    showAddCategory() {
      console.log('Add category clicked')
    },

    editCategory(category) {
      console.log('Edit category:', category)
    },

    showInventoryCount() {
      console.log('Inventory count clicked')
    },

    showReorderReport() {
      console.log('Reorder report clicked')
    },

    async generateReport() {
      // Generate inventory report
      console.log('Generating inventory report...')
    },

    exportInventory() {
      console.log('Exporting inventory data...')
    }
  }
}
