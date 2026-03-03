-- CreateEnum
CREATE TYPE "BulkEmailStatus" AS ENUM ('DRAFT', 'SENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "BulkEmail" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "BulkEmailStatus" NOT NULL DEFAULT 'DRAFT',
    "senderId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "recipientTarget" JSONB NOT NULL,
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulkEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulkEmailRecipient" (
    "id" TEXT NOT NULL,
    "bulkEmailId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "recipientType" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BulkEmailRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BulkEmailRecipient_bulkEmailId_idx" ON "BulkEmailRecipient"("bulkEmailId");

-- CreateIndex
CREATE INDEX "BulkEmailRecipient_recipientType_recipientId_idx" ON "BulkEmailRecipient"("recipientType", "recipientId");

-- AddForeignKey
ALTER TABLE "BulkEmail" ADD CONSTRAINT "BulkEmail_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkEmail" ADD CONSTRAINT "BulkEmail_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkEmailRecipient" ADD CONSTRAINT "BulkEmailRecipient_bulkEmailId_fkey" FOREIGN KEY ("bulkEmailId") REFERENCES "BulkEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
