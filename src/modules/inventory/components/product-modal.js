export default {
  name: 'ProductModal',
  props: ['product'],
  template: `
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
          <button class="btn-close" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" v-model="formData.name" required>
            </div>

            <div class="form-group">
              <label>SKU *</label>
              <input type="text" v-model="formData.sku" required>
            </div>

            <div class="form-group">
              <label>Category *</label>
              <select v-model="formData.category" required>
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="accessories">Accessories</option>
                <option value="furniture">Furniture</option>
                <option value="office">Office Supplies</option>
              </select>
            </div>

            <div class="form-group">
              <label>Supplier</label>
              <input type="text" v-model="formData.supplier">
            </div>

            <div class="form-group">
              <label>Cost Price ($ CAD) *</label>
              <input type="number" v-model="formData.cost" min="0" step="0.01" required>
            </div>

            <div class="form-group">
              <label>Selling Price ($ CAD) *</label>
              <input type="number" v-model="formData.price" min="0" step="0.01" required>
            </div>

            <div class="form-group">
              <label>Current Stock *</label>
              <input type="number" v-model="formData.currentStock" min="0" required>
            </div>

            <div class="form-group">
              <label>Reorder Level *</label>
              <input type="number" v-model="formData.reorderLevel" min="0" required>
            </div>

            <div class="form-group full-width">
              <label>Description</label>
              <textarea v-model="formData.description" rows="3" placeholder="Product description..."></textarea>
            </div>

            <div class="form-group full-width">
              <label>Notes</label>
              <textarea v-model="formData.notes" rows="2" placeholder="Additional notes..."></textarea>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="summary-section" v-if="formData.cost && formData.price">
            <h4>Price Summary</h4>
            <div class="summary-grid">
              <div class="summary-item">
                <span>Cost:</span>
                <span>{{ formatCurrency(formData.cost) }}</span>
              </div>
              <div class="summary-item">
                <span>Price:</span>
                <span>{{ formatCurrency(formData.price) }}</span>
              </div>
              <div class="summary-item">
                <span>Profit:</span>
                <span>{{ formatCurrency(formData.price - formData.cost) }}</span>
              </div>
              <div class="summary-item highlight">
                <span>Margin:</span>
                <span>{{ calculateMargin() }}%</span>
              </div>
            </div>
          </div>

          <!-- Stock Status -->
          <div class="status-section" v-if="formData.currentStock !== null && formData.reorderLevel !== null">
            <h4>Stock Status</h4>
            <div class="status-indicator" :class="getStockStatusClass()">
              <i :class="getStockStatusIcon()"></i>
              {{ getStockStatusText() }}
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Update Product' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,

  data() {
    return {
      formData: {
        name: '',
        sku: '',
        category: '',
        supplier: '',
        cost: 0,
        price: 0,
        currentStock: 0,
        reorderLevel: 0,
        description: '',
        notes: ''
      }
    }
  },

  computed: {
    isEditing() {
      return !!this.product
    }
  },

  mounted() {
    if (this.product) {
      this.loadProductData()
    }
  },

  methods: {
    loadProductData() {
      if (this.product) {
        this.formData = { ...this.formData, ...this.product }
      }
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(amount)
    },

    calculateMargin() {
      if (!this.formData.cost || !this.formData.price) return 0
      return (((this.formData.price - this.formData.cost) / this.formData.cost) * 100).toFixed(1)
    },

    getStockStatusClass() {
      if (this.formData.currentStock === 0) return 'status-out'
      if (this.formData.currentStock <= this.formData.reorderLevel) return 'status-low'
      return 'status-good'
    },

    getStockStatusIcon() {
      if (this.formData.currentStock === 0) return 'fas fa-times-circle'
      if (this.formData.currentStock <= this.formData.reorderLevel) return 'fas fa-exclamation-triangle'
      return 'fas fa-check-circle'
    },

    getStockStatusText() {
      if (this.formData.currentStock === 0) return 'Out of Stock'
      if (this.formData.currentStock <= this.formData.reorderLevel) return 'Low Stock'
      return 'In Stock'
    },

    saveProduct() {
      const productData = {
        ...this.formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
      this.$emit('save', productData)
    }
  }
}
