const axios = require("axios");

module.exports.config = {
    name: "mixtral",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Chat with Mixtral using a conversational format.",
    usePrefix: false,
    commandCategory: "Mixtral",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, threadID, body } = event;

        if (!body || !body.toLowerCase().startsWith("mixtral")) {
            return;
        }

        const prompt = body.slice(8).trim();

        if (!prompt) {
            return api.sendMessage(
                `Please provide a prompt to get a response from Mixtral.`,
                threadID,
                messageID
            );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const apiUrl = `https://joshweb.click/api/mixtral-8b?q=${encodeURIComponent(prompt)}`;

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
                        `An error occurred while communicating with the Mixtral API. Please try again later.`,
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
                `Answer Mixtral:\n${generatedText}.\n\nType 'clear' to delete the conversation history.`,
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
