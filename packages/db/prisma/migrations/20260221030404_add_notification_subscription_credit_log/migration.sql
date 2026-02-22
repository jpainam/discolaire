/*
  Warnings:

  - You are about to drop the column `payload` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `NotificationDelivery` table. All the data in the column will be lost.
  - You are about to drop the `NotificationTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationTemplateVariable` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[recipientId,channel]` on the table `NotificationSubscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `NotificationDelivery` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_templateId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationSubscription" DROP CONSTRAINT "NotificationSubscription_createdById_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "payload",
DROP COLUMN "templateId",
ADD COLUMN     "context" JSONB;

-- AlterTable
ALTER TABLE "NotificationDelivery" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "NotificationSubscription" ALTER COLUMN "plan" DROP NOT NULL;

-- DropTable
DROP TABLE "NotificationTemplate";

-- DropTable
DROP TABLE "NotificationTemplateVariable";

-- DropEnum
DROP TYPE "NotificationTemplateStatus";

-- DropEnum
DROP TYPE "NotificationTemplateVarType";

-- CreateTable
CREATE TABLE "NotificationCreditLog" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "notificationId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationCreditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationCreditLog_subscriptionId_createdAt_idx" ON "NotificationCreditLog"("subscriptionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSubscription_recipientId_channel_key" ON "NotificationSubscription"("recipientId", "channel");

-- AddForeignKey
ALTER TABLE "NotificationSubscription" ADD CONSTRAINT "NotificationSubscription_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationCreditLog" ADD CONSTRAINT "NotificationCreditLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "NotificationSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationCreditLog" ADD CONSTRAINT "NotificationCreditLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
