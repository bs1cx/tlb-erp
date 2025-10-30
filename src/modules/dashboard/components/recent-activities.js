export default {
  name: 'RecentActivities',
  props: ['activities'],
  template: `
    <div class="recent-activity">
      <div class="section-header">
        <h3><i class="fas fa-clock"></i> Recent Activity</h3>
        <button class="btn btn-sm" @click="$emit('view-all')">View All</button>
      </div>
      <div class="activity-list">
        <div v-for="activity in activities" :key="activity.title" class="activity-item" :class="activity.type">
          <div class="activity-icon">
            <i :class="activity.icon"></i>
          </div>
          <div class="activity-content">
            <strong>{{ activity.title }}</strong>
            <span>{{ activity.description }}</span>
          </div>
          <span class="activity-time">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  `
}
