import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useGeotagMap } from './useGeotagMap'
import { useConfirmModal } from '../ui/useConfirmModal'

interface GeotagMapComponentProps {
  projectId?: string
  locationName?: string | null
  initialLatitude?: number | null
  initialLongitude?: number | null
  hasSaveButton?: boolean
  showClearButton?: boolean
}

export const useGeotagMapComponent = (
  props: GeotagMapComponentProps,
  emit: (event: string, ...args: any[]) => void
) => {
  const {
    currentLatitude,
    currentLongitude,
    saving,
    error,
    locationInfo,
    hasLocation,
    reverseGeocode,
    geocodeLocation,
    getDefaultIcon,
    saveLocation,
    clearLocation,
    setCoordinates,
    getDefaultCenter,
  } = useGeotagMap({
    projectId: props.projectId,
    locationName: props.locationName,
    initialLatitude: props.initialLatitude,
    initialLongitude: props.initialLongitude,
  })

  const mapContainer = ref<HTMLElement | null>(null)
  const inputMode = ref<'map' | 'manual'>('map')
  const manualLatitude = ref<number | null>(props.initialLatitude ?? null)
  const manualLongitude = ref<number | null>(props.initialLongitude ?? null)
  const manualLatitudeError = ref<string | null>(null)
  const manualLongitudeError = ref<string | null>(null)

  const saveConfirmModal = useConfirmModal()
  const clearConfirmModal = useConfirmModal()

  let map: any = null
  let marker: any = null
  let clickMarker: any = null
  let L: any = null

  const validateCoordinates = () => {
    manualLatitudeError.value = null
    manualLongitudeError.value = null

    if (manualLatitude.value !== null) {
      if (isNaN(manualLatitude.value) || manualLatitude.value < -90 || manualLatitude.value > 90) {
        manualLatitudeError.value = 'Latitude must be between -90 and 90'
      }
    }

    if (manualLongitude.value !== null) {
      if (isNaN(manualLongitude.value) || manualLongitude.value < -180 || manualLongitude.value > 180) {
        manualLongitudeError.value = 'Longitude must be between -180 and 180'
      }
    }
  }

  const handleManualCoordinateChange = () => {
    validateCoordinates()
  }

  const applyManualCoordinates = async () => {
    validateCoordinates()

    if (manualLatitudeError.value || manualLongitudeError.value) {
      return
    }

    if (manualLatitude.value !== null && manualLongitude.value !== null) {
      setCoordinates(manualLatitude.value, manualLongitude.value)

      if (map && L) {
        if (marker) {
          map.removeLayer(marker)
        }
        if (clickMarker) {
          map.removeLayer(clickMarker)
          clickMarker = null
        }

        marker = L.default.marker([manualLatitude.value, manualLongitude.value], { icon: getDefaultIcon(L.default) })
          .addTo(map)
          .bindPopup('Project Location')

        map.setView([manualLatitude.value, manualLongitude.value], 13)
        await reverseGeocode(manualLatitude.value, manualLongitude.value)
      }

      emit('update:coordinates', manualLatitude.value, manualLongitude.value)
    }
  }

  const initMap = async () => {
    await nextTick()

    if (!mapContainer.value || typeof window === 'undefined') {
      setTimeout(() => {
        if (mapContainer.value) {
          initMap()
        }
      }, 100)
      return
    }

    if (map) {
      try {
        map.remove()
      } catch (err) {
      }
      map = null
      marker = null
      clickMarker = null
    }

    try {
      L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')

      const defaultCenter = getDefaultCenter()
      let centerLat = defaultCenter.lat
      let centerLng = defaultCenter.lng
      let zoom = defaultCenter.zoom

      if (currentLatitude.value !== null && currentLongitude.value !== null) {
        centerLat = currentLatitude.value
        centerLng = currentLongitude.value
        zoom = 13
      } else if (props.locationName) {
        const coords = await geocodeLocation(props.locationName)
        if (coords) {
          centerLat = coords.lat
          centerLng = coords.lng
          zoom = 13
        }
      }

      if (!mapContainer.value) return

      map = L.default.map(mapContainer.value).setView([centerLat, centerLng], zoom)

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      if (currentLatitude.value !== null && currentLongitude.value !== null) {
        marker = L.default.marker([currentLatitude.value, currentLongitude.value], { icon: getDefaultIcon(L.default) })
          .addTo(map)
          .bindPopup('Project Location')
        await reverseGeocode(currentLatitude.value, currentLongitude.value)
      }

      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng
        setCoordinates(lat, lng)
        manualLatitude.value = lat
        manualLongitude.value = lng
        validateCoordinates()

        if (clickMarker) {
          map.removeLayer(clickMarker)
        }

        clickMarker = L.default.marker([lat, lng], { icon: getDefaultIcon(L.default) })
          .addTo(map)
          .bindPopup('Click to set location')

        if (marker) {
          map.removeLayer(marker)
          marker = null
        }

        await reverseGeocode(lat, lng)
        emit('update:coordinates', lat, lng)
      })
    } catch (err) {
      console.error('Failed to load map:', err)
      error.value = 'Failed to load map'
    }
  }

  const toggleInputMode = async () => {
    inputMode.value = inputMode.value === 'map' ? 'manual' : 'map'
    await nextTick()
    await initMap()
  }

  const handleSaveLocation = () => {
    saveConfirmModal.open()
  }

  const onConfirmSaveLocation = async () => {
    saveConfirmModal.close()

    if (currentLatitude.value === null || currentLongitude.value === null || !L) return

    const response = await saveLocation(currentLatitude.value, currentLongitude.value)

    if (response.success) {
      if (clickMarker) {
        map?.removeLayer(clickMarker)
        clickMarker = null
      }

      if (marker) {
        map?.removeLayer(marker)
      }

      marker = L.default.marker([currentLatitude.value, currentLongitude.value], { icon: getDefaultIcon(L.default) })
        .addTo(map!)
        .bindPopup('Project Location')

      emit('saved', currentLatitude.value, currentLongitude.value)
    }
  }

  const handleClearLocation = () => {
    clearConfirmModal.open()
  }

  const onConfirmClearLocation = async () => {
    clearConfirmModal.close()

    const response = await clearLocation()

    if (response.success) {
      if (marker) {
        map?.removeLayer(marker)
        marker = null
      }

      if (clickMarker) {
        map?.removeLayer(clickMarker)
        clickMarker = null
      }

      emit('saved', null, null)
      if (!props.projectId) {
        emit('update:coordinates', null, null)
      }
    }
  }

  onMounted(() => {
    nextTick(() => {
      initMap()
    })
  })

  onUnmounted(() => {
    if (map) {
      map.remove()
      map = null
    }
  })

  watch(() => props.locationName, async (newLocation) => {
    if (map && L && newLocation && !currentLatitude.value && !currentLongitude.value) {
      const coords = await geocodeLocation(newLocation)
      if (coords) {
        map.setView([coords.lat, coords.lng], 13)
      }
    }
  })

  watch(() => [props.initialLatitude, props.initialLongitude], async ([newLat, newLng]) => {
    if (newLat !== null && newLat !== undefined && newLng !== null && newLng !== undefined) {
      manualLatitude.value = newLat
      manualLongitude.value = newLng

      if (map && L) {
        setCoordinates(newLat, newLng)

        if (marker) {
          map.removeLayer(marker)
        }

        marker = L.default.marker([newLat, newLng], { icon: getDefaultIcon(L.default) })
          .addTo(map)
          .bindPopup('Project Location')

        map.setView([newLat, newLng], 13)
        await reverseGeocode(newLat, newLng)
      }
    }
  })

  watch(() => [currentLatitude.value, currentLongitude.value], ([lat, lng]) => {
    if (lat !== null && lat !== undefined && lng !== null && lng !== undefined && !props.projectId) {
      emit('update:coordinates', lat, lng)
    }
  })

  return {
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
  }
}
