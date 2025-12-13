import { ServiceService } from '../../services/service/ServiceService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const serviceService = new ServiceService()
    const services = await serviceService.list()

    return {
      success: true,
      services,
    }
  })
})
