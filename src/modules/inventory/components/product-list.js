export default {
  name: 'ProductList',
  props: ['products'],
  template: `
    <div class="product-list">
      <div class="list-header">
        <h3>Product Catalog</h3>
        <div class="list-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search products..." v-model="searchQuery">
          </div>
          <select v-model="categoryFilter" class="filter-select">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="accessories">Accessories</option>
            <option value="furniture">Furniture</option>
            <option value="office">Office Supplies</option>
          </select>
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Cost/Price</th>
              <th>Supplier</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="product-info">
                  <strong>{{ product.name }}</strong>
                  <div class="product-meta">
                    <span class="stock-value" :class="getStockValueClass(product)">
                      Value: {{ formatCurrency(product.currentStock * product.cost) }}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <code class="sku-code">{{ product.sku }}</code>
              </td>
              <td>
                <span class="category-badge" :class="'category-' + product.category">
                  {{ getCategoryName(product.category) }}
                </span>
              </td>
              <td>
                <div class="stock-info">
                  <div class="stock-level">
                    <span class="stock-quantity">{{ product.currentStock }}</span>
                    <span class="stock-label">in stock</span>
                  </div>
                  <div class="reorder-info" v-if="product.currentStock <= product.reorderLevel">
                    Reorder at: {{ product.reorderLevel }}
                  </div>
                  <div class="stock-bar">
                    <div class="stock-fill" :style="{ width: getStockPercentage(product) + '%' }" 
                         :class="getStockBarClass(product)"></div>
                  </div>
                </div>
              </td>
              <td>
                <div class="price-info">
                  <div class="cost">Cost: {{ formatCurrency(product.cost) }}</div>
                  <div class="price">Price: {{ formatCurrency(product.price) }}</div>
                  <div class="margin" :class="getMarginClass(product)">
                    Margin: {{ calculateMargin(product) }}%
                  </div>
                </div>
              </td>
              <td>
                <div class="supplier-info">
                  {{ product.supplier }}
                </div>
              </td>
              <td>
                <div class="update-info">
                  {{ formatDate(product.lastUpdated) }}
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="$emit('edit-product', product)" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon" @click="$emit('adjust-stock', product)" title="Adjust Stock">
                    <i class="fas fa-exchange-alt"></i>
                  </button>
                  <button class="btn-icon" @click="$emit('view-movements', product)" title="View Movements">
                    <i class="fas fa-history"></i>
                  </button>
                  <button class="btn-icon btn-danger" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="list-footer" v-if="filteredProducts.length === 0">
        <div class="empty-state">
          <i class="fas fa-box-open"></i>
          <h4>No products found</h4>
          <p>No products match your current filters.</p>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      searchQuery: '',
      categoryFilter: '',
      statusFilter: ''
    }
  },

  computed: {
    filteredProducts() {
      let filtered = this.products

      // Apply search filter
      if (this.searchQuery) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.supplier.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      // Apply category filter
      if (this.categoryFilter) {
        filtered = filtered.filter(product => product.category === this.categoryFilter)
      }

      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter(product => product.status === this.statusFilter)
      }

      return filtered
    }
  },

  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(amount)
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-CA')
    },

    getCategoryName(category) {
      const categoryNames = {
        'electronics': 'Electronics',
        'accessories': 'Accessories',
        'furniture': 'Furniture',
        'office': 'Office Supplies'
      }
      return categoryNames[category] || category
    },

    getStockPercentage(product) {
      const maxStock = Math.max(product.reorderLevel * 2, product.currentStock)
      return (product.currentStock / maxStock) * 100
    },

    getStockBarClass(product) {
      if (product.currentStock === 0) return 'stock-out'
      if (product.currentStock <= product.reorderLevel) return 'stock-low'
      return 'stock-good'
    },

    getStockValueClass(product) {
      const value = product.currentStock * product.cost
      if (value > 10000) return 'value-high'
      if (value > 5000) return 'value-medium'
      return 'value-low'
    },

    calculateMargin(product) {
      return (((product.price - product.cost) / product.cost) * 100).toFixed(1)
    },

    getMarginClass(product) {
      const margin = this.calculateMargin(product)
      if (margin > 50) return 'margin-high'
      if (margin > 25) return 'margin-medium'
      return 'margin-low'
    }
  }
}
