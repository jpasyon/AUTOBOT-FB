const axios = require('axios');

module.exports.config = {
    name: "rizz",
    version: "1.0.0",
    credits: "Juno",
    description: "Sends a random rizz line",
    prefixRequired: false,
    adminOnly: false,
    cooldown: 5
};

module.exports.run = async function ({ api, event }) {
    try {
        const response = await axios.get('https://api.popcat.xyz/pickuplines');

        if (response.data && response.data.pickupline) {
            const message = response.data.pickupline; // Changed format here
            await api.sendMessage(global.convertToGothic ? global.convertToGothic(`Rizzler AI:\n${message}`) : `Rizzler AI:\n${message}`, event.threadID, event.messageID);
        } else {
            await api.sendMessage(global.convertToGothic ? global.convertToGothic("Failed to fetch a pickup line. Please try again.") : "Failed to fetch a pickup line. Please try again.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching pickup line:', error);
        await api.sendMessage(global.convertToGothic ? global.convertToGothic("Sorry, something went wrong while fetching a pickup line. Please try again later.") : "Sorry, something went wrong while fetching a pickup line. Please try again later.", event.threadID, event.messageID);
    }
};
