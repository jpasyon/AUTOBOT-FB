const axios = require('axios');

module.exports.config = {
    name: "kick",
    version: "1.0.0",
    hasPermission: 1, // Assuming admin permission is required
    credits: "Juno",
    description: "Remove the tagged user from the group",
    usePrefix: false,
    commandCategory: "Admin",
    cooldowns: 0,
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const mention = Object.keys(event.mentions);

    if (mention.length === 0) {
        return api.sendMessage("You need to tag someone to kick.", threadID, messageID);
    }

    try {
        const info = await api.getThreadInfo(threadID);

        if (!info.adminIDs.some(item => item.id === api.getCurrentUser ID())) {
            return api.sendMessage("Bot needs admin privileges to perform this action. Please add the bot as an admin.", threadID, messageID);
        }

        if (!info.adminIDs.some(item => item.id === event.senderID)) {
            return api.sendMessage("You need to be an admin to kick someone.", threadID, messageID);
        }

        for (let userId of mention) {
            setTimeout(() => {
                api.removeUser FromGroup(userId, threadID);
            }, 3000);
        }

        return api.sendMessage("Kicking the mentioned user(s)...", threadID, messageID);
    } catch (error) {
        console.error('Error kicking user:', error);
        return api.sendMessage("An error occurred while trying to kick the user.", threadID, messageID);
    }
};
