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
        const { messageID, messageReply, threadID, senderID } = event;
        let prompt = args.join(" ");

        // Include replied message in the prompt if it exists
        if (messageReply && messageReply.body) {
            const repliedMessage = messageReply.body;
            prompt = ${repliedMessage} ${prompt};
        }

        // If no prompt is provided, send a help message
        if (!prompt.trim()) {
            return api.sendMessage(
                Please provide a prompt to get a response.,
                threadID,
                messageID
            );
        }

        // Delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // API URL
        const apiUrl = https://haji-mix.onrender.com/gpt4om?prompt=${encodeURIComponent(prompt)}&uid=${senderID};

        const response = await axios.get(apiUrl);

        if (response.data && response.data.message) {
            const generatedText = response.data.message;

            // Send the response with the correct format
            api.sendMessage(
                Answer:\n${generatedText}, // No parentheses around the generated text
                threadID,
                messageID
            );
        } else {
            api.sendMessage(
                The response from the server is empty. Please try again later.,
                threadID,
                messageID
            );
        }
    } catch (error) {
        // Error handling with clear message
        console.error(error);
        api.sendMessage(
            An error occurred while processing your request. Please try again later.,
            event.threadID,
            messageID
        );
    }
};
