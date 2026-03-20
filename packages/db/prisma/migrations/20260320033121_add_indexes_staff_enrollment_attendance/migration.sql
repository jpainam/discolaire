-- CreateIndex
CREATE INDEX "Attendance_studentId_termId_idx" ON "Attendance"("studentId", "termId");

-- CreateIndex
CREATE INDEX "Enrollment_studentId_schoolYearId_idx" ON "Enrollment"("studentId", "schoolYearId");

-- CreateIndex
CREATE INDEX "Staff_schoolId_idx" ON "Staff"("schoolId");
