const axios = require("axios");

module.exports.config = {
    name: "aidetect",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno", // Updated credits
    description: "AI detection",
    usePrefix: false,
    commandCategory: "AI Detection",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply, threadID, senderID } = event;
        let text = args.join(" ");

        // Include replied message in the text if it exists
        if (messageReply && messageReply.body) {
            const repliedMessage = messageReply.body;
            text = `${repliedMessage} ${text}`;
        }

        // If no text is provided, send a help message
        if (!text.trim()) {
            return api.sendMessage(
                `Please provide text to detect if it's AI-generated.`,
                threadID,
                messageID
            );
        }

        // Delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // API URL with "aidetect:" in the prompt
        const apiUrl = `https://haji-mix.onrender.com/aidetect?text=aidetect: ${encodeURIComponent(text)}`;

        const response = await axios.get(apiUrl);

        if (response.data && response.data.result) {
            const { result, confidenceScore } = response.data;

            // Send the response with the updated format including percentages
            api.sendMessage(
                `Detect AI:\n${result}\nAI Confidence: ${confidenceScore.ai}%\nHuman Confidence: ${confidenceScore.human}%`,
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
