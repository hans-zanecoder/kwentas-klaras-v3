<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="max-w-7xl mx-auto">
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            <p class="mt-4 text-gray-600">Loading project details...</p>
          </div>

          <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-red-700">{{ error }}</p>
            </div>
          </div>

          <div v-else-if="!project" class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-lg font-semibold text-gray-900 mb-2">Project not found</p>
            <p class="text-sm text-gray-500">The project you're looking for doesn't exist or has been removed.</p>
          </div>

          <div v-else class="space-y-6">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold text-gray-900">Project Details</h1>
              <div class="flex items-center gap-2">
                <button
                  @click="navigateTo('/admin/projects')"
                  class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  v-if="canManageProjects"
                  @click="handleEditClick"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Project
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
              <div class="p-6">
                <div class="space-y-6">
                  <div class="pb-6 border-b border-gray-200">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Project Name</p>
                    <p class="text-3xl font-bold text-gray-900 truncate" :title="project.name">{{ project.name }}</p>
                  </div>

                  <div class="grid grid-cols-2 gap-6">
                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Project Code</p>
                      <p class="text-base font-semibold text-gray-900">#{{ project.code || project.id }}</p>
                    </div>

                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Implementing Unit</p>
                      <p class="text-base font-semibold text-gray-900 truncate" :title="project.implementingUnit">{{ project.implementingUnit || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-b border-gray-200">
              <nav class="flex space-x-8 overflow-x-auto" aria-label="Tabs">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 relative',
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  {{ tab.label }}
                </button>
              </nav>
            </div>

            <div v-if="activeTab === TAB_IDS.SUMMARY" class="space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                  <div class="px-6 py-5 border-b border-gray-300">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">Project Summary</h3>
                        <p class="text-xs text-gray-500">Key project information</p>
                      </div>
                    </div>
                  </div>
                  <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-4">
                        <div>
                          <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Project Details
                          </h4>
                          <div class="space-y-3 pl-6">
                            <div>
                              <span class="text-xs text-gray-500">PPA</span>
                              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ project.name }}</p>
                            </div>
                            <div>
                              <span class="text-xs text-gray-500">Code</span>
                              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ project.code || 'N/A' }}</p>
                            </div>
                            <div>
                              <span class="text-xs text-gray-500">Year</span>
                              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ project.year }}</p>
                            </div>
                            <div>
                              <span class="text-xs text-gray-500">Appropriation</span>
                              <p class="text-sm font-medium text-gray-900 mt-0.5">₱{{ formatNumber(project.appropriation) }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="space-y-4">
                        <div>
                          <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Location & Services
                          </h4>
                          <div class="space-y-3 pl-6">
                            <div>
                              <span class="text-xs text-gray-500">Implementing Unit</span>
                              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ project.implementingUnit || 'N/A' }}</p>
                            </div>
                            <div>
                              <span class="text-xs text-gray-500">Location</span>
                              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ project.location || 'N/A' }}</p>
                            </div>
                            <div>
                              <span class="text-xs text-gray-500">Services</span>
                              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ project.services || 'N/A' }}</p>
                            </div>
                            <div>
                              <span class="text-xs text-gray-500">Remarks</span>
                              <p class="text-sm font-medium text-gray-900 mt-0.5">{{ project.remarks || 'N/A' }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <PieChart
                    title="Utilization Rate"
                    :series="utilizationChartData.series"
                    :options="utilizationChartData.options"
                    :loading="loading"
                    :error="error"
                  />
                </div>
              </div>

              <div>
                <PieChart
                  title="Budget Distribution"
                  :series="pieChartData.series"
                  :options="pieChartData.options"
                  :loading="loading"
                  :error="error"
                />
              </div>

              <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-300">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900">Budget & Financial Information</h3>
                      <p class="text-xs text-gray-500">Financial overview and tracking</p>
                    </div>
                  </div>
                </div>
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <p class="text-xs font-medium text-gray-500 mb-1">Total Budget</p>
                      <p class="text-lg font-bold text-gray-900">₱{{ formatNumber(project.appropriation) }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <p class="text-xs font-medium text-gray-500 mb-1">Total Added Budget</p>
                      <p class="text-lg font-bold text-gray-900">₱{{ formatNumber(project.totalAddedBudget || 0) }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <p class="text-xs font-medium text-gray-500 mb-1">Remaining Balance</p>
                      <p class="text-lg font-bold text-gray-900">₱{{ formatNumber(project.appropriation) }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <p class="text-xs font-medium text-gray-500 mb-1">Fund Balance</p>
                      <p class="text-lg font-bold text-gray-900">₱0.00</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <p class="text-xs font-medium text-gray-500 mb-1">Balance Allotment</p>
                      <p class="text-lg font-bold text-gray-900">₱0.00</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <p class="text-xs font-medium text-gray-500 mb-1">Total Disbursed</p>
                      <p class="text-lg font-bold text-gray-900">₱0.00</p>
                    </div>
                  </div>
                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-700">Utilization Rate:</p>
                      <p class="text-2xl font-bold text-green-600">0.00%</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div v-else-if="activeTab === TAB_IDS.BUDGET" class="space-y-6">
              <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Added Budget</h3>
                  <div class="text-sm text-gray-600">
                    Total: <span class="font-semibold text-gray-900">₱{{ formatNumber(project.totalAddedBudget || 0) }}</span>
                  </div>
                </div>
                
                <div v-if="budgetsLoading" class="text-center py-12">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                  <p class="mt-3 text-sm text-gray-500">Loading budgets...</p>
                </div>

                <div v-else-if="budgetsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p class="text-sm text-red-800">{{ budgetsError }}</p>
                </div>

                <div v-else-if="additionalBudgets.length === 0" class="text-center py-12">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="text-sm font-medium text-gray-900 mb-1">No additional budget records</p>
                  <p class="text-xs text-gray-500">Additional budgets will appear here when added</p>
                </div>

                <div v-else id="accordion-card" data-accordion="collapse" class="space-y-3">
                  <Accordion
                    v-for="(budget, index) in additionalBudgets"
                    :key="budget.id"
                    :title="`Budget Entry #${index + 1}`"
                    :is-first="index === 0"
                  >
                    <div class="space-y-3">
                      <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Amount:</span>
                        <span class="text-sm font-semibold text-gray-900">₱{{ formatNumber(budget.amount) }}</span>
                      </div>
                      <div class="flex justify-between items-start py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Reason:</span>
                        <span class="text-sm text-gray-900 text-right max-w-xs">{{ budget.reason }}</span>
                      </div>
                      <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Status:</span>
                        <span :class="[
                          'text-xs font-semibold px-2 py-1 rounded-full',
                          budget.status === 'approved' ? 'bg-green-100 text-green-800' :
                          budget.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        ]">
                          {{ budget.status?.charAt(0).toUpperCase() + budget.status?.slice(1) || 'Pending' }}
                        </span>
                      </div>
                      <div v-if="budget.approvedBy" class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Approved By:</span>
                        <span class="text-sm text-gray-900">{{ budget.approvedBy }}</span>
                      </div>
                      <div v-if="budget.approvedDate" class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Approved Date:</span>
                        <span class="text-sm text-gray-900">{{ formatDate(budget.approvedDate) }}</span>
                      </div>
                      <div class="flex justify-between items-center py-2">
                        <span class="text-sm font-medium text-gray-500">Date Added:</span>
                        <span class="text-sm text-gray-900">{{ formatDate(budget.createdAt) }}</span>
                      </div>
                    </div>
                  </Accordion>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === TAB_IDS.OBLIGATIONS" class="space-y-6">
              <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Added Obligations</h3>
                  <div class="text-sm text-gray-600">
                    Total: <span class="font-semibold text-gray-900">₱{{ formatNumber(totalObligations) }}</span>
                  </div>
                </div>
                
                <div v-if="obligationsLoading" class="text-center py-12">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                  <p class="mt-3 text-sm text-gray-500">Loading obligations...</p>
                </div>

                <div v-else-if="obligationsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p class="text-sm text-red-800">{{ obligationsError }}</p>
                </div>

                <div v-else-if="obligations.length === 0" class="text-center py-12">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p class="text-sm font-medium text-gray-900 mb-1">No obligation records</p>
                  <p class="text-xs text-gray-500">Obligations will appear here when added</p>
                </div>

                <div v-else id="accordion-card" data-accordion="collapse" class="space-y-3">
                  <Accordion
                    v-for="(obligation, index) in obligations"
                    :key="obligation.id"
                    :title="`Obligation Entry #${index + 1}`"
                    :is-first="index === 0"
                  >
                    <div class="space-y-3">
                      <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Amount:</span>
                        <span class="text-sm font-semibold text-gray-900">₱{{ formatNumber(obligation.amount) }}</span>
                      </div>
                      <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Payee:</span>
                        <span class="text-sm text-gray-900">{{ obligation.payee }}</span>
                      </div>
                      <div class="flex justify-between items-start py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Reason:</span>
                        <span class="text-sm text-gray-900 text-right max-w-xs">{{ obligation.reason }}</span>
                      </div>
                      <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Status:</span>
                        <span :class="[
                          'text-xs font-semibold px-2 py-1 rounded-full',
                          obligation.status === 'approved' ? 'bg-green-100 text-green-800' :
                          obligation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        ]">
                          {{ obligation.status?.charAt(0).toUpperCase() + obligation.status?.slice(1) || 'Pending' }}
                        </span>
                      </div>
                      <div v-if="obligation.approvedBy" class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Approved By:</span>
                        <span class="text-sm text-gray-900">{{ obligation.approvedBy }}</span>
                      </div>
                      <div v-if="obligation.approvedDate" class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Approved Date:</span>
                        <span class="text-sm text-gray-900">{{ formatDate(obligation.approvedDate) }}</span>
                      </div>
                      <div class="flex justify-between items-center py-2">
                        <span class="text-sm font-medium text-gray-500">Date Added:</span>
                        <span class="text-sm text-gray-900">{{ formatDate(obligation.createdAt) }}</span>
                      </div>
                    </div>
                  </Accordion>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === TAB_IDS.DISBURSEMENTS" class="space-y-6">
              <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">Added Disbursements</h3>
                  <div class="flex items-center gap-4">
                    <div class="text-sm text-gray-600">
                      Total: <span class="font-semibold text-gray-900">₱{{ formatNumber(totalDisbursements) }}</span>
                    </div>
                    <button
                      v-if="canManageProjects"
                      @click="isDisbursementModalOpen = true"
                      class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Disbursement
                    </button>
                  </div>
                </div>
                
                <div v-if="disbursementsLoading" class="text-center py-12">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                  <p class="mt-3 text-sm text-gray-500">Loading disbursements...</p>
                </div>

                <div v-else-if="disbursementsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p class="text-sm text-red-800">{{ disbursementsError }}</p>
                </div>

                <div v-else-if="disbursements.length === 0" class="text-center py-12">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p class="text-sm font-medium text-gray-900 mb-1">No disbursement records</p>
                  <p class="text-xs text-gray-500">Disbursements will appear here when added</p>
                </div>

                <div v-else id="accordion-card" data-accordion="collapse" class="space-y-3">
                  <Accordion
                    v-for="(disbursement, index) in disbursements"
                    :key="disbursement.id"
                    :title="`Disbursement Entry #${index + 1}`"
                    :is-first="index === 0"
                  >
                    <div class="space-y-3">
                      <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Amount:</span>
                        <span class="text-sm font-semibold text-gray-900">₱{{ formatNumber(disbursement.amount) }}</span>
                      </div>
                      <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Payee:</span>
                        <span class="text-sm text-gray-900">{{ disbursement.payee }}</span>
                      </div>
                      <div class="flex justify-between items-start py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Reason:</span>
                        <span class="text-sm text-gray-900 text-right max-w-xs">{{ disbursement.reason }}</span>
                      </div>
                      <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Status:</span>
                        <span :class="[
                          'text-xs font-semibold px-2 py-1 rounded-full',
                          disbursement.status === 'approved' ? 'bg-green-100 text-green-800' :
                          disbursement.status === 'denied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        ]">
                          {{ disbursement.status?.charAt(0).toUpperCase() + disbursement.status?.slice(1) || 'Pending' }}
                        </span>
                      </div>
                      <div v-if="disbursement.approvedBy" class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Approved By:</span>
                        <span class="text-sm text-gray-900">{{ disbursement.approvedBy }}</span>
                      </div>
                      <div v-if="disbursement.approvedDate" class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-sm font-medium text-gray-500">Approved Date:</span>
                        <span class="text-sm text-gray-900">{{ formatDate(disbursement.approvedDate) }}</span>
                      </div>
                      <div class="flex justify-between items-center py-2">
                        <span class="text-sm font-medium text-gray-500">Date Added:</span>
                        <span class="text-sm text-gray-900">{{ formatDate(disbursement.createdAt) }}</span>
                      </div>
                    </div>
                  </Accordion>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === TAB_IDS.TIMELINE" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-300">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900">Project Timeline</h3>
                      <p class="text-xs text-gray-500">Project schedule and progress</p>
                    </div>
                  </div>
                </div>
                <div class="p-4 lg:p-6">
                  <div class="relative">
                    <div class="space-y-2">
                      <template v-for="(milestone, index) in timelineMilestones" :key="index">
                        <div v-if="milestone.isNewDay" :class="index > 0 ? 'my-4 pt-2 border-t border-gray-200' : 'mb-2'">
                          <div class="ml-8 mb-2">
                            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ formatDate(milestone.date) }}</span>
                          </div>
                        </div>
                        <div class="relative flex items-center py-2">
                          <div v-if="index > 0 && !milestone.isNewDay" 
                               class="absolute left-4 w-0.5 bg-gradient-to-b from-blue-200 to-blue-300"
                               :style="`height: 40px; top: -20px; z-index: 1;`"></div>
                          <div v-else-if="index > 0 && milestone.isNewDay"
                               class="absolute left-4 w-0.5 bg-gradient-to-b from-blue-200 to-blue-300"
                               :style="`height: 20px; top: -10px; z-index: 1;`"></div>
                          
                          <div class="absolute left-4 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-300 z-10"
                            :class="milestone.isCurrent ? 'bg-blue-500 shadow-blue-200' : milestone.isPast ? 'bg-emerald-500 shadow-emerald-200' : 'bg-gray-200'">
                          </div>
                          
                          <div class="ml-8 flex-1">
                            <div class="bg-white backdrop-blur-sm rounded-full px-4 py-2.5 border w-full border-gray-100/50 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
                              <div class="flex items-center justify-between gap-3">
                                <div class="flex-1">
                                  <h3 class="text-base font-semibold text-gray-900 group-hover:text-gray-900 transition-colors">{{ milestone.label }}</h3>
                                  <p v-if="milestone.isActivity && milestone.description" class="text-xs text-gray-600 mt-0.5" v-html="milestone.description"></p>
                                </div>
                                <span :class="[
                                  'text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 ml-2 w-fit',
                                  milestone.isCurrent 
                                    ? 'bg-blue-500 text-white border border-blue-100 group-hover:bg-blue-100' 
                                    : milestone.isPast 
                                      ? 'bg-emerald-500 text-white border border-emerald-100 group-hover:bg-emerald-100'
                                      : 'bg-gray-200 text-gray-700 border border-gray-100 group-hover:bg-gray-100'
                                ]">
                                  {{ formatDate(milestone.date) }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-gray-200 mt-8">
                    <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Start Date</p>
                      <p class="text-base font-bold text-gray-900">{{ formatDate(project.startDate) }}</p>
                    </div>
                    <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">End Date</p>
                      <p class="text-base font-bold text-gray-900">{{ formatDate(project.endDate) }}</p>
                    </div>
                    <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Duration</p>
                      <p class="text-base font-bold text-gray-900">{{ formatDuration }}</p>
                    </div>
                    <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Year</p>
                      <p class="text-base font-bold text-gray-900">{{ project.year }}</p>
                    </div>
                  </div>

                  <div class="pt-8 border-t border-gray-200 mt-8">
                    <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-100">
                      <div class="flex items-center justify-between mb-5">
                        <div>
                          <p class="text-base font-bold text-gray-900">Project Progress</p>
                          <p class="text-xs text-gray-600 mt-1">Timeline completion status</p>
                        </div>
                        <div class="text-right">
                          <p class="text-3xl font-extrabold text-blue-600">{{ timelineProgress }}%</p>
                          <p class="text-xs font-medium text-gray-600 mt-1" v-if="daysRemaining !== null">
                            {{ daysRemaining > 0 ? `${daysRemaining} days remaining` : daysRemaining === 0 ? 'Ends today' : `${Math.abs(daysRemaining)} days overdue` }}
                          </p>
                        </div>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <div 
                          class="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full transition-all duration-700 shadow-sm"
                          :style="{ width: `${timelineProgress}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === TAB_IDS.DETAILS" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-300">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900">Project Details</h3>
                      <p class="text-xs text-gray-500">Complete project information</p>
                    </div>
                  </div>
                </div>
                <div class="p-6 space-y-6">
                  <div class="bg-blue-50 border border-blue-100 rounded-lg p-6">
                    <div class="flex items-center gap-2 mb-4">
                      <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h4 class="text-sm font-semibold text-blue-900 uppercase tracking-wide">Project Information</h4>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p class="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">PPA (Project Name)</p>
                        <p class="text-lg font-bold text-blue-900">{{ project.name }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">Project Code</p>
                        <p class="text-base font-semibold text-blue-900">#{{ project.code || project.id }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">Year</p>
                        <p class="text-base font-semibold text-blue-900">{{ project.year }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">Implementing Unit</p>
                        <p class="text-base font-semibold text-blue-900">{{ project.implementingUnit || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-green-50 border border-green-100 rounded-lg p-6">
                    <div class="flex items-center gap-2 mb-4">
                      <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0-2.08.402-2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 class="text-sm font-semibold text-green-900 uppercase tracking-wide">Financial Information</h4>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-green-700 uppercase tracking-wide mb-2">Appropriation</p>
                      <p class="text-2xl font-bold text-green-900">₱{{ formatNumber(project.appropriation) }}</p>
                    </div>
                  </div>

                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div class="flex items-center gap-2 mb-4">
                      <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Location & Services</h4>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Location</p>
                        <p class="text-base font-semibold text-gray-900">{{ project.location || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Services</p>
                        <p class="text-base font-semibold text-gray-900">{{ project.services || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div class="flex items-center gap-2 mb-4">
                      <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Remarks</h4>
                    </div>
                    <div>
                      <p class="text-base font-medium text-gray-900 leading-relaxed">{{ project.remarks || 'No remarks available' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === TAB_IDS.LOGS" class="space-y-6">
              <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">Activity Log</h3>
                        <p class="text-xs text-gray-500">Project updates and changes</p>
                      </div>
                    </div>
                    <button
                      v-if="auditLogs.length > 0"
                      @click="exportLogsToExcel"
                      class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export to Excel
                    </button>
                  </div>
                </div>
                <div class="p-6">
                  <div v-if="activitiesLoading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
                    <p class="mt-3 text-sm text-gray-500">Loading activities...</p>
                  </div>
                  <div v-else-if="auditLogs.length === 0" class="text-center py-12">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="text-sm font-medium text-gray-900 mb-1">No activity recorded</p>
                    <p class="text-xs text-gray-500">Activities will appear here as the project is updated</p>
                  </div>
                  <div v-else class="relative">
                    <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div class="space-y-6 pl-8">
                      <div v-for="(activity, index) in auditLogs" :key="index" class="relative">
                        <div class="absolute -left-10 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm" :class="activity.statusClass"></div>
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
                              <p class="text-sm font-semibold text-gray-900 mb-1">{{ activity.title }}</p>
                              <p class="text-xs text-gray-600 mb-2" v-html="activity.description"></p>
                              <p class="text-xs text-gray-400">{{ activity.time }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === TAB_IDS.DOCUMENTS" class="space-y-6">
              <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">Documents</h3>
                        <p class="text-xs text-gray-500">Project documents and files</p>
                      </div>
                    </div>
                    <button
                      v-if="canManageProjects"
                      class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Document
                    </button>
                  </div>
                </div>
                <div class="p-6">
                  <div class="text-center py-12">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p class="text-sm text-gray-500">No documents available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AddDisbursement
      :is-open="isDisbursementModalOpen"
      :project-id="projectId"
      @close="closeDisbursementModal"
      @save="handleSaveDisbursement"
    />
  </div>
</template>

<script setup lang="ts">
import PieChart from '~/components/ui/PieChart.vue'
import Accordion from '~/components/ui/Accordion.vue'
import AddDisbursement from '~/components/projects/AddDisbursement.vue'
import { useProjectDetail } from '~/composables/project/useProjectDetail'
import { useAdditionalBudgets } from '~/composables/additionalBudget/useAdditionalBudgets'
import { useObligations } from '~/composables/obligation/useObligations'
import { useDisbursements } from '~/composables/disbursement/useDisbursements'
import { TAB_IDS } from '~/constants/project/detailTabs'
import { useUserPermissions } from '~/composables/user/useUserPermissions'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string
const { canManageProjects } = useUserPermissions()

const handleEditClick = () => {
  router.push(`/admin/projects/edit/${projectId}`)
}

const {
  project,
  loading,
  error,
  activeTab,
  tabs,
  auditLogs,
  activitiesLoading,
  activities,
  projectStatus,
  projectStatusClass,
  formatDuration,
  formatNumber,
  formatDate,
  loadProject,
  pieChartData,
  utilizationChartData,
  timelineProgress,
  timelineMilestones,
  daysRemaining,
  exportLogsToExcel,
} = useProjectDetail(projectId)

const { fetchBudgetsByProject } = useAdditionalBudgets()
const additionalBudgets = ref<any[]>([])
const budgetsLoading = ref(false)
const budgetsError = ref<string | null>(null)

const loadBudgets = async () => {
  if (!projectId) return
  budgetsLoading.value = true
  budgetsError.value = null
  try {
    const budgets = await fetchBudgetsByProject(projectId)
    additionalBudgets.value = budgets
  } catch (err: any) {
    budgetsError.value = err?.message || 'Failed to load budgets'
  } finally {
    budgetsLoading.value = false
  }
}

const { fetchObligationsByProject } = useObligations()
const obligations = ref<any[]>([])
const obligationsLoading = ref(false)
const obligationsError = ref<string | null>(null)

const loadObligations = async () => {
  if (!projectId) return
  obligationsLoading.value = true
  obligationsError.value = null
  try {
    const obligationsList = await fetchObligationsByProject(projectId)
    obligations.value = obligationsList
  } catch (err: any) {
    obligationsError.value = err?.message || 'Failed to load obligations'
  } finally {
    obligationsLoading.value = false
  }
}

const totalObligations = computed(() => {
  return obligations.value.reduce((sum, obligation) => sum + (obligation.amount || 0), 0)
})

const { fetchDisbursementsByProject, createDisbursement } = useDisbursements()
const disbursements = ref<any[]>([])
const disbursementsLoading = ref(false)
const disbursementsError = ref<string | null>(null)
const isDisbursementModalOpen = ref(false)

const loadDisbursements = async () => {
  if (!projectId) return
  disbursementsLoading.value = true
  disbursementsError.value = null
  try {
    const disbursementsList = await fetchDisbursementsByProject(projectId)
    disbursements.value = disbursementsList
  } catch (err: any) {
    disbursementsError.value = err?.message || 'Failed to load disbursements'
  } finally {
    disbursementsLoading.value = false
  }
}

const totalDisbursements = computed(() => {
  return disbursements.value.reduce((sum, disbursement) => sum + (disbursement.amount || 0), 0)
})

const handleSaveDisbursement = async (disbursementData: {
  projectId: string
  amount: number
  reason: string
  payee: string
  approvedBy?: string
  approvedDate?: string
}) => {
  try {
    await createDisbursement({
      projectId: disbursementData.projectId,
      amount: disbursementData.amount,
      reason: disbursementData.reason,
      payee: disbursementData.payee,
      approvedBy: disbursementData.approvedBy,
      approvedDate: disbursementData.approvedDate ? new Date(disbursementData.approvedDate) : undefined,
    })
    await loadDisbursements()
    isDisbursementModalOpen.value = false
  } catch (err: any) {
    console.error('Failed to create disbursement:', err)
  }
}

const closeDisbursementModal = () => {
  isDisbursementModalOpen.value = false
}

watch(() => project.value?.id, async (newId) => {
  if (newId) {
    await loadBudgets()
    await loadObligations()
    await loadDisbursements()
  }
})

watch(() => activeTab.value, (newTab) => {
  if (newTab === TAB_IDS.BUDGET && project.value?.id) {
    loadBudgets()
  }
  if (newTab === TAB_IDS.OBLIGATIONS && project.value?.id) {
    loadObligations()
  }
  if (newTab === TAB_IDS.DISBURSEMENTS && project.value?.id) {
    loadDisbursements()
  }
})

onMounted(async () => {
  await loadProject()
  if (project.value?.id) {
    await loadBudgets()
    await loadObligations()
    await loadDisbursements()
  }
})
</script>


