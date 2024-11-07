module.exports.config = {
    name: "offbot",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Juno", // Update credits
    description: "Turn the bot off",
    commandCategory: "Admin",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
    try {
        // Check if the sender has admin permissions
        const adminPermission = global.config.GOD;
        if (!adminPermission.includes(event.senderID)) {
            return api.sendMessage(
                `[ ERR ] You don't have permission to use this command`,
                event.threadID,
                event.messageID
            );
        }

        // Confirmation message and bot shutdown
        await api.sendMessage(
            `[ OK ] ${global.config.BOTNAME} Bot is now turned off.`,
            event.threadID
        );

        // Exit process
        process.exit(0);
    } catch (error) {
        console.error(error);
        api.sendMessage(
            `[ ERR ] An error occurred while attempting to turn off the bot.`,
            event.threadID,
            event.messageID
        );
    }
};
