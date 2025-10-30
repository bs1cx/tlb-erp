export default {
  name: 'ShipmentList',
  template: `
    <div class="shipment-list">
      <h3>Active Shipments</h3>
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search shipments...">
      </div>
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
                <button class="btn btn-sm">Update</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}
