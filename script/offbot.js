module.exports.config = {
    name: "offbot",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Juno",
    description: "Turn the bot off",
    commandCategory: "Admin",
    cooldowns: 5
};

module.exports.run = ({ event, api }) => {
    const permission = global.config.GOD;
    if (!permission.includes(event.senderID)) return api.sendMessage("[ ERR ] You don't have permission to use this command", event.threadID, event.messageID);
    api.sendMessage(`[ OK ] ${global.config.BOTNAME} Bot is now turned off.`, event.threadID, () => process.exit(0));
};
