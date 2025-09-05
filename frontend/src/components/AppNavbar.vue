<template>
	<v-app-bar app color="primary" dark>
		<v-btn class="navbar-title" text @click="goToHome()">
			<v-img src="@/assets/fakebook-light.png" alt="Fakebook Logo" width="32" height="32" class="navbar-logo"></v-img>
			<span class="ml-2 font-weight-bold">Fakebook</span>
		</v-btn>
		<v-spacer />
		<div v-if="isLoggedIn" class="d-flex align-center">
			<v-btn
				variant="text"
				prepend-icon="mdi-plus"
				to="/create-post"
				class="mr-2"
			>
				Create Post
			</v-btn>
			<v-btn
				variant="text"
				prepend-icon="mdi-account-circle"
				to="/profile"
				class="mr-2"
			>
				Profile
			</v-btn>
			<v-btn variant="text" prepend-icon="mdi-logout" @click="logout">
				Logout
			</v-btn>
		</div>
		<div v-else>
			<v-btn size="large" prepend-icon="mdi-login" to="/login">Login</v-btn>
		</div>
	</v-app-bar>
</template>

<script>
export default {
	name: 'AppNavbar',
	data() {
		return {
			auth: null
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.auth;
		}
	},
	methods: {
		goToHome() {
			this.$router.push('/');
		},
		updateAuth() {
			try {
				this.auth = JSON.parse(localStorage.getItem('auth'));
			} catch {
				this.auth = null;
			}
		},
		logout() {
			localStorage.removeItem('auth');
			this.auth = null; // Update reactive data immediately

			// Dispatch custom event for consistency
			window.dispatchEvent(new Event('auth-changed'));

			this.$router.push('/login');
		}
	},
	mounted() {
		// Initialize auth state
		this.updateAuth();

		// Listen for storage changes (in case of login/logout from another tab)
		window.addEventListener('storage', this.updateAuth);

		// Listen for custom auth-changed event (for same-tab login/logout)
		window.addEventListener('auth-changed', this.updateAuth);
	},
	beforeUnmount() {
		window.removeEventListener('storage', this.updateAuth);
		window.removeEventListener('auth-changed', this.updateAuth);
	}
};
</script>

<style scoped>
.v-toolbar-title {
	font-weight: 600;
}
</style>