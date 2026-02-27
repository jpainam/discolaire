-- CreateTable
CREATE TABLE "TermReportConfig" (
    "id" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "examStartDate" TIMESTAMP(3),
    "examEndDate" TIMESTAMP(3),
    "resultPublishedAt" TIMESTAMP(3),
    "schoolId" TEXT NOT NULL,
    "schoolYearId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermReportConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TermReportConfig_termId_key" ON "TermReportConfig"("termId");

-- AddForeignKey
ALTER TABLE "TermReportConfig" ADD CONSTRAINT "TermReportConfig_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermReportConfig" ADD CONSTRAINT "TermReportConfig_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermReportConfig" ADD CONSTRAINT "TermReportConfig_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
