<template>
  <div>

    <div class="page-header">
      <h1>Dashboard</h1>
      <span class="dashboard-date">{{ todayDate }}</span>
    </div>

    <!-- STAT CARDS -->
    <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon stat-icon-purple">
            <i class="ti ti-article" aria-hidden="true"></i>
          </div>
          <span class="stat-number">{{ postStore.totalPosts }}</span>
          <span class="stat-label">Total Posts</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-green">
            <i class="ti ti-circle-check" aria-hidden="true"></i>
          </div>
          <span class="stat-number">{{ postStore.publishedPosts.length }}</span>
          <span class="stat-label">Published</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-amber">
            <i class="ti ti-pencil" aria-hidden="true"></i>
          </div>
          <span class="stat-number">{{ postStore.draftPosts.length }}</span>
          <span class="stat-label">Drafts</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue">
            <i class="ti ti-photo" aria-hidden="true"></i>
          </div>
          <span class="stat-number">{{ mediaStore.totalFiles }}</span>
          <span class="stat-label">Media Files</span>
        </div>
      </div>

    <!-- CHARTS ROW -->
    <div class="charts-row">

      <!-- Posts by Status — Doughnut -->
      <!-- Doughnut chart card -->
<div class="chart-card">
  <h3><i class="ti ti-chart-donut" aria-hidden="true"></i> Posts by status</h3>
  <div class="chart-wrap">
    <canvas ref="doughnutRef"></canvas>
  </div>
</div>

<!-- Bar chart card -->
<div class="chart-card chart-card-wide">
  <h3><i class="ti ti-chart-bar" aria-hidden="true"></i> Posts by category</h3>
  <div class="chart-wrap">
    <canvas ref="barRef"></canvas>
  </div>
</div>

      <!-- Posts by Category — Bar -->
      <div class="chart-card chart-card-wide">
        <h3>Posts by category</h3>
        <div class="chart-wrap">
          <canvas ref="barRef"></canvas>
        </div>
      </div>

    </div>

    <!-- BOTTOM ROW -->
    <div class="dashboard-bottom">

      <!-- RECENT POSTS -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <h3>Recent posts</h3>
          <RouterLink to="/posts" class="dash-link">View all →</RouterLink>
        </div>
        <table class="cms-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in recentPosts" :key="post._id">
              <td>{{ post.title }}</td>
              <td>
                <span
                  class="badge":class="post.status === 'published' ? 'badge-published' : 'badge-draft'">
                  {{ post.status }}
                </span>
              </td>
              <td>{{ formatDate(post.createdAt) }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- QUICK ACTIONS -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <h3>Quick actions</h3>
        </div>
        <div class="quick-actions">
            <RouterLink to="/posts/new" class="quick-action-btn">
              <i class="ti ti-plus" aria-hidden="true"></i>
              <span>New Post</span>
            </RouterLink>
            <RouterLink to="/media" class="quick-action-btn">
              <i class="ti ti-upload" aria-hidden="true"></i>
              <span>Upload Media</span>
            </RouterLink>
            <RouterLink to="/posts" class="quick-action-btn">
              <i class="ti ti-list" aria-hidden="true"></i>
              <span>All Posts</span>
            </RouterLink>
            <RouterLink to="/settings" class="quick-action-btn">
              <i class="ti ti-settings" aria-hidden="true"></i>
              <span>Settings</span>
            </RouterLink>
        </div>

        <!-- CMS HEALTH -->
        <div class="cms-health">
          <h4>CMS health</h4>
          <div class="health-item">
            <span>Published rate</span>
            <div class="health-bar">
              <div
                class="health-fill"
                :style="{ width: publishedRate + '%' }"
              ></div>
            </div>
            <span class="health-value">{{ publishedRate }}%</span>
          </div>
          <div class="health-item">
            <span>Media used</span>
            <div class="health-bar">
              <div
                class="health-fill health-fill-blue"
                :style="{ width: Math.min(mediaStore.totalFiles * 10, 100) + '%' }"
              ></div>
            </div>
            <span class="health-value">{{ mediaStore.totalFiles }} files</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Chart, DoughnutController, BarController,
         ArcElement, BarElement, CategoryScale,
         LinearScale, Tooltip, Legend } from 'chart.js'
import { usePostsStore  } from '../stores/posts.js'
import { useMediaStore  } from '../stores/media.js'
import { useFormatDate } from '../composables/useFormatDate.js'
const { today, formatDate, formatRelative } = useFormatDate()
const todayDate = today()

// Register only what we need from Chart.js
Chart.register(
  DoughnutController, BarController,
  ArcElement, BarElement,
  CategoryScale, LinearScale,
  Tooltip, Legend
)

const postStore  = usePostsStore()
const mediaStore = useMediaStore()

// Canvas refs
const doughnutRef = ref(null)
const barRef      = ref(null)

// Today's date
//const { today, formatDate } = useFormatDate()
//const todayDate = today()

// Recent posts — latest 5
const recentPosts = computed(() =>
  [...postStore.posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
)

// Published rate percentage
const publishedRate = computed(() => {
  if (!postStore.totalPosts) return 0
  return Math.round((postStore.publishedPosts.length / postStore.totalPosts) * 100)
})

// Posts grouped by category
const categoryData = computed(() => {
  const counts = {}
  postStore.posts.forEach(post => {
    const cat = post.category || 'uncategorized'
    counts[cat] = (counts[cat] || 0) + 1
  })
  return counts
})

onMounted(() => {
  // ---- DOUGHNUT CHART ----
  new Chart(doughnutRef.value, {
    type: 'doughnut',
    data: {
      labels: ['Published', 'Draft'],
      datasets: [{
        data: [
          postStore.publishedPosts.length,
          postStore.draftPosts.length,
        ],
        backgroundColor: ['#4caf50', '#ff9800'],
        borderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom' },
      },
      cutout: '65%',
    },
  })

  // ---- BAR CHART ----
  const cats   = Object.keys(categoryData.value)
  const counts = Object.values(categoryData.value)

  new Chart(barRef.value, {
    type: 'bar',
    data: {
      labels: cats,
      datasets: [{
        label: 'Posts',
        data: counts,
        backgroundColor: '#5c5ce0',
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          grid: { color: '#f0f0f0' },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  })
})
</script>