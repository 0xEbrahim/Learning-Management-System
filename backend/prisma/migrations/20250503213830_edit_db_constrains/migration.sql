-- DropForeignKey
ALTER TABLE "CourseSections" DROP CONSTRAINT "CourseSections_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_sectionId_fkey";

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CourseSections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSections" ADD CONSTRAINT "CourseSections_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
