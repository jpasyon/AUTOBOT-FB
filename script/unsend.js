module.exports.config = {
  name: "unsend",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  aliases: ['unsent', 'remove', 'rm'],
  usage: 'Unsend [reply]',
  description: "Unsend bot's message",
  credits: 'Developer',
  cooldown: 0
};

module.exports.run = async function({ api, event }) {
  // Check if the replied message is from the bot
  if (event.messageReply.senderID != api.getCurrentUserID()) 
    return api.sendMessage("I can't unsend from other message.", event.threadID, event.messageID);
  
  // Attempt to unsend the message
  return api.unsendMessage(event.messageReply.messageID, err => 
    (err) ? api.sendMessage("Something went wrong.", event.threadID, event.messageID) : ''
  );
}
