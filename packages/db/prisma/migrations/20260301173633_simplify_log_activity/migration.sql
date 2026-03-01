/*
  Warnings:

  - You are about to drop the column `activityType` on the `LogActivity` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `LogActivity` table. All the data in the column will be lost.
  - You are about to drop the column `entity` on the `LogActivity` table. All the data in the column will be lost.
  - Added the required column `description` to the `LogActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `LogActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LogActivity" DROP CONSTRAINT "LogActivity_userId_fkey";

-- AlterTable
ALTER TABLE "LogActivity" DROP COLUMN "activityType",
DROP COLUMN "data",
DROP COLUMN "entity",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "entityType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ActivityType";

-- AddForeignKey
ALTER TABLE "LogActivity" ADD CONSTRAINT "LogActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
