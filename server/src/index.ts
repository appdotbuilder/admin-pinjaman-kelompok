
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createUserInputSchema, 
  createGroupInputSchema, 
  updateGroupInputSchema,
  createMemberInputSchema, 
  updateMemberInputSchema,
  createLoanInputSchema,
  verifyLoanInputSchema,
  approveLoanInputSchema,
  disburseLoanInputSchema,
  recordPaymentInputSchema,
  recordJointLiabilityPaymentInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { createGroup } from './handlers/create_group';
import { getGroups } from './handlers/get_groups';
import { updateGroup } from './handlers/update_group';
import { createMember } from './handlers/create_member';
import { getMembers } from './handlers/get_members';
import { getMembersByGroup } from './handlers/get_members_by_group';
import { updateMember } from './handlers/update_member';
import { createLoan } from './handlers/create_loan';
import { getLoans } from './handlers/get_loans';
import { getPendingLoans } from './handlers/get_pending_loans';
import { verifyLoan } from './handlers/verify_loan';
import { approveLoan } from './handlers/approve_loan';
import { disburseLoan } from './handlers/disburse_loan';
import { getPaymentSchedules } from './handlers/get_payment_schedules';
import { recordPayment } from './handlers/record_payment';
import { recordJointLiabilityPayment } from './handlers/record_joint_liability_payment';
import { getOverduePayments } from './handlers/get_overdue_payments';
import { getLoanReport } from './handlers/get_loan_report';
import { getCollectibilityReport } from './handlers/get_collectibility_report';
import { getMemberReport } from './handlers/get_member_report';
import { generateLoanApplicationDocument } from './handlers/generate_loan_application_document';
import { generateVerificationReport } from './handlers/generate_verification_report';
import { generateApprovalLetter } from './handlers/generate_approval_letter';
import { generateDisbursementAuthorization } from './handlers/generate_disbursement_authorization';
import { generateCreditAgreement } from './handlers/generate_credit_agreement';
import { generateDisbursementMinutes } from './handlers/generate_disbursement_minutes';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  getUsers: publicProcedure
    .query(() => getUsers()),

  // Group management
  createGroup: publicProcedure
    .input(createGroupInputSchema)
    .mutation(({ input }) => createGroup(input)),
  getGroups: publicProcedure
    .query(() => getGroups()),
  updateGroup: publicProcedure
    .input(updateGroupInputSchema)
    .mutation(({ input }) => updateGroup(input)),

  // Member management
  createMember: publicProcedure
    .input(createMemberInputSchema)
    .mutation(({ input }) => createMember(input)),
  getMembers: publicProcedure
    .query(() => getMembers()),
  getMembersByGroup: publicProcedure
    .input(z.number())
    .query(({ input }) => getMembersByGroup(input)),
  updateMember: publicProcedure
    .input(updateMemberInputSchema)
    .mutation(({ input }) => updateMember(input)),

  // Loan management
  createLoan: publicProcedure
    .input(createLoanInputSchema)
    .mutation(({ input }) => createLoan(input)),
  getLoans: publicProcedure
    .query(() => getLoans()),
  getPendingLoans: publicProcedure
    .query(() => getPendingLoans()),
  verifyLoan: publicProcedure
    .input(verifyLoanInputSchema)
    .mutation(({ input }) => verifyLoan(input)),
  approveLoan: publicProcedure
    .input(approveLoanInputSchema)
    .mutation(({ input }) => approveLoan(input)),
  disburseLoan: publicProcedure
    .input(disburseLoanInputSchema)
    .mutation(({ input }) => disburseLoan(input)),

  // Payment management
  getPaymentSchedules: publicProcedure
    .input(z.number())
    .query(({ input }) => getPaymentSchedules(input)),
  recordPayment: publicProcedure
    .input(recordPaymentInputSchema)
    .mutation(({ input }) => recordPayment(input)),
  recordJointLiabilityPayment: publicProcedure
    .input(recordJointLiabilityPaymentInputSchema)
    .mutation(({ input }) => recordJointLiabilityPayment(input)),
  getOverduePayments: publicProcedure
    .query(() => getOverduePayments()),

  // Reports
  getLoanReport: publicProcedure
    .query(() => getLoanReport()),
  getCollectibilityReport: publicProcedure
    .query(() => getCollectibilityReport()),
  getMemberReport: publicProcedure
    .query(() => getMemberReport()),

  // Document generation
  generateLoanApplicationDocument: publicProcedure
    .input(z.number())
    .mutation(({ input }) => generateLoanApplicationDocument(input)),
  generateVerificationReport: publicProcedure
    .input(z.number())
    .mutation(({ input }) => generateVerificationReport(input)),
  generateApprovalLetter: publicProcedure
    .input(z.number())
    .mutation(({ input }) => generateApprovalLetter(input)),
  generateDisbursementAuthorization: publicProcedure
    .input(z.number())
    .mutation(({ input }) => generateDisbursementAuthorization(input)),
  generateCreditAgreement: publicProcedure
    .input(z.number())
    .mutation(({ input }) => generateCreditAgreement(input)),
  generateDisbursementMinutes: publicProcedure
    .input(z.number())
    .mutation(({ input }) => generateDisbursementMinutes(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server untuk Sistem Administrasi Pinjaman Kelompok berjalan pada port: ${port}`);
}

start();
