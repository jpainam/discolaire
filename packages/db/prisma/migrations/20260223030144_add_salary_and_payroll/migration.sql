-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED');

-- CreateTable
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL,
    "paymentRef" TEXT,
    "staffId" TEXT NOT NULL,
    "period" DATE NOT NULL,
    "baseSalary" DOUBLE PRECISION NOT NULL,
    "deductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT NOT NULL DEFAULT 'CASH',
    "observation" TEXT,
    "schoolId" TEXT NOT NULL,
    "schoolYearId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payroll_schoolId_status_idx" ON "Payroll"("schoolId", "status");

-- CreateIndex
CREATE INDEX "Payroll_schoolId_staffId_idx" ON "Payroll"("schoolId", "staffId");

-- CreateIndex
CREATE INDEX "Payroll_schoolId_period_idx" ON "Payroll"("schoolId", "period");

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
