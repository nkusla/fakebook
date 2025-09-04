<template>
  <v-container>
    <v-row justify="center">
      <v-col lg="6">
        <v-card variant="text">
          <v-card-title class="headline">Login</v-card-title>
          <v-spacer></v-spacer>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                label="Username *"
                v-model="username"
                prepend-icon="mdi-account"
                type="text"
                :rules="usernameRules"
                required
              ></v-text-field>
              <br>
              <v-text-field
                label="Password *"
                v-model="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="passwordRules"
                required
              ></v-text-field>
              <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="signUp">Sign Up</v-btn>
            <v-btn variant="elevated" color="primary" @click="login" :disabled="!valid">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from '@/utils/axiosInstance';

export default {
  data() {
    return {
      valid: false,
      username: '',
      usernameRules: [
        v => !!v,
      ],
      password: '',
      passwordRules: [
        v => !!v,
      ],
      errorMessage: ''
    };
  },
  methods: {
    login() {
      if (!this.valid) {
        return;
      }

      axios.post('/user/login', {
        username: this.username,
        password: this.password
      })
      .then(response => {
				const auth = {
					username : response.data.username,
					role : response.data.role,
				}

				localStorage.setItem('auth', JSON.stringify(auth));

        // Trigger a custom event to notify the navbar of auth change
        window.dispatchEvent(new Event('auth-changed'));

        this.$router.push("/");
      })
      .catch(error => {
        this.errorMessage = "Username or password is incorrect.";
      });
    },
    signUp() {
      this.$router.push("/signup");
    }
  }
};
</script>

<style scoped>

.v-container {
  margin-top: 10vh;
}

.v-card {
  padding: 3%;
}

</style>