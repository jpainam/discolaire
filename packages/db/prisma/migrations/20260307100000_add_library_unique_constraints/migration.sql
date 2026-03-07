-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_schoolId_key" ON "Book"("isbn", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "BookCategory_name_schoolId_key" ON "BookCategory"("name", "schoolId");
