/*
  Warnings:

  - Added the required column `customerId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PAID';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "customerId" STRING NOT NULL;
ALTER TABLE "Payment" ADD COLUMN     "email" STRING NOT NULL;
ALTER TABLE "Payment" DROP COLUMN "status";
ALTER TABLE "Payment" ADD COLUMN     "status" STRING NOT NULL;
