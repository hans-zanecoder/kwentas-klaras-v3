<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div :class="[...animations.pageContainerClasses.value]" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 min-h-full flex flex-col">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">All Users</h1>
              <p class="text-sm text-gray-500">Manage and view all system users</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div class="flex-1 sm:max-w-md">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="Search by name or email..."
                />
              </div>
              <button v-if="canManageUsers" @click="goToAddUser" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
                Add User
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              v-if="!showLoading"
              v-for="(stat, index) in displayStats"
              :key="index"
              :class="[
                ...animations.statCardClasses.value,
                animations.getStaggeredDelayClass(index),
              ]"
              :style="{ animationDelay: `${index * 0.1}s` }"
              :title="stat.title"
              :value="stat.value"
              :change="stat.change"
              :change-type="stat.changeType"
              :icon-bg-color="index === 2 ? 'bg-transparent' : getIconBgColor(stat.color)"
              :icon-color="stat.iconColor"
            >
              <template #icon>
                <svg v-if="index === 0" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else-if="index === 1" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 10h-6" />
                </svg>
              </template>
            </StatCard>
            <div
              v-else
              v-for="n in 3"
              :key="n"
              class="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
            >
              <div class="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          <section class="relative overflow-hidden rounded-2xl border border-gray-300 p-6 bg-white flex-1 min-h-[600px] flex flex-col">

            <UsersListSkeleton v-if="showLoading" />

            <div v-else-if="filteredUsers.length === 0" class="text-center py-12 flex-1 flex items-center justify-center">
              <div class="text-gray-400 mb-2">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p class="text-gray-600 font-medium">No users found</p>
              <p class="text-sm text-gray-500 mt-1">Try adjusting your search criteria.</p>
            </div>

            <div v-else class="space-y-3 flex-1">
              <div
                v-for="(user, index) in filteredUsers"
                :key="user.id"
                :class="[
                  'animate-card-fade-in',
                  'will-change-all',
                  animations.getStaggeredDelayClass(index, { maxItems: 10 }),
                ]"
                class="user-card bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <div class="flex items-center gap-6">
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    <div class="flex-shrink-0">
                      <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm ring-2 ring-blue-50">
                        <span class="text-blue-700 font-bold text-lg">{{ user.firstName?.charAt(0).toUpperCase() || 'U' }}</span>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-3 mb-1">
                        <h3 class="text-lg font-bold text-gray-900 truncate">{{ user.firstName }} {{ user.lastName }}</h3>
                        <span class="px-2 py-0.5 inline-flex text-xs font-semibold rounded-full" :class="user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                          {{ user.status || 'N/A' }}
                        </span>
                      </div>
                      <div class="flex items-center gap-3 flex-wrap">
                        <p class="text-sm text-gray-600 truncate">{{ user.email || 'N/A' }}</p>
                        <span v-if="user.department" class="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {{ user.department }}
                        </span>
                            <span class="text-xs text-gray-400">{{ user.username?.startsWith('@') ? user.username.slice(1) : user.username }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="canManageUsers" class="flex items-center gap-2 flex-shrink-0">
                    <button @click.stop="handleEditClick(user)" class="p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" title="Edit user">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click.stop="handleDeleteClick(user)" class="p-2 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer" title="Delete user">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!showLoading && filteredUsers.length > 0" class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
              <div class="text-sm text-gray-600">
                Showing <span class="font-bold text-gray-900">{{ filteredUsers.length }}</span> of <span class="font-bold text-gray-900">{{ users.length }}</span> users
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <ConfirmModal
      :is-open="showEditConfirmModal"
      :title="MODAL_MESSAGES.UPDATE_USER.title"
      :message="editConfirmMessage"
      :confirm-text="MODAL_MESSAGES.UPDATE_USER.confirmText"
      :cancel-text="MODAL_MESSAGES.UPDATE_USER.cancelText"
      :loading="false"
      :user-details="editUserDetails"
      @confirm="onConfirmEdit"
      @cancel="closeEditConfirmModal"
    />

    <ConfirmModal
      :is-open="showDeleteConfirmModal"
      :title="MODAL_MESSAGES.DELETE_USER.title"
      :message="deleteConfirmMessage"
      :confirm-text="MODAL_MESSAGES.DELETE_USER.confirmText"
      :cancel-text="MODAL_MESSAGES.DELETE_USER.cancelText"
      :loading="deleteLoading"
      :loading-text="MODAL_MESSAGES.DELETE_USER.loadingText"
      @confirm="onConfirmDelete"
      @cancel="closeDeleteConfirmModal"
    />

    <div v-if="saveError" class="fixed top-4 right-4 z-[10000]">
      <ErrorMessage :message="saveError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import UsersListSkeleton from '~/components/skeletons/admin/users/UsersListSkeleton.vue'
import { getIconBgColor } from '~/constants/ui/statColors'
import { MODAL_MESSAGES } from '~/constants/ui/modalMessages'
import type { User } from '~/types/user/user'
import { useUsers } from '~/composables/user/useUsers'
import { useUserSearch } from '~/composables/user/useUserSearch'
import { useUserModal } from '~/composables/user/useUserModal'
import { useUserPermissions } from '~/composables/user/useUserPermissions'
import { useLoadingState } from '~/composables/ui/useLoadingState'
import { usePageAnimations } from '~/composables/ui/usePageAnimations'

const searchQuery = ref('')
const animations = usePageAnimations()

const { users, loading, saveError, userStats, fetchUsers, handleDeleteUser } = useUsers()
const { showLoading, markAsLoaded } = useLoadingState(loading)
const { filteredUsers } = useUserSearch(users, searchQuery)
const {
  showEditConfirmModal,
  showDeleteConfirmModal,
  deleteLoading,
  editConfirmMessage,
  editUserDetails,
  deleteConfirmMessage,
  handleEditClick,
  closeEditConfirmModal,
  onConfirmEdit,
  handleDeleteClick,
  closeDeleteConfirmModal,
  onConfirmDelete,
} = useUserModal(saveError, handleDeleteUser)
const { canManageUsers } = useUserPermissions()

const displayStats = computed(() => userStats.value.slice(0, 3))

const router = useRouter()

const goToAddUser = () => {
  router.push('/admin/users/add')
}

onMounted(async () => {
  await fetchUsers()
  markAsLoaded()
  animations.markPageLoaded()
})
</script>

