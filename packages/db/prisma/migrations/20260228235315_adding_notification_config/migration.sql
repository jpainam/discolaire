-- CreateTable
CREATE TABLE "NotificationConfig" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'EMAIL',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "allowStaff" BOOLEAN NOT NULL DEFAULT true,
    "allowStudent" BOOLEAN NOT NULL DEFAULT true,
    "allowContact" BOOLEAN NOT NULL DEFAULT true,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationConfig_schoolId_channel_idx" ON "NotificationConfig"("schoolId", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationConfig_schoolId_templateKey_channel_key" ON "NotificationConfig"("schoolId", "templateKey", "channel");

-- AddForeignKey
ALTER TABLE "NotificationConfig" ADD CONSTRAINT "NotificationConfig_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationConfig" ADD CONSTRAINT "NotificationConfig_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
