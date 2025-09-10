<template>
	<v-container>
		<v-row>
			<v-col cols="12">
				<v-card>
					<v-card-title class="d-flex align-center">
						<v-icon class="mr-2">mdi-account-alert</v-icon>
						User Suspensions
						<v-spacer></v-spacer>
						<v-btn
							color="primary"
							@click="triggerSuspensions"
							:loading="loading"
							prepend-icon="mdi-refresh"
						>
							Refresh Suspensions
						</v-btn>
					</v-card-title>
					<v-card-text>
						<v-data-table
							:headers="headers"
							:items="suspensions"
							:loading="loading"
							class="elevation-1"
							item-value="username"
						>
							<template v-slot:item.suspendType="{ item }">
								<v-chip
									:color="getSuspendTypeColor(item.suspendType)"
									size="small"
									variant="flat"
								>
									{{ formatSuspendType(item.suspendType) }}
								</v-chip>
							</template>
							<template v-slot:item.suspendDuration="{ item }">
								{{ item.suspendDuration }} hours
							</template>
							<template v-slot:item.createdAt="{ item }">
								{{ formatDate(item.createdAt) }}
							</template>
							<template v-slot:item.expiresAt="{ item }">
								{{ formatDate(item.expiresAt) }}
							</template>
							<template v-slot:item.reason="{ item }">
								<v-tooltip :text="item.reason">
									<template v-slot:activator="{ props }">
										<span v-bind="props" class="text-truncate" style="max-width: 200px; display: inline-block;">
											{{ item.reason }}
										</span>
									</template>
								</v-tooltip>
							</template>
							<template v-slot:no-data>
								<div class="text-center py-4">
									<v-icon size="48" color="grey-lighten-1">mdi-account-check</v-icon>
									<div class="mt-2 text-grey">No user suspensions found</div>
								</div>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import axios from '@/utils/axiosInstance';

export default {
	name: 'FlaggedUsersView',
	data() {
		return {
			suspensions: [],
			loading: false,
			headers: [
				{ title: 'Username', value: 'username', sortable: true },
				{ title: 'Suspension Type', value: 'suspendType', sortable: true },
				{ title: 'Duration', value: 'suspendDuration', sortable: true },
				{ title: 'Reason', value: 'reason', sortable: false },
				{ title: 'Created At', value: 'createdAt', sortable: true },
				{ title: 'Expires At', value: 'expiresAt', sortable: true }
			]
		};
	},
	methods: {
		async triggerSuspensions() {
			this.loading = true;
			try {
				const response = await axios.put('/user/suspend');
				this.suspensions = response.data;
			} catch (error) {
				console.error('Error fetching suspensions:', error);
			} finally {
				this.loading = false;
			}
		},
		async fetchSuspensions() {
			try {
				const response = await axios.get('/user/suspend');
				this.suspensions = response.data;
			} catch (error) {
				console.error('Error fetching suspensions:', error);
				return [];
			}
		},
		formatSuspendType(type) {
			return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
		},
		getSuspendTypeColor(type) {
			switch (type) {
				case 'PERMANENT_BAN':
					return 'black';
				case 'LOGIN_BAN':
					return 'error';
				case 'POST_BAN':
					return 'warning';
				default:
					return 'info';
			}
		},
		formatDate(dateString) {
			return new Date(dateString).toLocaleString();
		}
	},
	mounted() {
		this.fetchSuspensions();
	}
};
</script>

<style scoped>
.text-truncate {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>