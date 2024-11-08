const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno", // Updated credits
    description: "GPT architecture",
    usePrefix: false,
    commandCategory: "GPT4",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply } = event;
        let prompt = args.join(" ");

        // Include replied message in the prompt if it exists
        if (messageReply) {
            const repliedMessage = messageReply.body;
            prompt = `${repliedMessage} ${prompt}`;
        }

        // If no prompt is provided, send a help message
        if (!prompt) {
            return api.sendMessage(
                `Please provide a prompt to get a response.`,
                event.threadID,
                messageID,
            );
        }

        // Delay
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the delay time as needed

        // New API URL
        const apiUrl = `https://rest-api-production-5054.up.railway.app/ai?prompt=${encodeURIComponent(prompt)}&uid=${event.senderID}`;

        const response = await axios.get(apiUrl);

        if (response.data && response.data.message) {
            const generatedText = response.data.message;

            // AI Answer with the specified format (no special font formatting)
            api.sendMessage(
                `Answer:\n${generatedText}`,  // No backticks, no special font formatting
                event.threadID,
                messageID,
            );
        }
    } catch (error) {
        // Error handling
        console.error(error);
        api.sendMessage(
            `An error occurred while processing your request. Please try again later.`,
            event.threadID,
            messageID,
        );
    }
};
