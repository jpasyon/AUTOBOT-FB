const axios = require("axios");

module.exports.config = {
    name: "wiki",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Get information from Wikipedia",
    usePrefix: false,
    commandCategory: "Information",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply, threadID, senderID } = event;
        let query = args.join(" ");

        // Include replied message in the query if it exists
        if (messageReply && messageReply.body) {
            const repliedMessage = messageReply.body;
            query = `${repliedMessage} ${query}`;
        }

        // If no query is provided, send a help message
        if (!query.trim()) {
            return api.sendMessage(
                `Please provide a search term to get a Wikipedia response.`,
                threadID,
                messageID
            );
        }

        // Delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // API URL
        const apiUrl = `https://jonellprojectccapisexplorer.onrender.com/api/wiki?q=${encodeURIComponent(query)}`;

        const response = await axios.get(apiUrl);

        if (response.data && response.data.message) {
            const generatedText = response.data.message;
            const link = response.data.link || 'No link available';

            // Send the response with the correct format
            api.sendMessage(
                `Answer Wikipedia:\n${generatedText}\n${link}`,
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
        // Error handling with a clear message
        console.error(error);
        api.sendMessage(
            `An error occurred while processing your request. Please try again later.`,
            event.threadID,
            messageID
        );
    }
};
