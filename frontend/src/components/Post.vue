<template>
  <v-card
    class="mb-4"
    elevation="2"
    :class="{ 'popular-post': post.recommendationTag === 'Popular' }"
  >
    <!-- Post Header -->
    <v-card-title class="pb-2">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <v-avatar
            color="primary"
            size="40"
            class="mr-3"
          >
            <span class="text-white font-weight-bold">
              {{ post.authorUsername.charAt(0).toUpperCase() }}
            </span>
          </v-avatar>
          <div>
            <div class="font-weight-bold">@{{ post.authorUsername }}</div>
            <div class="text-caption text-grey">
              {{ formatDate(post.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Recommendation Tag -->
        <v-chip
          v-if="post.recommendationTag"
          size="small"
          variant="outlined"
          :color="post.recommendationTag === 'Popular' ? 'orange' : 'primary'"
        >
          <v-icon
            v-if="post.recommendationTag === 'Popular'"
            start
          >
            mdi-fire
          </v-icon>
          <v-icon
            v-else-if="post.recommendationTag === 'From friends'"
            start
          >
            mdi-account
          </v-icon>
          <v-icon
            v-else
            start
          >
            mdi-pound
          </v-icon>
          {{ post.recommendationTag }}
        </v-chip>
      </div>
    </v-card-title>

    <!-- Post Content -->
    <v-card-text class="py-3">
      <div class="text-body-1 mb-3">
        {{ post.content }}
      </div>

      <!-- Hashtags -->
      <div v-if="post.hashtags && post.hashtags.length > 0" class="mb-2">
        <v-chip
          v-for="hashtag in post.hashtags"
          :key="hashtag"
          size="default"
          color="blue"
          variant="text"
          class="mr-1"
        >
          #{{ hashtag }}
        </v-chip>
      </div>
    </v-card-text>

    <!-- Post Actions -->
    <v-card-actions class="px-4 pb-3">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <!-- Like Button -->
          <v-btn
            icon
            variant="text"
            size="default"
            @click="toggleLike"
            :color="isLiked ? 'red' : 'grey'"
            :disabled="!post.canBeLiked || isLiked"
          >
            <v-icon size="20">
              {{ !post.canBeLiked ? 'mdi-heart' : (isLiked ? 'mdi-heart' : 'mdi-heart-outline') }}
            </v-icon>
          </v-btn>

          <!-- Like Count -->
          <span class="text-body-2 ml-1">
            {{ post.likeCount }} {{ post.likeCount === 1 ? 'like' : 'likes' }}
          </span>
        </div>

        <!-- Post Score and Report Button -->
        <div class="d-flex align-center">
          <v-chip
            v-if="post.score > 0"
            size="small"
            color="primary"
            variant="outlined"
            class="mr-2"
          >
            Score: {{ post.score }}
          </v-chip>

          <!-- Report Button -->
          <v-btn
            variant="text"
            size="small"
            @click="reportPost"
            :disabled="!post.canBeReported || isReported"
            color="grey"
            class="text-caption"
          >
            <v-icon size="16" start>
              {{ !post.canBeReported ? 'mdi-flag' : (isReported ? 'mdi-flag' : 'mdi-flag-outline') }}
            </v-icon>
            Report
          </v-btn>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Post',
  props: {
    post: {
      type: Object,
      required: true,
      validator(value) {
        return value &&
               typeof value.id !== 'undefined' &&
               typeof value.authorUsername === 'string' &&
               typeof value.content === 'string' &&
               typeof value.createdAt === 'string' &&
               typeof value.likeCount === 'number' &&
               typeof value.score === 'number'
      }
    }
  },
  data() {
    return {
      isLiked: false,
      isReported: false
    }
  },
  methods: {
    formatDate(dateString) {
      return dateString
    },

    toggleLike() {
      if (!this.isLiked && this.post.canBeLiked) {
        this.isLiked = true
        // Emit event to parent component to handle like logic
        this.$emit('like-toggled', {
          postId: this.post.id,
        })
      }
    },

    reportPost() {
      if (!this.isReported && this.post.canBeReported) {
        this.isReported = true
        // Emit event to parent component to handle report logic
        this.$emit('post-reported', {
          postId: this.post.id,
        })
      }
    }
  },
  emits: ['like-toggled', 'post-reported']
}
</script>

<style scoped>

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.text-caption {
  font-size: 0.75rem !important;
}
</style>