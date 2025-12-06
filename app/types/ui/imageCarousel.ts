export interface CarouselImage {
  src: string
  alt: string
  title: string
  description: string
}

export interface ImageCarouselProps {
  images: CarouselImage[]
  intervalMs?: number
}

