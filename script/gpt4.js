const axios = require("axios");

module.exports.config = {
    name: "gpt4", // Command name
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno", // Updated credits
    description: "Chat with GPT-4 using a conversational format.",
    usePrefix: false, // No prefix required
    commandCategory: "GPT4",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, threadID, body } = event;

        // Ensure the message starts with "gpt4" (case-insensitive)
        if (!body || !body.toLowerCase().startsWith("gpt4")) {
            return;
        }

        // Extract the prompt by removing "gpt4" from the message
        const prompt = body.slice(5).trim(); // Removes "gpt4 " (5 characters)

        // If no prompt is provided, send a help message
        if (!prompt) {
            return api.sendMessage(
                `Please use the format: gpt4 [your question].`,
                threadID,
                messageID
            );
        }

        // Delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // API URL
        const apiUrl = `https://api.y2pheq.me/gpt4?prompt=${encodeURIComponent(prompt)}`;

        const response = await axios.get(apiUrl);

        if (response.data && response.data.result) {
            const generatedText = response.data.result;

            // Send the response in the specified format
            api.sendMessage(
                `Answer GPT 4 Conversational:\n${generatedText}.\n\nType 'clear' to delete the conversation history.`,
                threadID,
                messageID
            );
        } else {
            api.sendMessage(
                `The response from the server is empty. Please try again later.`,
                threadID,
                messageID
            );
        }
    } catch (error) {
        // Error handling with clear message
        console.error(error);
        api.sendMessage(
            `An error occurred while processing your request. Please try again later.`,
            threadID,
            messageID
        );
    }
};
