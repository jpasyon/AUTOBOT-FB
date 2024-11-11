const axios = require('axios');

module.exports.config = {
    name: "riddle",
    version: "1.0.0",
    credits: "Juno",
    description: "Sends a random riddle",
    prefixRequired: false,
    adminOnly: false,
    cooldown: 5
};

module.exports.run = async function ({ api, event }) {
    try {
        const response = await axios.get('https://jonellprojectccapisexplorer.onrender.com/api/randomriddle');

        if (response.data && response.data.question && response.data.answer) {
            const question = response.data.question;
            const answer = response.data.answer;
            const message = `Random Riddle AI:\n${question}\nAnswer: ${answer}`;
            await api.sendMessage(global.convertToGothic ? global.convertToGothic(message) : message, event.threadID, event.messageID);
        } else {
            await api.sendMessage(global.convertToGothic ? global.convertToGothic("Failed to fetch a riddle. Please try again.") : "Failed to fetch a riddle. Please try again.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching riddle:', error);
        await api.sendMessage(global.convertToGothic ? global.convertToGothic("Sorry, something went wrong while fetching a riddle. Please try again later.") : "Sorry, something went wrong while fetching a riddle. Please try again later.", event.threadID, event.messageID);
    }
};
