module.exports.config = {
  name: "leave",
  version: "1.0.0",
  role: 2,
  hasPrefix: true,
  credits: "Juno",
  description: "Bot leaves the thread",
  usages: "leave",
  cooldowns: 10,

};

module.exports.run = async function({ api, event, args }) {
  try { 
  if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
    } catch (error) {
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
};
