-- CreateEnum
CREATE TYPE "DiscountCriterionType" AS ENUM ('ALWAYS', 'SIBLING_COUNT', 'STAFF_CHILD', 'RELIGION');

-- CreateEnum
CREATE TYPE "DiscountValueType" AS ENUM ('PERCENT', 'FIXED');

-- CreateEnum
CREATE TYPE "DiscountAssignmentStatus" AS ENUM ('ALLOW', 'DENY');

-- CreateEnum
CREATE TYPE "DiscountAssignmentSource" AS ENUM ('AUTO', 'MANUAL');

-- CreateTable
CREATE TABLE "DiscountPolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criterionType" "DiscountCriterionType" NOT NULL,
    "criterionConfig" JSONB,
    "valueType" "DiscountValueType" NOT NULL DEFAULT 'PERCENT',
    "value" DOUBLE PRECISION NOT NULL,
    "maxAmount" DOUBLE PRECISION,
    "stackable" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "activeFrom" TIMESTAMP(6),
    "activeTo" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "schoolId" TEXT NOT NULL,
    "schoolYearId" TEXT,
    "classroomId" TEXT,

    CONSTRAINT "DiscountPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountPolicyAssignment" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "DiscountAssignmentStatus" NOT NULL DEFAULT 'ALLOW',
    "source" "DiscountAssignmentSource" NOT NULL DEFAULT 'AUTO',
    "note" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "DiscountPolicyAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscountPolicy_schoolId_isActive_criterionType_idx"
ON "DiscountPolicy"("schoolId", "isActive", "criterionType");

-- CreateIndex
CREATE INDEX "DiscountPolicy_schoolId_schoolYearId_classroomId_isActive_idx"
ON "DiscountPolicy"("schoolId", "schoolYearId", "classroomId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountPolicyAssignment_policyId_studentId_key"
ON "DiscountPolicyAssignment"("policyId", "studentId");

-- CreateIndex
CREATE INDEX "DiscountPolicyAssignment_studentId_status_idx"
ON "DiscountPolicyAssignment"("studentId", "status");

-- CreateIndex
CREATE INDEX "DiscountPolicyAssignment_policyId_status_idx"
ON "DiscountPolicyAssignment"("policyId", "status");

-- AddForeignKey
ALTER TABLE "DiscountPolicy"
ADD CONSTRAINT "DiscountPolicy_schoolId_fkey"
FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountPolicy"
ADD CONSTRAINT "DiscountPolicy_schoolYearId_fkey"
FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountPolicy"
ADD CONSTRAINT "DiscountPolicy_classroomId_fkey"
FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountPolicyAssignment"
ADD CONSTRAINT "DiscountPolicyAssignment_policyId_fkey"
FOREIGN KEY ("policyId") REFERENCES "DiscountPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountPolicyAssignment"
ADD CONSTRAINT "DiscountPolicyAssignment_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
