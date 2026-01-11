<template>
  <div class="w-full">
    <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Project Location</h3>
              <p class="text-xs text-gray-500">{{ inputMode === 'map' ? 'Click on the map to set project coordinates' : 'Enter coordinates manually' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="toggleInputMode"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="inputMode === 'map' 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
            >
              <span class="flex items-center gap-2">
                <svg v-if="inputMode === 'map'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {{ inputMode === 'map' ? 'Manual Input' : 'Map View' }}
              </span>
            </button>
            <div v-if="hasSaveButton && hasLocation" class="flex items-center gap-2 ml-2">
            <button
              v-if="showClearButton"
              @click="handleClearLocation"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Location
            </button>
            <button
              @click="handleSaveLocation"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving">Saving...</span>
              <span v-else>Save Location</span>
            </button>
            </div>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
        
        <div v-if="currentLatitude !== null && currentLongitude !== null" class="mb-4">
          <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-300">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Location Details</h3>
                  <p class="text-xs text-gray-500">Geographic coordinates and address information</p>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-6">
              <div class="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h4 class="text-sm font-semibold text-blue-900 uppercase tracking-wide">Coordinates</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p class="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">Latitude</p>
                    <p class="text-base font-semibold text-blue-900">{{ currentLatitude.toFixed(6) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">Longitude</p>
                    <p class="text-base font-semibold text-blue-900">{{ currentLongitude.toFixed(6) }}</p>
                  </div>
                </div>
              </div>

              <div v-if="locationInfo.loading" class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div class="flex items-center justify-center gap-3">
                  <div class="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span class="text-sm font-medium text-gray-700">Identifying location...</span>
                </div>
              </div>

              <div v-else-if="locationInfo.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm text-red-700">{{ locationInfo.error }}</p>
                </div>
              </div>

              <div v-else-if="locationInfo.barangay || locationInfo.municipality" class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Address Information</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-if="locationInfo.barangay">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Barangay</p>
                    <p class="text-base font-semibold text-gray-900">{{ locationInfo.barangay }}</p>
                  </div>
                  <div v-if="locationInfo.municipality">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Municipality</p>
                    <p class="text-base font-semibold text-gray-900">{{ locationInfo.municipality }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="inputMode === 'manual'" class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="manual-latitude" class="block text-sm font-medium text-gray-700 mb-2">
                  Latitude <span class="text-xs text-gray-500 font-normal">(Range: -90 to 90)</span>
                </label>
                <input
                  id="manual-latitude"
                  v-model.number="manualLatitude"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  placeholder="e.g., 14.5995"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  @blur="handleManualCoordinateChange"
                />
                <p v-if="manualLatitudeError" class="mt-1 text-xs text-red-600">{{ manualLatitudeError }}</p>
              </div>
              <div>
                <label for="manual-longitude" class="block text-sm font-medium text-gray-700 mb-2">
                  Longitude <span class="text-xs text-gray-500 font-normal">(Range: -180 to 180)</span>
                </label>
                <input
                  id="manual-longitude"
                  v-model.number="manualLongitude"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  placeholder="e.g., 120.9842"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  @blur="handleManualCoordinateChange"
                />
                <p v-if="manualLongitudeError" class="mt-1 text-xs text-red-600">{{ manualLongitudeError }}</p>
              </div>
            </div>
            <button
              v-if="manualLatitude !== null && manualLongitude !== null && !manualLatitudeError && !manualLongitudeError"
              @click="applyManualCoordinates"
              class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Coordinates
            </button>
          </div>
          <div ref="mapContainer" class="w-full h-[400px] rounded-lg border border-gray-200"></div>
        </div>
        
        <div v-else>
          <div ref="mapContainer" class="w-full h-[600px] rounded-lg border border-gray-200"></div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :is-open="saveConfirmModal.isOpen.value"
    :title="MODAL_MESSAGES.SAVE_LOCATION.title"
    :message="MODAL_MESSAGES.SAVE_LOCATION.message"
    :confirm-text="MODAL_MESSAGES.SAVE_LOCATION.confirmText"
    :cancel-text="MODAL_MESSAGES.SAVE_LOCATION.cancelText"
    :loading="saving"
    :loading-text="MODAL_MESSAGES.SAVE_LOCATION.loadingText"
    @confirm="onConfirmSaveLocation"
    @cancel="saveConfirmModal.close"
  />

  <ConfirmModal
    :is-open="clearConfirmModal.isOpen.value"
    :title="MODAL_MESSAGES.CLEAR_LOCATION.title"
    :message="MODAL_MESSAGES.CLEAR_LOCATION.message"
    :confirm-text="MODAL_MESSAGES.CLEAR_LOCATION.confirmText"
    :cancel-text="MODAL_MESSAGES.CLEAR_LOCATION.cancelText"
    :loading="saving"
    :loading-text="MODAL_MESSAGES.CLEAR_LOCATION.loadingText"
    @confirm="onConfirmClearLocation"
    @cancel="clearConfirmModal.close"
  />
</template>

<script setup lang="ts">
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import { MODAL_MESSAGES } from '~/constants/ui/modalMessages'
import { useGeotagMapComponent } from '~/composables/map/useGeotagMapComponent'

interface Props {
  projectId?: string
  locationName?: string | null
  initialLatitude?: number | null
  initialLongitude?: number | null
  hasSaveButton?: boolean
  showClearButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasSaveButton: true,
  showClearButton: true,
})

const emit = defineEmits<{
  saved: [latitude: number | null, longitude: number | null]
  'update:coordinates': [latitude: number | null, longitude: number | null]
}>()

const {
  mapContainer,
  inputMode,
  manualLatitude,
  manualLongitude,
  manualLatitudeError,
  manualLongitudeError,
  currentLatitude,
  currentLongitude,
  saving,
  error,
  locationInfo,
  hasLocation,
  saveConfirmModal,
  clearConfirmModal,
  toggleInputMode,
  handleManualCoordinateChange,
  applyManualCoordinates,
  handleSaveLocation,
  onConfirmSaveLocation,
  handleClearLocation,
  onConfirmClearLocation,
} = useGeotagMapComponent(props, emit as (event: string, ...args: any[]) => void)
</script>

