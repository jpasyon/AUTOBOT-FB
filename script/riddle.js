const axios = require("axios");

module.exports.config = {
    name: "riddle",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Sends a random riddle.",
    usePrefix: false,
    commandCategory: "Fun",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const { messageID, threadID } = event;

    const apiUrl = "https://jonellprojectccapisexplorer.onrender.com/api/randomriddle";

    let attempts = 0;
    let response;

    while (attempts < 3) {
        try {
            response = await axios.get(apiUrl);
            if (response.data && response.data.question && response.data.answer) {
                break;
            }
        } catch (error) {
            attempts++;
            if (attempts >= 3) {
                return api.sendMessage(
                    "Sorry, something went wrong while fetching a riddle. Please try again later.",
                    threadID,
                    messageID
                );
            }
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    if (response && response.data && response.data.question && response.data.answer) {
        const question = response.data.question;
        const answer = response.data.answer;
        const message = `Random Riddle AI:\n${question}\nAnswer: ${answer}`;
        api.sendMessage(message, threadID, messageID);
    } else {
        api.sendMessage(
            "Failed to fetch a riddle. Please try again.",
            threadID,
            messageID
        );
    }
};
