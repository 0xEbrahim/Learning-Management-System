-- CreateTable
CREATE TABLE "MessageNotifications" (
    "id" STRING NOT NULL,
    "recieverId" STRING NOT NULL,
    "senderId" STRING NOT NULL,
    "text" STRING NOT NULL,
    "chatId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opened" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "MessageNotifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageNotifications" ADD CONSTRAINT "MessageNotifications_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "PrivateRoom"("roomName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageNotifications" ADD CONSTRAINT "MessageNotifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageNotifications" ADD CONSTRAINT "MessageNotifications_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
