<template>
  <v-card
    class="mx-auto mb-4"
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
        color="primary"
        variant="outlined"
        prepend-icon="mdi-star"
        @click="onRatePlace"
      >
        Rate Place
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        color="secondary"
        variant="text"
        append-icon="mdi-open-in-new"
        @click="onViewRatings"
      >
        View Ratings
      </v-btn>
    </v-card-actions>

    <!-- Rating Summary (if available) -->
    <v-divider v-if="place.averageRating"></v-divider>
    <v-card-text v-if="place.averageRating" class="px-4 py-3">
      <div class="d-flex align-center">
        <v-rating
          :model-value="place.averageRating"
          color="amber"
          density="compact"
          readonly
          half-increments
        ></v-rating>
        <span class="text-body-2 ml-2">
          {{ place.averageRating.toFixed(1) }}
          <span class="text-medium-emphasis">
            ({{ place.ratingCount || 0 }} {{ place.ratingCount === 1 ? 'rating' : 'ratings' }})
          </span>
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
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
  methods: {
    onRatePlace() {
      this.$emit('rate-place', this.place);
    },
    onViewRatings() {
      this.$emit('view-ratings', this.place);
    }
  }
}
</script>

<style scoped>
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