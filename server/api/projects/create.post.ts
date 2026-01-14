import { ProjectService } from '../../services/project/ProjectService'
import type { IProject } from '../../types/project/project'
import { requireAuth } from '../../utils/auth'
import { requireCSRF } from '../../utils/csrfMiddleware'
import { sanitizeString, sanitizeNumber } from '../../utils/sanitize'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  await requireCSRF(event)
  
  const body = await readBody<IProject>(event)

  const sanitizedBody = {
    name: sanitizeString(body.name),
    implementingUnit: body.implementingUnit ? sanitizeString(body.implementingUnit) : undefined,
    location: body.location ? sanitizeString(body.location) : undefined,
    appropriation: sanitizeNumber(body.appropriation),
    year: sanitizeNumber(body.year),
    services: body.services ? sanitizeString(body.services) : undefined,
    remarks: body.remarks ? sanitizeString(body.remarks) : undefined,
    code: body.code ? sanitizeString(body.code) : undefined,
    startDate: body.startDate,
    endDate: body.endDate,
    latitude: body.latitude !== undefined ? sanitizeNumber(body.latitude) : undefined,
    longitude: body.longitude !== undefined ? sanitizeNumber(body.longitude) : undefined,
  }

  if (!sanitizedBody.name || !sanitizedBody.appropriation || !sanitizedBody.year || !sanitizedBody.services || !sanitizedBody.startDate || !sanitizedBody.endDate) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: name, appropriation, year, services, startDate, endDate'
    })
  }

  return await withErrorHandler(async () => {
    const projectService = new ProjectService()
    const project = await projectService.create({
      name: sanitizedBody.name,
      implementingUnit: sanitizedBody.implementingUnit,
      location: sanitizedBody.location,
      appropriation: sanitizedBody.appropriation || 0,
      year: sanitizedBody.year || new Date().getFullYear(),
      services: sanitizedBody.services || '',
      remarks: sanitizedBody.remarks,
      code: sanitizedBody.code,
      startDate: sanitizedBody.startDate,
      endDate: sanitizedBody.endDate,
      latitude: sanitizedBody.latitude !== undefined ? sanitizedBody.latitude : undefined,
      longitude: sanitizedBody.longitude !== undefined ? sanitizedBody.longitude : undefined,
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

