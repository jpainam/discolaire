/*
  Warnings:

  - You are about to drop the column `available` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `BorrowedBook` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'FULFILLED');

-- DropForeignKey
ALTER TABLE "BorrowedBook" DROP CONSTRAINT "BorrowedBook_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BorrowedBook" DROP CONSTRAINT "BorrowedBook_userId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "available",
ADD COLUMN     "copies" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "lastBorrowed" DROP NOT NULL,
ALTER COLUMN "lastBorrowed" DROP DEFAULT;

-- DropTable
DROP TABLE "BorrowedBook";

-- CreateTable
CREATE TABLE "BookLoan" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "studentId" TEXT,
    "staffId" TEXT,
    "contactId" TEXT,
    "createdById" TEXT,
    "borrowed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returned" TIMESTAMP(3),
    "expected" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookReservation" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "studentId" TEXT,
    "staffId" TEXT,
    "contactId" TEXT,
    "createdById" TEXT,
    "reservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookReservation_schoolId_idx" ON "BookReservation"("schoolId");

-- CreateIndex
CREATE INDEX "BookReservation_bookId_idx" ON "BookReservation"("bookId");

-- AddForeignKey
ALTER TABLE "BookLoan" ADD CONSTRAINT "BookLoan_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLoan" ADD CONSTRAINT "BookLoan_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLoan" ADD CONSTRAINT "BookLoan_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLoan" ADD CONSTRAINT "BookLoan_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLoan" ADD CONSTRAINT "BookLoan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReservation" ADD CONSTRAINT "BookReservation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReservation" ADD CONSTRAINT "BookReservation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReservation" ADD CONSTRAINT "BookReservation_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReservation" ADD CONSTRAINT "BookReservation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReservation" ADD CONSTRAINT "BookReservation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
