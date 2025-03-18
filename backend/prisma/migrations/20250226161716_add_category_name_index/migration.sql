/*
  Warnings:

  - You are about to drop the column `categoryId` on the `CategoryOnCourses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryName` to the `CategoryOnCourses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoryOnCourses" DROP CONSTRAINT "CategoryOnCourses_categoryId_fkey";

-- AlterTable
ALTER TABLE "CategoryOnCourses" DROP COLUMN "categoryId";
ALTER TABLE "CategoryOnCourses" ADD COLUMN     "categoryName" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "CategoryOnCourses" ADD CONSTRAINT "CategoryOnCourses_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
