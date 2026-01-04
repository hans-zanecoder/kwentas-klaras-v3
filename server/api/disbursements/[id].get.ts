import { DisbursementService } from '../../services/disbursement/DisbursementService';
import { withErrorHandler } from '../../utils/errorHandler';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Disbursement ID is required',
    });
  }

  return await withErrorHandler(async () => {
    const disbursementService = new DisbursementService();
    const disbursement = await disbursementService.get(id);

    if (!disbursement) {
      throw createError({
        statusCode: 404,
        message: 'Disbursement not found',
      });
    }

    return {
      success: true,
      disbursement,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch disbursement',
  });
});

