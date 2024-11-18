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

        // Delay before calling the API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // API URL
        const apiUrl = `https://jonellprojectccapisexplorer.onrender.com/api/wiki?q=${encodeURIComponent(query)}`;

        // Retry mechanism in case of failure
        let attempts = 0;
        let response;
        while (attempts < 3) {
            try {
                response = await axios.get(apiUrl);
                if (response.data && response.data.message) {
                    break; // Successfully got a response, exit the loop
                }
            } catch (error) {
                attempts++;
                if (attempts >= 3) {
                    console.error('Error fetching Wikipedia data:', error);
                    return api.sendMessage(
                        global.convertToGothic ? global.convertToGothic("Sorry, something went wrong while fetching the information. Please try again later.") : "Sorry, something went wrong while fetching the information. Please try again later.",
                        threadID,
                        messageID
                    );
                }
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
            }
        }

        // Process the response if it's valid
        if (response && response.data && response.data.message) {
            const generatedText = response.data.message;
            const link = response.data.link || 'No link available';

            // Send the response with the correct format
            api.sendMessage(
                `Answer Wikipedia:\n${generatedText}\nLink: ${link}`,
                threadID,
                messageID
            );
        } else {
            // If no message is returned, notify the user
            api.sendMessage(
                `The response from Wikipedia is empty. Please try again later.`,
                threadID,
                messageID
            );
        }
    } catch (error) {
        // Error handling with a clear message
        console.error('Error processing Wikipedia request:', error);
        api.sendMessage(
            `An error occurred while processing your request. Please try again later.`,
            event.threadID,
            messageID
        );
    }
};
