export default {
  name: 'QuickActions',
  template: `
    <div class="quick-actions">
      <div class="section-header">
        <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
      </div>
      <div class="action-buttons">
        <button class="action-btn" @click="$emit('action', 'create_invoice')">
          <div class="action-icon">
            <i class="fas fa-file-invoice"></i>
          </div>
          <span>Create Invoice</span>
        </button>
        
        <button class="action-btn" @click="$emit('action', 'add_customer')">
          <div class="action-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <span>Add Customer</span>
        </button>
        
        <button class="action-btn" @click="$emit('action', 'new_shipment')">
          <div class="action-icon">
            <i class="fas fa-shipping-fast"></i>
          </div>
          <span>New Shipment</span>
        </button>
      </div>
    </div>
  `
}
