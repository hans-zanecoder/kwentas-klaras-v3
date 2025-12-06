import type { CarouselImage } from '~/types/ui/imageCarousel'

export const useCarousel = (images: CarouselImage[], intervalMs: number = 5000) => {
  const currentImageIndex = ref(0)
  let carouselInterval: NodeJS.Timeout | null = null

  const nextImage = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length
  }

  const previousImage = () => {
    currentImageIndex.value = currentImageIndex.value === 0 ? images.length - 1 : currentImageIndex.value - 1
  }

  const goToImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      currentImageIndex.value = index
    }
  }

  const startCarousel = () => {
    if (carouselInterval) {
      clearInterval(carouselInterval)
    }
    carouselInterval = setInterval(() => {
      nextImage()
    }, intervalMs)
  }

  const stopCarousel = () => {
    if (carouselInterval) {
      clearInterval(carouselInterval)
      carouselInterval = null
    }
  }

  onMounted(() => {
    startCarousel()
  })

  onUnmounted(() => {
    stopCarousel()
  })

  return {
    currentImageIndex,
    nextImage,
    previousImage,
    goToImage,
    startCarousel,
    stopCarousel,
  }
}

