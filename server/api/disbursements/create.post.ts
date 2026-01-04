import { DisbursementService } from '../../services/disbursement/DisbursementService';
import { withErrorHandler } from '../../utils/errorHandler';
import type { CreateDisbursementRequest } from '../../types/disbursement/createDisbursementRequest';

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateDisbursementRequest>(event);

  if (!body.projectId || !body.amount || !body.reason || !body.payee) {
    throw createError({
      statusCode: 400,
      message: 'projectId, amount, reason, and payee are required',
    });
  }

  return await withErrorHandler(async () => {
    const disbursementService = new DisbursementService();
    const disbursement = await disbursementService.create({
      projectId: body.projectId,
      amount: body.amount,
      reason: body.reason,
      payee: body.payee,
      approvedBy: body.approvedBy,
      approvedDate: body.approvedDate,
      status: body.status,
    });

    return {
      success: true,
      disbursement,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to create disbursement',
  });
});

