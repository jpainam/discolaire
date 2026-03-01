-- AlterTable
ALTER TABLE "LogActivity" ADD COLUMN     "metadata" JSONB;

-- CreateIndex
CREATE INDEX "LogActivity_schoolId_entityType_entityId_idx" ON "LogActivity"("schoolId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "LogActivity_schoolId_userId_idx" ON "LogActivity"("schoolId", "userId");

-- CreateIndex
CREATE INDEX "LogActivity_schoolId_createdAt_idx" ON "LogActivity"("schoolId", "createdAt" DESC);
