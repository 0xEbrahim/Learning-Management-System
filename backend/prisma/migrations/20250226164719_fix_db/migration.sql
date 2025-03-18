-- DropForeignKey
ALTER TABLE "CategoryOnCourses" DROP CONSTRAINT "CategoryOnCourses_categoryName_fkey";

-- AddForeignKey
ALTER TABLE "CategoryOnCourses" ADD CONSTRAINT "CategoryOnCourses_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
