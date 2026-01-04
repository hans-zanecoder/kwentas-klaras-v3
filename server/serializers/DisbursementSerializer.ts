import type { Disbursement } from '@prisma/client';

export class DisbursementSerializer {
  static formatDisbursement(disbursement: Disbursement, projectName?: string) {
    return {
      id: disbursement.id,
      projectId: disbursement.projectId,
      projectName: projectName,
      amount: disbursement.amount,
      reason: disbursement.reason,
      payee: disbursement.payee,
      approvedBy: disbursement.approvedBy,
      approvedDate: disbursement.approvedDate,
      status: disbursement.status,
      createdAt: disbursement.createdAt,
      updatedAt: disbursement.updatedAt,
    };
  }

  static list(disbursements: Disbursement[], projectMap?: Map<string, string>) {
    return disbursements.map(disbursement => {
      const projectName = projectMap?.get(disbursement.projectId);
      return this.formatDisbursement(disbursement, projectName);
    });
  }

  static detail(disbursement: Disbursement | null, projectName?: string) {
    return disbursement ? this.formatDisbursement(disbursement, projectName) : null;
  }
}

