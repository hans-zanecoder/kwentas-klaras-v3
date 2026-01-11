import { ProjectActivityService } from '../../../../services/project/ProjectActivityService'
import { withErrorHandler } from '../../../../utils/errorHandler'

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
    
    await activityService.create({
      projectId,
      action: 'excel_downloaded',
      description: 'Project activity log was exported to Excel',
    })

    return {
      success: true,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to log excel download activity',
  })
})
