export default {
  name: 'CustomerModal',
  props: ['customer'],
  template: `
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Customer' : 'Add New Customer' }}</h3>
          <button class="btn-close" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="saveCustomer" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Company Name *</label>
              <input type="text" v-model="formData.company" required>
            </div>

            <div class="form-group">
              <label>Contact Person *</label>
              <input type="text" v-model="formData.contact" required>
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input type="email" v-model="formData.email" required>
            </div>

            <div class="form-group">
              <label>Phone</label>
              <input type="tel" v-model="formData.phone">
            </div>

            <div class="form-group">
              <label>Status</label>
              <select v-model="formData.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="prospect">Prospect</option>
              </select>
            </div>

            <div class="form-group">
              <label>Source</label>
              <select v-model="formData.source">
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social">Social Media</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label>Customer Value ($ CAD)</label>
              <input type="number" v-model="formData.value" min="0" step="0.01">
            </div>

            <div class="form-group full-width">
              <label>Address</label>
              <textarea v-model="formData.address" rows="3" placeholder="Full address..."></textarea>
            </div>

            <div class="form-group full-width">
              <label>Notes</label>
              <textarea v-model="formData.notes" rows="4" placeholder="Additional notes..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Update Customer' : 'Create Customer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,

  data() {
    return {
      formData: {
        company: '',
        contact: '',
        email: '',
        phone: '',
        status: 'active',
        source: 'website',
        value: 0,
        address: '',
        notes: '',
        tags: []
      }
    }
  },

  computed: {
    isEditing() {
      return !!this.customer
    }
  },

  mounted() {
    if (this.customer) {
      this.loadCustomerData()
    }
  },

  methods: {
    loadCustomerData() {
      if (this.customer) {
        this.formData = { ...this.formData, ...this.customer }
      }
    },

    saveCustomer() {
      const customerData = {
        ...this.formData,
        lastContact: new Date().toISOString().split('T')[0]
      }
      this.$emit('save', customerData)
    }
  }
}
