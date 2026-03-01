/*
  Warnings:

  - You are about to drop the column `entityId` on the `LogActivity` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `LogActivity` table. All the data in the column will be lost.
  - Added the required column `subjectType` to the `LogActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "LogActivity_schoolId_entityType_entityId_idx";

-- AlterTable
ALTER TABLE "LogActivity" DROP COLUMN "entityId",
DROP COLUMN "entityType",
ADD COLUMN     "subjectId" TEXT,
ADD COLUMN     "subjectType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "LogActivity_schoolId_subjectType_subjectId_idx" ON "LogActivity"("schoolId", "subjectType", "subjectId");
