import prisma from "../../config/prisma";
import {
  IMessageData,
  IMessageNotificationData,
  IResponse,
} from "../../Interfaces/types";

class MessageService {
  private combine_IDS(id1: string, id2: string) {
    return [id1, id2].sort().join("_");
  }

  async privateMessageNotification(Payload: IMessageNotificationData) {
    const { chatId, receiverId, senderId, text } = Payload;
    const notification = await prisma.messageNotifications.create({
      data: {
        text: text,
        recieverId: receiverId,
        chatId: chatId,
        senderId: senderId,
      },
    });
    return notification;
  }

  async updateMessageNotification(id: string) {
    const notification = await prisma.messageNotifications.update({
      where: {
        id: id,
      },
      data: {
        opened: true,
      },
    });
    return notification;
  }

  async create(Payload: IMessageData) {
    let msg;
    const { message, private: pr, receiverId, senderId, roomId } = Payload;
    if (pr) {
      const id = this.combine_IDS(senderId, receiverId);
      let prvRoom = await prisma.privateRoom.findFirst({
        where: {
          roomName: id,
        },
      });
      if (!prvRoom)
        prvRoom = await prisma.privateRoom.create({
          data: {
            roomName: id,
          },
        });
      msg = await prisma.privateMessage.create({
        data: {
          message: message,
          privateId: id,
          recieverId: receiverId,
          senderId,
        },
      });
      return msg;
    } else {
      msg = await prisma.groupMessage.create({
        data: {
          roomId: roomId ?? "",
          senderId,
          message,
        },
      });
      return msg;
    }
  }

  async getAllMessagesAtPrvChat(id: string) {
    const messages = await prisma.privateRoom.findUnique({
      where: {
        roomName: id,
      },
      select: {
        messages: true,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        messages,
      },
    };
    return response;
  }
}

export default new MessageService();
