<template>
  <v-container>
    <v-row justify="center">
      <v-col lg="8" md="10">
        <v-card variant="flat" elevation="0">
          <v-card-title class="headline d-flex align-center">
            <v-icon color="primary" size="large" class="mr-3">
              mdi-map-marker-plus
            </v-icon>
            Create New Place
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <v-form v-model="valid" ref="form">
              <!-- Place Name -->
              <v-text-field
                label="Place Name *"
                v-model="place.name"
                prepend-icon="mdi-map-marker"
                :rules="nameRules"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                required
              ></v-text-field>

              <!-- Country -->
              <v-text-field
                label="Country *"
                v-model="place.country"
                prepend-icon="mdi-earth"
                :rules="countryRules"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                required
              ></v-text-field>

              <!-- City -->
              <v-text-field
                label="City *"
                v-model="place.city"
                prepend-icon="mdi-city"
                :rules="cityRules"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                required
              ></v-text-field>

              <!-- Description -->
              <v-textarea
                label="Description"
                v-model="place.description"
                prepend-icon="mdi-text"
                variant="outlined"
                density="comfortable"
                rows="4"
                class="mb-4"
                placeholder="Enter a description of the place (optional)"
              ></v-textarea>

              <!-- Hashtag -->
              <v-text-field
                label="Hashtag"
                v-model="place.hashtag"
                prepend-icon="mdi-pound"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                placeholder="e.g., #beautiful, #peaceful, #historic"
                hint="Enter a hashtag without the # symbol"
                persistent-hint
              ></v-text-field>

              <!-- Error Message -->
              <v-alert
                v-if="errorMessage"
                type="error"
                class="mb-4"
                dismissible
                @click:close="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>

            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-6">
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              variant="outlined"
              @click="resetForm"
              :disabled="loading"
              class="mr-3"
            >
              Reset
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              @click="createPlace"
              :disabled="!valid || loading"
              :loading="loading"
            >
              Create Place
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" color="success">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axiosInstance from '@/utils/axiosInstance';

export default {
  name: 'CreatePlaceView',
  data() {
    return {
      valid: false,
      loading: false,
      errorMessage: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarTimeout: 2500,
      place: {
        name: '',
        country: '',
        city: '',
        description: '',
        hashtag: ''
      },
      nameRules: [
        v => !!v || 'Place name is required',
        v => (v && v.length >= 2) || 'Place name must be at least 2 characters',
        v => (v && v.length <= 100) || 'Place name must be less than 100 characters'
      ],
      countryRules: [
        v => !!v || 'Country is required',
        v => (v && v.length >= 2) || 'Country must be at least 2 characters',
        v => (v && v.length <= 50) || 'Country must be less than 50 characters'
      ],
      cityRules: [
        v => !!v || 'City is required',
        v => (v && v.length >= 2) || 'City must be at least 2 characters',
        v => (v && v.length <= 50) || 'City must be less than 50 characters'
      ]
    };
  },
  mounted() {
    // Check if user is admin
    this.checkAdminAccess();
  },
  methods: {
    checkAdminAccess() {
      try {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (!auth || auth.role !== 'admin') {
          this.$router.push('/places');
          return;
        }
      } catch {
        this.$router.push('/login');
      }
    },

    async createPlace() {
      if (!this.valid) {
        return;
      }

      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        // Prepare the data
        const placeData = {
          name: this.place.name.trim(),
          country: this.place.country.trim(),
          city: this.place.city.trim(),
          description: this.place.description.trim() || null,
          hashtag: this.place.hashtag.trim() || null
        };

        // If hashtag is provided, ensure it doesn't start with #
        if (placeData.hashtag && placeData.hashtag.startsWith('#')) {
          placeData.hashtag = placeData.hashtag.substring(1);
        }

        // Make API call to create place
        const response = await axiosInstance.post('/place', placeData);

        this.snackbarMessage = 'Place created successfully!';
        this.snackbar = true;
        this.resetForm();

        // Redirect to places after a short delay
        setTimeout(() => {
          this.$router.push('/places');
        }, this.snackbarTimeout);

      } catch (error) {
        console.error('Error creating place:', error);

        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else if (error.response && error.response.status === 403) {
          this.errorMessage = 'You do not have permission to create places.';
        } else if (error.response && error.response.status === 401) {
          this.errorMessage = 'Please log in to create places.';
          this.$router.push('/login');
        } else {
          this.errorMessage = 'Failed to create place. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.place = {
        name: '',
        country: '',
        city: '',
        description: '',
        hashtag: ''
      };
      this.errorMessage = '';

      // Reset form validation
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    }
  }
};
</script>

<style scoped>
.v-container {
  margin-top: 2vh;
}

.v-card {
  border-radius: 12px;
}

.headline {
  font-size: 1.5rem;
  font-weight: 600;
  padding: 1.5rem;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}
</style>
