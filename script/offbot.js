module.exports.config = {
    name: "offbot",
    version: "1.0.0",
    role: 2, // Only admins can use this command
    credits: "Juno",
    description: "Shut down the Bot",
    hasPrefix: false,
    commandCategory: "system",
    usages: "offbot",
    cooldowns: 0
};

const fs = require("fs-extra");

module.exports.handleEvent = async function ({ api, admin }) {
    const pathFile = `${__dirname}/../cache/shutdown.txt`;
    try {
        if (fs.existsSync(pathFile)) {
            const [tid] = fs.readFileSync(pathFile, "utf-8").split(" ");
            api.sendMessage("Bot has been shut down.", tid, admin);
            fs.unlinkSync(pathFile); // Delete the shutdown file after reading it
        }
    } catch (error) {
        console.error("Error handling shutdown file:", error);
        api.sendMessage("An error occurred while handling the shutdown file.", admin);
    }
};

module.exports.run = async function ({ api, event }) {
    const pathFile = `${__dirname}/../cache/shutdown.txt`;
    try {
        // Write the thread ID and timestamp to the shutdown file
        fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
        await api.sendMessage("Bot is now shutting down...", event.threadID);
        process.exit(0); // Shut down the bot
    } catch (error) {
        console.error("Error writing shutdown file:", error);
        api.sendMessage("Failed to write shutdown file.", event.threadID);
    }
};
