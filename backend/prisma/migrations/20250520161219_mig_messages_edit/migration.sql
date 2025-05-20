/*
  Warnings:

  - A unique constraint covering the columns `[roomName]` on the table `PrivateRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PrivateMessage" DROP CONSTRAINT "PrivateMessage_privateId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "PrivateRoom_roomName_key" ON "PrivateRoom"("roomName");

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_privateId_fkey" FOREIGN KEY ("privateId") REFERENCES "PrivateRoom"("roomName") ON DELETE CASCADE ON UPDATE CASCADE;
