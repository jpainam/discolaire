/*
  Warnings:

  - Added the required column `description` to the `NotificationConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `NotificationConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationConfig" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "NotificationCategory" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationCategory_schoolId_order_idx" ON "NotificationCategory"("schoolId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationCategory_schoolId_key_key" ON "NotificationCategory"("schoolId", "key");

-- CreateIndex
CREATE INDEX "NotificationConfig_schoolId_categoryId_idx" ON "NotificationConfig"("schoolId", "categoryId");

-- AddForeignKey
ALTER TABLE "NotificationCategory" ADD CONSTRAINT "NotificationCategory_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationConfig" ADD CONSTRAINT "NotificationConfig_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "NotificationCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
