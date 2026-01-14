import { ObligationService } from '../../services/obligation/ObligationService';
import type { CreateObligationRequest } from '../../types/obligation/createObligationRequest';
import { requireAuth } from '../../utils/auth';
import { requireCSRF } from '../../utils/csrfMiddleware';
import { sanitizeString, sanitizeNumber } from '../../utils/sanitize';
import { withErrorHandler } from '../../utils/errorHandler';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  await requireCSRF(event);
  
  const body = await readBody<CreateObligationRequest>(event);

  const sanitizedBody = {
    projectId: sanitizeString(body.projectId),
    amount: sanitizeNumber(body.amount),
    reason: sanitizeString(body.reason),
    payee: sanitizeString(body.payee),
    approvedBy: body.approvedBy ? sanitizeString(body.approvedBy) : undefined,
    approvedDate: body.approvedDate,
    status: body.status ? sanitizeString(body.status) : undefined,
  };

  if (!sanitizedBody.projectId || !sanitizedBody.amount || !sanitizedBody.reason || !sanitizedBody.payee) {
    throw createError({
      statusCode: 400,
      message: 'projectId, amount, reason, and payee are required',
    });
  }

  return await withErrorHandler(async () => {
    const obligationService = new ObligationService();
    const obligation = await obligationService.create({
      projectId: sanitizedBody.projectId,
      amount: sanitizedBody.amount || 0,
      reason: sanitizedBody.reason,
      payee: sanitizedBody.payee,
      approvedBy: sanitizedBody.approvedBy,
      approvedDate: sanitizedBody.approvedDate,
      status: sanitizedBody.status,
    });

    return {
      success: true,
      obligation,
    };
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to create obligation',
  });
});

