const axios = require("axios");

module.exports.config = {
    name: "morphic",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Chat with Morphic using a conversational format.",
    usePrefix: false,
    commandCategory: "Morphic",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, threadID, body } = event;

        if (!body || !body.toLowerCase().startsWith("morphic")) {
            return;
        }

        const prompt = body.slice(7).trim();

        if (!prompt) {
            return api.sendMessage(
                `Please provide a prompt to get a response from Morphic.`,
                threadID,
                messageID
            );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const apiUrl = `https://joshweb.click/api/morphic?q=${encodeURIComponent(prompt)}`;

        let attempts = 0;
        let response;
        while (attempts < 3) {
            try {
                response = await axios.get(apiUrl);
                if (response.data && response.data.result) {
                    break;
                }
            } catch (error) {
                attempts++;
                if (attempts >= 3) {
                    console.error(error);
                    return api.sendMessage(
                        `An error occurred while communicating with the Morphic API. Please try again later.`,
                        threadID,
                        messageID
                    );
                }
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }

        if (response && response.data && response.data.result) {
            const generatedText = response.data.result;

            api.sendMessage(
                `Answer Morphic:\n${generatedText}.\n\nType 'clear' to delete the conversation history.`,
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
        console.error(error);
        api.sendMessage(
            `An error occurred while processing your request. Please try again later.`,
            threadID,
            messageID
        );
    }
};
