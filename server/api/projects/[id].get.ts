import { ProjectService } from '../../services/project/ProjectService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required'
    })
  }

  return await withErrorHandler(async () => {
    const projectService = new ProjectService()
    const project = await projectService.get(id)

    if (!project) {
      throw createError({
        statusCode: 404,
        message: 'Project not found'
      })
    }

    return {
      success: true,
      project,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch project'
  })
})

