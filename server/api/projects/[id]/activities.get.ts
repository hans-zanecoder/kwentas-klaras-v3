import { ProjectActivityService } from '../../../services/project/ProjectActivityService'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required',
    })
  }

  return await withErrorHandler(async () => {
    const activityService = new ProjectActivityService()
    const activities = await activityService.findByProjectId(projectId)

    return {
      success: true,
      activities,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch project activities',
  })
})

