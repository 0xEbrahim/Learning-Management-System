/*
  Warnings:

  - You are about to alter the column `videoLength` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.

*/
-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "videoLength" SET DATA TYPE INT4;
