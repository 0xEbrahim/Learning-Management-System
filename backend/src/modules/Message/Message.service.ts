import prisma from "../../config/prisma";
import { IMessageData } from "../../Interfaces/types";

class MessageService {
  private combine_IDS(id1: string, id2: string) {
    return [id1, id2].sort().join("_");
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
}

export default new MessageService();
