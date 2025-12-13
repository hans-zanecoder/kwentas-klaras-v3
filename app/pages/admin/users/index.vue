<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-8 min-h-screen">
          <PageHeader
            :title="PAGE_HEADERS.users.title"
            :description="PAGE_HEADERS.users.description"
            :button-text="PAGE_HEADERS.users.buttonText"
            :button-action="openAddModal"
            :stats="headerStats"
          >
            <template #icon-0="{ stat }">
              <svg :class="`w-5 h-5 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </template>
            <template #icon-1="{ stat }">
              <svg :class="`w-5 h-5 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </PageHeader>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            <StatCard
              v-for="(stat, index) in userStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
              :change="stat.change"
              :change-type="stat.changeType"
              :icon-bg-color="getIconBgColor(stat.color)"
              :icon-color="stat.iconColor"
            >
              <template #icon>
                <svg v-if="index === 0" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else-if="index === 1" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="index === 2" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v2m0 4v2m0-6a2 2 0 100-4 2 2 0 000 4zM3 13a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </template>
            </StatCard>
          </div>

          <section class="relative overflow-hidden rounded-2xl border border-gray-300 p-6 bg-white">
            <div class="mb-6 flex items-center justify-between">
              <div class="flex-1 max-w-md">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="Search users by name or email..."
                />
              </div>
            </div>

            <Table
              :columns="USER_TABLE_COLUMNS"
              :data="[...filteredUsers]"
              key-field="id"
              empty-message="No users found"
              empty-description="Try adjusting your search criteria."
            >
              <template #cell-user="{ row }">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span class="text-indigo-600 font-semibold text-sm">{{ row.firstName.charAt(0).toUpperCase() }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ row.firstName }} {{ row.lastName }}</div>
                    <div class="text-sm text-gray-500">{{ row.username }}</div>
                  </div>
                </div>
              </template>

              <template #cell-email="{ row }">
                <div class="text-sm text-gray-900">{{ row.email }}</div>
              </template>

              <template #cell-department="{ row }">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {{ row.department }}
                </span>
              </template>

              <template #cell-status="{ row }">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ row.status }}
                </span>
              </template>

              <template #cell-joined="{ row }">
                <div class="text-sm text-gray-500">{{ row.joined }}</div>
              </template>

              <template #cell-actions="{ row }">
                <div class="flex items-center justify-end space-x-2">
                  <button class="text-indigo-600 hover:text-indigo-900 transition cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="openEditModal(row)" class="text-gray-600 hover:text-gray-900 transition cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="onDeleteUser(row)" class="text-red-600 hover:text-red-900 transition cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </template>
            </Table>

            <div v-if="filteredUsers.length > 0" class="mt-6 flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ filteredUsers.length }}</span> of <span class="font-medium">{{ users.length }}</span> users
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <AdminAddOrCreateUser
      :is-open="isModalOpen"
      :editing-user="editingUser"
      @close="closeModal"
      @save="onSaveUser"
    />

    <div v-if="saveError" class="fixed top-4 right-4 z-[10000]">
      <ErrorMessage :message="saveError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import PageHeader from '~/components/ui/PageHeader.vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import Table from '~/components/ui/Table.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import { USER_TABLE_COLUMNS } from '~/constants/user/tableColumns'
import { PAGE_HEADERS } from '~/constants/pages/headers'
import { getStatIconColor, getIconBgColor } from '~/constants/ui/statColors'
import type { User } from '~/types/user/user'
import type { UserWithPassword } from '~/types/user/userWithPassword'
import { useUsers } from '~/composables/user/useUsers'
import { useUserSearch } from '~/composables/user/useUserSearch'
import { useUserModal } from '~/composables/user/useUserModal'

const searchQuery = ref('')

const { users, saveError, userStats, fetchUsers, handleSaveUser, handleDeleteUser } = useUsers()
const { filteredUsers } = useUserSearch(users, searchQuery)
const { isModalOpen, editingUser, openAddModal, openEditModal, closeModal } = useUserModal(saveError)

onMounted(async () => {
  await fetchUsers()
})

const onSaveUser = async (userData: UserWithPassword) => {
  await handleSaveUser(userData, editingUser.value)
  closeModal()
}

const onDeleteUser = async (user: User) => {
  if (confirm(`Are you sure you want to delete "${user.firstName} ${user.lastName}"?`)) {
    if (user.id) {
      await handleDeleteUser(user.id)
    }
  }
}

const headerStats = computed(() => {
  return userStats.value.slice(0, 2).map((stat, index) => ({
    ...stat,
    iconIndex: index
  }))
})
</script>

