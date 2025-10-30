export default {
  name: 'LogisticsPage',
  template: `
    <div class="logistics-module">
      <div class="module-header">
        <h2><i class="fas fa-truck"></i> Logistics & Shipping</h2>
        <button class="btn btn-success" style="width: auto;">
          <i class="fas fa-plus"></i> New Shipment
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">89%</div>
          <div>On-Time Delivery</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">23</div>
          <div>Active Shipments</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">5</div>
          <div>Delayed</div>
        </div>
      </div>

      <h3>Active Shipments</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tracking #</th>
            <th>Destination</th>
            <th>Status</th>
            <th>ETA</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>TRK-789456</strong></td>
            <td>Toronto, ON</td>
            <td><span class="status-badge status-active">In Transit</span></td>
            <td>2023-09-25</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm">Track</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>TRK-789457</strong></td>
            <td>Vancouver, BC</td>
            <td><span class="status-badge status-pending">Processing</span></td>
            <td>2023-09-28</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm">Track</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,

  data() {
    return {
      shipments: []
    }
  },

  mounted() {
    this.loadShipments()
  },

  methods: {
    loadShipments() {
      // Mock data
      this.shipments = [
        {
          id: 1,
          trackingNumber: 'TRK-789456',
          destination: 'Toronto, ON',
          status: 'active',
          eta: '2023-09-25'
        },
        {
          id: 2,
          trackingNumber: 'TRK-789457',
          destination: 'Vancouver, BC',
          status: 'pending',
          eta: '2023-09-28'
        }
      ]
    }
  }
}
