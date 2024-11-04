module.exports.config = {
    name: "offbot",
    role: 2, // Optional: This can still be defined for additional permission checks
    credits: "Jun",
    description: "Turns the bot off.",
    hasPrefix: true,
    usages: "{p}offbot",
    cooldown: 0,
    aliases: []
};

module.exports.run = async function({ event, api }) {
    // Check if the sender is an admin
    if (!adminIDs.includes(event.senderID)) {
        return api.sendMessage("You do not have permission to use this command.", event.threadID);
    }

    // Set the shutdown flag
    isShuttingDown = true;

    // Send a confirmation message before shutting down
    api.sendMessage("The bot is now turning off.", event.threadID, () => {
        process.exit(0);
    });
};
