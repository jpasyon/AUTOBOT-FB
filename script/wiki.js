const axios = require("axios");

module.exports.config = {
    name: "wiki",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Get information from Wikipedia.",
    usePrefix: false,
    commandCategory: "Information",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply, threadID } = event;
        let query = args.join(" ");

        if (messageReply && messageReply.body) {
            const repliedMessage = messageReply.body;
            query = `${repliedMessage} ${query}`;
        }

        if (!query.trim()) {
            return api.sendMessage(
                `Please provide a search term to get a Wikipedia response.`,
                threadID,
                messageID
            );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const apiUrl = `https://jonellprojectccapisexplorer.onrender.com/api/wiki?q=${encodeURIComponent(query)}`;

        let attempts = 0;
        let response;

        while (attempts < 3) {
            try {
                response = await axios.get(apiUrl);
                if (response.data && response.data.message) {
                    break;
                }
            } catch (error) {
                attempts++;
                if (attempts >= 3) {
                    return api.sendMessage(
                        `Sorry, something went wrong while fetching the information. Please try again later.`,
                        threadID,
                        messageID
                    );
                }
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }

        if (response && response.data && response.data.message) {
            const generatedText = response.data.message;
            const link = response.data.link || "No link available";
            api.sendMessage(
                `Answer Wikipedia:\n${generatedText}\nLink: ${link}`,
                threadID,
                messageID
            );
        } else {
            api.sendMessage(
                `The response from Wikipedia is empty. Please try again later.`,
                threadID,
                messageID
            );
        }
    } catch (error) {
        api.sendMessage(
            `An error occurred while processing your request. Please try again later.`,
            event.threadID,
            messageID
        );
    }
};
