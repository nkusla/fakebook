<template>
  <v-card
    class="mx-auto mb-4 place-card"
    max-width="600"
    elevation="2"
    rounded="lg"
  >
    <!-- Place Header -->
    <v-card-title class="d-flex align-center pa-4">
      <v-icon color="primary" size="large" class="mr-3">
        mdi-map-marker
      </v-icon>
      <div>
        <h3 class="text-h5 font-weight-bold">{{ place.name }}</h3>
        <div class="text-subtitle-1 text-medium-emphasis">
          {{ place.city }}, {{ place.country }}
        </div>
      </div>
    </v-card-title>

    <!-- Place Description -->
    <v-card-text v-if="place.description" class="px-4 py-2">
      <p class="text-body-1">{{ place.description }}</p>
    </v-card-text>

    <!-- Hashtag -->
    <v-card-text v-if="place.hashtag" class="px-4 pt-0 pb-2">
      <v-chip
        color="primary"
        variant="outlined"
        size="small"
        prepend-icon="mdi-pound"
      >
        {{ place.hashtag }}
      </v-chip>
    </v-card-text>

    <!-- Place Actions -->
    <v-card-actions class="px-4 pb-4">
      <v-btn
        v-if="!hasCurrentUserRated"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-star"
        @click="onRatePlace"
      >
        Rate Place
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        v-if="ratingCount > 0"
        color="secondary"
        variant="text"
        append-icon="mdi-open-in-new"
        @click="onViewRatings"
      >
        View Ratings
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- Ratings Dialog -->
  <v-dialog v-model="ratingsDialog" max-width="600" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon color="primary" size="large" class="mr-3">
          mdi-star-outline
        </v-icon>
        <div>
          <h3 class="text-h5 font-weight-bold">Ratings for {{ place.name }}</h3>
          <div class="text-subtitle-1 text-medium-emphasis">
            {{ ratings.length }} {{ ratings.length === 1 ? 'rating' : 'ratings' }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="ratingsDialog = false"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-0" style="max-height: 400px;">
        <!-- Loading State -->
        <div v-if="loadingRatings" class="text-center pa-6">
          <v-progress-circular
            color="primary"
            indeterminate
            size="48"
          ></v-progress-circular>
          <p class="mt-3 text-body-1">Loading ratings...</p>
        </div>

        <!-- No Ratings State -->
        <div v-else-if="ratings.length === 0" class="text-center pa-6">
          <v-icon
            color="grey-lighten-1"
            size="64"
            class="mb-3"
          >
            mdi-star-off
          </v-icon>
          <h4 class="text-h6 text-grey-lighten-1 mb-2">No Ratings Yet</h4>
          <p class="text-body-2 text-grey-lighten-1">
            Be the first to rate this place!
          </p>
        </div>

        <!-- Ratings List -->
        <v-list v-else class="pa-0">
          <template v-for="(rating, index) in ratings" :key="index">
            <v-list-item class="px-4 py-3">
              <template v-slot:prepend>
                <v-avatar
                  color="primary"
                  size="40"
                >
                  <span class="text-white font-weight-bold">
                    {{ rating.username.charAt(0).toUpperCase() }}
                  </span>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold">
                @{{ rating.username }}
              </v-list-item-title>

              <v-list-item-subtitle class="mt-1">
                <div class="d-flex align-center">
                  <v-rating
                    :model-value="rating.rating"
                    color="amber"
                    density="compact"
                    readonly
                    size="small"
                  ></v-rating>
                  <span class="ml-2 text-body-2">{{ rating.rating }}/5</span>
                </div>
                <div v-if="rating.hashtag" class="mt-2">
                  <v-chip
                    color="primary"
                    variant="outlined"
                    size="x-small"
                    prepend-icon="mdi-pound"
                  >
                    {{ rating.hashtag }}
                  </v-chip>
                </div>
              </v-list-item-subtitle>
            </v-list-item>
            <v-divider v-if="index < ratings.length - 1"></v-divider>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Rating Dialog -->
  <v-dialog v-model="ratingDialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon color="primary" size="large" class="mr-3">
          mdi-star
        </v-icon>
        <div>
          <h3 class="text-h5 font-weight-bold">Rate {{ place.name }}</h3>
          <div class="text-subtitle-1 text-medium-emphasis">
            Share your experience
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeRatingDialog"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <div class="mb-4">
          <h4 class="text-h6 mb-3">Your Rating</h4>
          <div class="d-flex align-center justify-center mb-2">
            <v-rating
              v-model="newRating.rating"
              color="amber"
              size="large"
              hover
            ></v-rating>
          </div>
          <div class="text-center text-body-2 text-medium-emphasis">
            {{ newRating.rating ? `${newRating.rating}/5 stars` : 'Select a rating' }}
          </div>
        </div>

        <div class="mb-4">
          <h4 class="text-h6 mb-3">Hashtag (Optional)</h4>
          <v-text-field
            v-model="newRating.hashtag"
            placeholder="Enter a hashtag (e.g., #amazing, #peaceful)"
            prepend-inner-icon="mdi-pound"
            variant="outlined"
            density="comfortable"
          ></v-text-field>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="text"
          @click="closeRatingDialog"
          :disabled="submittingRating"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="submitRating"
          :disabled="newRating.rating === 0 || submittingRating"
          :loading="submittingRating"
        >
          Submit Rating
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axiosInstance from '@/utils/axiosInstance'

export default {
  name: 'Place',
  props: {
    place: {
      type: Object,
      required: true,
      validator(value) {
        return value &&
               typeof value.id === 'number' &&
               typeof value.name === 'string' &&
               typeof value.country === 'string' &&
               typeof value.city === 'string';
      }
    }
  },
  data() {
    return {
      ratings: [],
      loadingRatings: false,
      ratingsDialog: false,
      ratingDialog: false,
      currentUser: null,
      newRating: {
        rating: 0,
        hashtag: ''
      },
      submittingRating: false
    }
  },
  async mounted() {
    this.getCurrentUser()
    await this.fetchRatings()
  },
  computed: {
    hasCurrentUserRated() {
      if (!this.currentUser || !this.ratings.length) return false
      return this.ratings.some(rating => rating.username === this.currentUser.username)
    },
    averageRating() {
      if (!this.ratings.length) return null
      const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0)
      return sum / this.ratings.length
    },
    ratingCount() {
      return this.ratings.length
    }
  },
  methods: {
    getCurrentUser() {
      try {
        this.currentUser = JSON.parse(localStorage.getItem('auth'))
      } catch {
        this.currentUser = null
      }
    },
    async fetchRatings() {
      try {
        this.loadingRatings = true
        const response = await axiosInstance.get(`/place/${this.place.id}/ratings`)
        this.ratings = response.data
        console.log(`Fetched ${this.ratings.length} ratings for place: ${this.place.name}`, this.ratings)
      } catch (error) {
        console.error('Error fetching ratings for place:', this.place.name, error)
        this.ratings = []
      } finally {
        this.loadingRatings = false
      }
    },
    onRatePlace() {
      this.ratingDialog = true;
    },
    onViewRatings() {
      this.ratingsDialog = true;
      // Optionally refresh ratings when dialog opens
      if (this.ratings.length === 0) {
        this.fetchRatings();
      }
    },
    closeRatingDialog() {
      this.ratingDialog = false;
      this.newRating = {
        rating: 0,
        hashtag: ''
      };
    },
    async submitRating() {
      if (this.newRating.rating === 0) return;

      try {
        this.submittingRating = true;

        const ratingData = {
          rating: this.newRating.rating,
          hashtag: this.newRating.hashtag || null
        };

        const response = await axiosInstance.post(`/place/${this.place.id}/rating`, ratingData);

        console.log('Rating submitted successfully:', response.data);

        // Refresh ratings to show the new rating
        await this.fetchRatings();

        // Close the dialog
        this.closeRatingDialog();

        // Optional: Show success message
        // this.$toast?.success('Rating submitted successfully!');

      } catch (error) {
        console.error('Error submitting rating:', error);
        // Optional: Show error message
        // this.$toast?.error('Failed to submit rating. Please try again.');
      } finally {
        this.submittingRating = false;
      }
    }
  }
}
</script>

<style scoped>
.place-card {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out;
}

.place-card:hover {
  transform: translateY(-2px);
}

.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

.text-h5 {
  line-height: 1.2;
}

.text-subtitle-1 {
  line-height: 1.3;
}
</style>