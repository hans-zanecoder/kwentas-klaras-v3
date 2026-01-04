import { DisbursementService } from '../../services/disbursement/DisbursementService';
import { withErrorHandler } from '../../utils/errorHandler';

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const disbursementService = new DisbursementService();
    const disbursements = await disbursementService.list();

    return {
      success: true,
      disbursements,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch disbursements',
  });
});

