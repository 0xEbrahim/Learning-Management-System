import prisma from "../../config/prisma";
import { IMessageData } from "../../Interfaces/types";

class MessageService {
  async create(Payload: IMessageData) {
    const { message, recieverId, roomId, senderId } = Payload;
    const msg = await prisma.message.create({
      data: {
        message,
        recieverId,
        roomId,
        senderId,
      },
    });
    return msg;
  }
}

export default new MessageService();
