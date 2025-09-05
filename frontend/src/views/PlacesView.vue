<template>
  <v-container>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Loading places...</p>
      </v-col>
    </v-row>

    <!-- Places Grid -->
    <v-row v-else-if="places.length > 0" justify="center">
      <v-col
        v-for="place in places"
        :key="place.id"
        cols="12"
        md="6"
        lg="4"
      >
        <Place :place="place" />
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-icon
          color="grey-lighten-1"
          size="120"
          class="mb-4"
        >
          mdi-map-marker-off
        </v-icon>
        <h2 class="text-h4 text-grey-lighten-1 mb-2">No Places Found</h2>
        <p class="text-h6 text-grey-lighten-1">
          No places are available at the moment.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Place from '@/components/Place.vue'
import axiosInstance from '@/utils/axiosInstance'

export default {
  name: 'PlacesView',
  components: {
    Place
  },
  data() {
    return {
      places: [],
      loading: true
    }
  },
  async mounted() {
    await this.fetchPlaces()
  },
  methods: {
    async fetchPlaces() {
      try {
        this.loading = true
        const response = await axiosInstance.get('/place')
        this.places = response.data
      } catch (error) {
        console.error('Error fetching places:', error)
        this.$toast?.error('Failed to load places')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}
</style>