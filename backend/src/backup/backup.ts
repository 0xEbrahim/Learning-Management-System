import { writeFileSync } from "fs";
import path from "path";
import prisma from "../config/prisma";

async function main() {
  const data = {
    users: await prisma.user.findMany(),
    courses: await prisma.course.findMany(),
    videos: await prisma.video.findMany(),
    comments: await prisma.comment.findMany(),
    reviews: await prisma.review.findMany(),
    reviewReplies: await prisma.reviewReply.findMany(),
    userVideoProgress: await prisma.userVideoProgress.findMany(),
    userCourseProgress: await prisma.userCourseProgress.findMany(),
    orders: await prisma.order.findMany(),
    payments: await prisma.payment.findMany(),
    prerequisites: await prisma.prerequisites.findMany(),
    demo: await prisma.demo.findMany(),
    categories: await prisma.category.findMany(),
    categoryOnCourses: await prisma.categoryOnCourses.findMany(),
    tokens: await prisma.token.findMany(),
    emails: await prisma.email.findMany(),
    notifications: await prisma.notification.findMany(),
  };

  const filePath = path.join(__dirname, "backup.json");
  writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Backup completed: ${filePath}`);
}

main()
  .catch((e) => {
    console.error("❌ Backup failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
