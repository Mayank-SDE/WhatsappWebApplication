import Conversation from '../model/Conversation.js';
export const newConversation = async (request, response) => {
  try {
    const senderId = request.body.senderId;
    const recieverId = request.body.recieverId;
    const exist = await Conversation.findOne({
      members: { $all: [recieverId, senderId] },
    });
    if (exist) {
      return response.status(200).json('Conversation already exists');
    }
    const newConversation = new Conversation({
      members: [senderId, recieverId],
    });
    newConversation.save();
    return response.status(200).json('Conversation saved successfully');
  } catch (error) {
    return response.status(500).json(error.mwssage);
  }
};
export const getConversation = async (request, response) => {
  try {
    const senderId = request.body.senderId;
    const recieverId = request.body.recieverId;
    let conversation = await Conversation.findOne({
      members: { $all: [recieverId, senderId] },
    });
    return response.status(200).json(conversation);
  } catch (error) {
    return response.status(500).json(error.mwssage);
  }
};
