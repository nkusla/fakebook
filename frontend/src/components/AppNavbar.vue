<template>
	<v-app-bar app color="primary" dark>
		<v-toolbar-title style="cursor: pointer" @click="$router.push('/')">FaKebook</v-toolbar-title>
		<v-spacer />
		<div v-if="isLoggedIn" class="d-flex align-center">
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
	computed: {
		auth() {
			try {
				return JSON.parse(localStorage.getItem('auth'));
			} catch {
				return null;
			}
		},
		isLoggedIn() {
			return !!this.auth;
		}
	},
	methods: {
		logout() {
			localStorage.removeItem('auth');
			this.$router.push('/login');
		}
	}
};
</script>

<style scoped>
.v-toolbar-title {
	font-weight: 600;
}
</style>