import { ProjectService } from '../../services/project/ProjectService'
import { withErrorHandler } from '../../utils/errorHandler'
import type { IProject } from '../../types/project/project'

export default defineEventHandler(async (event) => {
  const body = await readBody<IProject>(event)

  if (!body.name || !body.appropriation || !body.year || !body.services || !body.startDate || !body.endDate) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: name, appropriation, year, services, startDate, endDate'
    })
  }

  return await withErrorHandler(async () => {
    const projectService = new ProjectService()
    const project = await projectService.create({
      name: body.name,
      implementingUnit: body.implementingUnit,
      appropriation: body.appropriation,
      year: body.year,
      services: body.services,
      startDate: body.startDate,
      endDate: body.endDate,
    })

    return {
      success: true,
      project,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to create project'
  })
})

