import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";
import prisma from "../config/prisma";

const filePath = path.join(__dirname, "backup.json");

async function safeInsert<T>(
  model: keyof PrismaClient,
  records: T[],
  label: string
) {
  console.log(`🔄 Restoring ${label} (${records.length})...`);
  for (const item of records) {
    try {
      // @ts-ignore
      await prisma[model].create({ data: item });
    } catch (error) {
      console.error(`❌ Failed to insert ${label} record:`, error);
    }
  }
}

async function main() {
  const raw = readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  await safeInsert("user", data.users, "Users");
  await safeInsert("token", data.tokens, "Tokens");
  await safeInsert("email", data.emails, "Emails");
  await safeInsert("notification", data.notifications, "Notifications");

  await safeInsert("category", data.categories, "Categories");
  await safeInsert("course", data.courses, "Courses");

  await safeInsert(
    "categoryOnCourses",
    data.categoryOnCourses,
    "CategoryOnCourses"
  );
  await safeInsert("demo", data.demo, "Demo");
  await safeInsert("prerequisites", data.prerequisites, "Prerequisites");
  await safeInsert("video", data.videos, "Videos");
  await safeInsert("comment", data.comments, "Comments");

  await safeInsert("review", data.reviews, "Reviews");
  await safeInsert("reviewReply", data.reviewReplies, "ReviewReplies");

  await safeInsert(
    "userCourseProgress",
    data.userCourseProgress,
    "UserCourseProgress"
  );
  await safeInsert(
    "userVideoProgress",
    data.userVideoProgress,
    "UserVideoProgress"
  );

  await safeInsert("order", data.orders, "Orders");
  await safeInsert("payment", data.payments, "Payments");

  console.log("✅ All data restored successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Restore process failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
