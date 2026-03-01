/*
  Warnings:

  - You are about to drop the column `subjectId` on the `LogActivity` table. All the data in the column will be lost.
  - You are about to drop the column `subjectType` on the `LogActivity` table. All the data in the column will be lost.
  - Added the required column `targetType` to the `LogActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "LogActivity_schoolId_subjectType_subjectId_idx";

-- AlterTable
ALTER TABLE "LogActivity" DROP COLUMN "subjectId",
DROP COLUMN "subjectType",
ADD COLUMN     "targetId" TEXT,
ADD COLUMN     "targetType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "LogActivity_schoolId_targetType_targetId_idx" ON "LogActivity"("schoolId", "targetType", "targetId");
