/*
  Warnings:

  - Added the required column `sectionId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "sectionId" STRING NOT NULL;

-- CreateTable
CREATE TABLE "CourseSections" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseId" STRING NOT NULL,

    CONSTRAINT "CourseSections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CourseSections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSections" ADD CONSTRAINT "CourseSections_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
