<template>
	<v-app-bar app color="primary" dark>
		<v-btn class="navbar-title" text @click="goToHome()">
			<v-img src="@/assets/fakebook-light.png" alt="Fakebook Logo" width="32" height="32" class="navbar-logo"></v-img>
			<span class="ml-2 font-weight-bold">Fakebook</span>
		</v-btn>
		<v-spacer />
		<div v-if="isLoggedIn" class="d-flex align-center">
			<template v-if="!isAdmin">
				<!-- User Search Component -->
				<v-btn variant="text" prepend-icon="mdi-account-search" @click="openSearchDialog" class="mr-2">
					Find Users
				</v-btn>

				<v-btn variant="text" prepend-icon="mdi-plus" to="/create-post" class="mr-2">
					Create Post
				</v-btn>
				<v-btn variant="text" prepend-icon="mdi-map-marker" to="/places" class="mr-2">
					Places
				</v-btn>
				<v-btn variant="text" prepend-icon="mdi-account-circle" to="/profile" class="mr-2">
					Profile
				</v-btn>
			</template>
			<template v-else>
				<v-btn variant="text" prepend-icon="mdi-map-marker-plus" to="/create-place" class="mr-2">
					Create Place
				</v-btn>
			</template>
			<v-btn variant="text" prepend-icon="mdi-logout" @click="logout">
				Logout
			</v-btn>
		</div>
		<div v-else>
			<v-btn size="large" prepend-icon="mdi-login" to="/login">Login</v-btn>
		</div>

		<!-- Search Users Dialog -->
		<v-dialog v-model="searchDialog" max-width="500" persistent>
			<v-card>
				   <v-card-title class="d-flex align-center">
					   <v-icon class="mr-2">mdi-account-search</v-icon>
					   Search Users
					   <v-spacer></v-spacer>
					   <v-btn icon variant="text" @click="closeSearch">
						   <v-icon>mdi-close</v-icon>
					   </v-btn>
				   </v-card-title>
				<v-card-text>
					<v-text-field v-model="searchQuery" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
						density="compact" @keyup.enter="searchUsers" :loading="searchLoading" clearable autofocus>
						<template v-slot:append-inner>
							<v-btn icon size="small" @click="searchUsers" :disabled="!searchQuery || searchQuery.length < 2"
								:loading="searchLoading">
								<v-icon>mdi-magnify</v-icon>
							</v-btn>
						</template>
					</v-text-field>

					<div v-if="searchResults.length > 0" class="mt-4">
						<v-list>
							<v-list-item v-for="user in searchResults" :key="user.username" class="px-0">
								<template v-slot:prepend>
									<v-avatar color="primary" size="default">
										<span class="text-white">{{ user.name[0] }}{{ user.surname[0] }}</span>
									</v-avatar>
								</template>
								<v-list-item-title>{{ user.name }} {{ user.surname }}</v-list-item-title>
								<v-list-item-subtitle>@{{ user.username }}</v-list-item-subtitle>
								<template v-slot:append>
									<v-btn color="primary" variant="outlined" @click="addFriend(user.username)"
										:loading="addingFriend === user.username" :disabled="user.friendship?.areFriends">
										{{ user.friendship?.areFriends ? 'Friends' : 'Add Friend' }}
									</v-btn>
								</template>
							</v-list-item>
						</v-list>
					</div>

					   <div v-else-if="searchPerformed && searchQuery && !searchLoading && searchResults.length === 0" class="text-center text-grey mt-4">
						   <v-icon size="48" color="grey-lighten-1">mdi-account-search</v-icon>
						   <div class="mt-2">No users found</div>
					   </div>
				</v-card-text>
			</v-card>
		</v-dialog>


	</v-app-bar>
</template>

<script>
import axios from '@/utils/axiosInstance';

export default {
	name: 'AppNavbar',
	   data() {
		   return {
			   auth: null,
			   searchDialog: false,
			   searchQuery: '',
			   searchResults: [],
			   searchLoading: false,
			   addingFriend: null,
			   searchPerformed: false
		   }
	   },
	computed: {
		isLoggedIn() {
			return !!this.auth;
		},
		isAdmin() {
			return this.auth && this.auth.role === 'admin';
		}
	},
	methods: {
		goToHome() {
			if (this.isAdmin) {
				this.$router.push('/places');
			} else {
				this.$router.push('/');
			}
		},
		openSearchDialog() {
			this.searchDialog = true;
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
		},
		   searchUsers() {
			   this.searchPerformed = true;
			   if (!this.searchQuery || this.searchQuery.length < 2) {
				   this.searchResults = [];
				   return;
			   }

			   this.searchLoading = true;
			   this.performSearch();
		   },
		async performSearch() {
			try {
				// Search for users by username
				const response = await axios.get(`/user/search`, {
					params: { username: this.searchQuery }
				});


				// Check friendship status for each user
				const usersWithFriendship = await Promise.all(
					response.data.map(async (user) => {
						try {
							const friendshipResponse = await axios.get(
								`/friendship/${user.username}`
							);
							return {
								...user,
								friendship: friendshipResponse.data
							};
						} catch (error) {
							return {
								...user,
								friendship: { areFriends: false }
							};
						}
					})
				);

				this.searchResults = usersWithFriendship.filter(user =>
					user.username !== this.auth.username
				);
			} catch (error) {
				console.error('Error searching users:', error);
			} finally {
				this.searchLoading = false;
			}
		},
		async addFriend(username) {
			this.addingFriend = username;
			try {
				await axios.post(
					`/friendship`,
					{ username2: username }
				);

				// Update the friendship status in search results
				const userIndex = this.searchResults.findIndex(user => user.username === username);
				if (userIndex !== -1) {
					this.searchResults[userIndex].friendship.areFriends = true;
				}
			} catch (error) {
				console.error('Error adding friend:', error);
			} finally {
				this.addingFriend = null;
			}
		},
		   closeSearch() {
			   this.searchDialog = false;
			   this.searchQuery = '';
			   this.searchResults = [];
			   this.searchPerformed = false;
			   this.searchLoading = false;
			   this.addingFriend = null;
			   // Blur the input if open for a clean restart
			   this.$nextTick(() => {
				   const input = document.querySelector('.v-text-field input');
				   if (input) input.blur();
			   });
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