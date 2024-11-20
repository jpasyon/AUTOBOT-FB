module.exports.config = {
    name: "restart",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Juno",
    description: "Restart Bot",
    commandCategory: "system",
    usages: "",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    return api.sendMessage(`${global.config.BOTNAME} Bot is now restarting...`, threadID, () => process.exit(1));
};
