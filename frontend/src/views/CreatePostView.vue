<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h2 class="text-h5 font-weight-bold mb-6 d-flex align-center">
          <v-icon icon="mdi-post" class="mr-2"></v-icon>
          Create post
        </h2>

        <v-form v-model="valid" @submit.prevent="createPost">
              <!-- Post Content -->
              <v-textarea
                v-model="content"
                label="What's on your mind?"
                placeholder="Share your thoughts..."
                :rules="contentRules"
                rows="4"
                auto-grow
                counter="1000"
                required
                class="mb-4"
              ></v-textarea>

              <!-- Hashtags Input -->
              <v-text-field
                v-model="hashtagInput"
                label="Hashtags (optional)"
                placeholder="Enter hashtags separated by commas (e.g., zeka, jej)"
                hint="Separate multiple hashtags with commas"
                persistent-hint
                class="mb-4"
              ></v-text-field>

              <!-- Hashtag Preview -->
              <div v-if="hashtags.length > 0" class="mb-4">
                <p class="text-body-2 text-grey-darken-1 mb-2">Hashtag Preview:</p>
                <v-chip
                  v-for="hashtag in hashtags"
                  :key="hashtag"
                  size="small"
                  color="blue"
                  variant="outlined"
                  class="mr-1 mb-1"
                >
                  #{{ hashtag }}
                </v-chip>
              </div>

              <!-- Error Message -->
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="outlined"
                class="mb-4"
              >
                {{ errorMessage }}
              </v-alert>
            </v-form>

            <!-- Form Actions -->
            <div class="d-flex justify-end mt-4">
              <v-btn
                variant="outlined"
                color="grey"
                @click="resetForm"
                :disabled="loading"
                class="mr-2"
              >
                Clear
              </v-btn>
              <v-btn
                variant="elevated"
                color="primary"
                @click="createPost"
                :disabled="!valid || loading"
                :loading="loading"
              >
                Create Post
              </v-btn>
            </div>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" color="success">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axiosInstance from '@/utils/axiosInstance'

export default {
  name: 'CreatePostView',
  data() {
    return {
      valid: false,
      loading: false,
      content: '',
      hashtagInput: '',
      errorMessage: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarTimeout: 2500,
      contentRules: [
        v => !!v || 'Content is required',
        v => (v && v.length >= 1) || 'Content must be at least 1 character',
        v => (v && v.length <= 1000) || 'Content must be less than 1000 characters'
      ]
    }
  },
  computed: {
    hashtags() {
      if (!this.hashtagInput.trim()) return []
      return this.hashtagInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => tag.replace(/^#/, '')) // Remove # if user includes it
    }
  },
  methods: {
    async createPost() {
      if (!this.valid) return

      this.loading = true
      this.errorMessage = ''

      try {
        const postData = {
          content: this.content,
          hashtags: this.hashtags.length > 0 ? this.hashtags : null
        }

        await axiosInstance.post('/post', postData)

        this.snackbarMessage = 'Post created successfully!'
        this.snackbar = true
        this.resetForm()

        // Redirect to home after a short delay
        setTimeout(() => {
          this.$router.push('/')
        }, this.snackbarTimeout)

      } catch (error) {
        console.error('Error creating post:', error)
        this.errorMessage = error.response?.data?.error || 'Failed to create post. Please try again.'
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.content = ''
      this.hashtagInput = ''
      this.errorMessage = ''
      this.valid = false
    }
  },

  mounted() {
    // Check if user is authenticated
    const auth = localStorage.getItem('auth')
    if (!auth) {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.v-container {
  max-width: 100%;
}

.v-card {
  transition: all 0.3s ease;
}

.v-textarea :deep(.v-field__input) {
  font-size: 1rem;
  line-height: 1.5;
}
</style>