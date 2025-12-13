import { ProjectService } from '../../services/project/ProjectService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const projectService = new ProjectService()
    const projects = await projectService.list()

    return {
      success: true,
      projects,
    }
  })
})
