const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
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
            prompt = `${repliedMessage} ${prompt}`;
        }

        // If no prompt is provided, send a help message
        if (!prompt.trim()) {
            return api.sendMessage(
                "Please provide a prompt to get a response.",
                threadID,
                messageID
            );
        }

        // Delay for smooth response
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Updated API URL
        const apiUrl = `https://haji-mix.onrender.com/gpt4om?prompt=${encodeURIComponent(prompt)}`;

        let attempts = 0;
        let response;

        // Retry logic for API request (3 attempts)
        while (attempts < 3) {
            try {
                response = await axios.get(apiUrl);
                if (response.data && response.data.message) {
                    break;
                }
            } catch (error) {
                attempts++;
                if (attempts >= 3) {
                    console.error(error);
                    return api.sendMessage(
                        "An error occurred while communicating with the API. Please try again later.",
                        threadID,
                        messageID
                    );
                }
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }

        if (response && response.data && response.data.message) {
            const generatedText = response.data.message;

            // Send the response with the proper format
            api.sendMessage(
                `Answer:\n${generatedText}`,
                threadID,
                messageID
            );
        } else {
            api.sendMessage(
                "The response from the server is empty. Please try again later.",
                threadID,
                messageID
            );
        }
    } catch (error) {
        // Enhanced error handling with specific message
        console.error(error);
        api.sendMessage(
            "An error occurred while processing your request. Please try again later.",
            event.threadID,
            messageID
        );
    }
};
