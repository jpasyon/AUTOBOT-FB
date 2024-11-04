module.exports.config = {
    name: "offbot",
    role: 2, // Adjust the role according to your permission logic
    credits: "yukihirasoma",
    description: "Turns the bot off.",
    hasPrefix: true,
    usages: "{p}offbot",
    cooldown: 0,
    aliases: []
};

module.exports.run = async function({ event, api }) {
    // Send a confirmation message before shutting down
    api.sendMessage("The bot is now turning off.", event.threadID, () => {
        process.exit(0);
    });
};
