<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="50"
          ></v-progress-circular>
          <p class="mt-4 text-grey">Loading posts...</p>
        </div>

        <!-- Posts List -->
        <div v-else-if="posts.length > 0">
          <Post
            v-for="post in posts"
            :key="post.id"
            :post="post"
            @like-toggled="handleLikeToggled"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-post-outline</v-icon>
          <h3 class="text-h6 mt-4 mb-2">No posts yet</h3>
          <p class="text-body-2 text-grey">Be the first to share something!</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Post from '@/components/Post.vue'
import axiosInstance from '@/utils/axiosInstance'

export default {
  name: 'HomeView',
  components: {
    Post
  },
  data() {
    return {
      loading: false,
      posts: []
    }
  },
  methods: {
    async handleLikeToggled(data) {
      const postId = data.postId
      try {
        await axiosInstance.post(`/post/${postId}/like`)
        const post = this.posts.find(p => p.id === postId)
        if (post) {
          post.isLiked = true
          post.likeCount += 1
        }
      } catch (error) {
        console.error('Error liking post:', error)
      }
    },

    async fetchPosts() {
      this.loading = true
      try {
        const response = await axiosInstance.get('/post/feed')
        this.posts = response.data
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        this.loading = false
      }
    }
  },

  mounted() {
    const auth = localStorage.getItem('auth')
    if (!auth) {
      this.$router.push('/login')
      return
    }

    this.fetchPosts()
  }
}
</script>

<style scoped>
.v-container {
  max-width: 100%;
}
</style>