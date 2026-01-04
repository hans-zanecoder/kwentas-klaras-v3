import { DisbursementService } from '../../../services/disbursement/DisbursementService';
import { withErrorHandler } from '../../../utils/errorHandler';

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId');

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required',
    });
  }

  return await withErrorHandler(async () => {
    const disbursementService = new DisbursementService();
    const disbursements = await disbursementService.findByProject(projectId);

    return {
      success: true,
      disbursements,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch disbursements',
  });
});

