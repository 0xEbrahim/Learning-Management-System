/*
  Warnings:

  - Added the required column `privateId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Message" ADD COLUMN     "privateId" STRING NOT NULL;

-- CreateTable
CREATE TABLE "PrivateRoom" (
    "id" STRING NOT NULL,
    "roomName" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivateRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrivateRoom_roomName_idx" ON "PrivateRoom"("roomName");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_privateId_fkey" FOREIGN KEY ("privateId") REFERENCES "PrivateRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
