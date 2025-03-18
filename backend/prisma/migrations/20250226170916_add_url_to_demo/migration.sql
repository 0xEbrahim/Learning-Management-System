/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Prerequisites` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Prerequisites` table. All the data in the column will be lost.
  - Added the required column `url` to the `Demo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Demo" ADD COLUMN     "url" STRING NOT NULL;

-- AlterTable
ALTER TABLE "Prerequisites" DROP COLUMN "updatedAt";
ALTER TABLE "Prerequisites" DROP COLUMN "url";
