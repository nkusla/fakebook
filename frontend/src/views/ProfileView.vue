<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <p class="mt-4 text-h6">Loading profile...</p>
        </div>

        <!-- Error State -->
        <v-alert
          v-else-if="error"
          type="error"
          variant="outlined"
          class="mb-4"
        >
          {{ error }}
        </v-alert>

        <!-- Profile Content -->
        <v-card v-else elevation="3">
          <!-- Profile Header -->
          <v-card-title class="pb-2">
            <div class="d-flex align-center w-100">
              <v-avatar
                color="primary"
                size="80"
                class="mr-4"
              >
                <span class="text-h4 text-white font-weight-bold">
                  {{ avatarInitials }}
                </span>
              </v-avatar>
              <div class="flex-grow-1">
                <h2 class="text-h5 font-weight-bold">{{ fullName }}</h2>
                <p class="text-subtitle-1 text-black ma-0">@{{ user.username }}</p>
              </div>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <!-- Profile Information -->
          <v-card-text class="py-4">
            <v-list class="pa-0">

              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-email</v-icon>
                </template>
                <v-list-item-title class="font-weight-medium">Email</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-map-marker</v-icon>
                </template>
                <v-list-item-title class="font-weight-medium">Address</v-list-item-title>
                <v-list-item-subtitle>{{ user.address }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- User Posts Section -->
        <div v-if="!loading && !error" class="mt-6">
          <div class="d-flex align-center justify-space-between w-100 mb-4">
            <h3 class="text-h6 font-weight-bold">Posts</h3>
            <v-chip
              color="primary"
              variant="outlined"
              size="small"
            >
              {{ posts.length }} {{ posts.length === 1 ? 'post' : 'posts' }}
            </v-chip>
          </div>

          <!-- Loading Posts -->
          <div v-if="postsLoading" class="text-center py-4">
            <v-progress-circular
              indeterminate
              color="primary"
              size="48"
            ></v-progress-circular>
            <p class="mt-2 text-body-2">Loading posts...</p>
          </div>

          <!-- No Posts -->
          <div v-else-if="posts.length === 0" class="text-center py-8">
            <v-icon
              size="64"
              color="grey-lighten-1"
              class="mb-3"
            >
              mdi-post-outline
            </v-icon>
            <p class="text-h6 text-grey-darken-1">No posts yet</p>
            <p class="text-body-2 text-grey">Start sharing your thoughts!</p>
          </div>

          <!-- Posts List -->
          <div v-else>
            <Post
              v-for="post in posts"
              :key="post.id"
              :post="post"
              :disableLike="true"
              @like-toggled="handleLikeToggled"
            />
          </div>

          <!-- Posts Error -->
          <v-alert
            v-if="postsError"
            type="error"
            variant="outlined"
            class="mt-4"
          >
            {{ postsError }}
          </v-alert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axiosInstance from '@/utils/axiosInstance'
import Post from '@/components/Post.vue'

export default {
  name: 'ProfileView',
  components: {
    Post
  },
  data() {
    return {
      user: {
        username: '',
        name: '',
        surname: '',
        email: '',
        address: ''
      },
      posts: [],
      loading: true,
      postsLoading: false,
      error: null,
      postsError: null
    }
  },
  computed: {
    fullName() {
      return `${this.user.name} ${this.user.surname}`
    },
    avatarInitials() {
      return `${this.user.name.charAt(0)}${this.user.surname.charAt(0)}`.toUpperCase()
    }
  },
  async mounted() {
    await this.fetchUserProfile()
    await this.fetchUserPosts()
  },
  methods: {
    async fetchUserProfile() {
      try {
        this.loading = true
        const auth = JSON.parse(localStorage.getItem('auth'))
        if (!auth) {
          this.$router.push('/login')
          return
        }

        const response = await axiosInstance.get('/user/profile')
        this.user = response.data
      } catch (error) {
        console.error('Error fetching user profile:', error)
        this.error = 'Failed to load profile data'
      } finally {
        this.loading = false
      }
    },

    async fetchUserPosts() {
      try {
        this.postsLoading = true
        this.postsError = null

        const auth = JSON.parse(localStorage.getItem('auth'))
        if (!auth) {
          this.$router.push('/login')
          return
        }

        const response = await axiosInstance.get('/post/')
        this.posts = response.data || []
      } catch (error) {
        console.error('Error fetching user posts:', error)
        if (error.response && error.response.status === 404) {
          // No posts found is not an error, just empty array
          this.posts = []
        } else {
          this.postsError = 'Failed to load posts'
        }
      } finally {
        this.postsLoading = false
      }
    },

    async handleLikeToggled(event) {
      try {
        const { postId, isLiked } = event

        if (isLiked) {
          await axiosInstance.post(`/post/${postId}/like`)

          // Update the like count in the local posts array
          const postIndex = this.posts.findIndex(p => p.id === postId)
          if (postIndex !== -1) {
            this.posts[postIndex].likeCount += 1
          }
        }
        // Note: Unlike functionality would need to be implemented in the backend
      } catch (error) {
        console.error('Error toggling like:', error)
        // You might want to show a snackbar or alert here
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-list-item {
  min-height: 48px;
}

.v-list-item-title {
  color: rgba(0,0,0,0.87) !important;
}

.v-list-item-subtitle {
  color: rgba(0,0,0,0.6) !important;
  font-size: 0.9rem;
}
</style>