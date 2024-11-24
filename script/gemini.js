const axios = require('axios');

module.exports.config = {
    name: "gemini",
    role: 0,
    credits: "Juno",
    description: "Interact with Gemini",
    hasPrefix: false,
    version: "1.0.0",
    aliases: ["gemini"],
    usage: "gemini [reply to photo]"
};

module.exports.run = async function ({ api, event, args }) {
    const prompt = "gemini";

    if (event.type !== "message_reply" || !event.messageReply.attachments[0] || event.messageReply.attachments[0].type !== "photo") {
        return api.sendMessage(
            'Please reply to a photo with this command.', 
            event.threadID, 
            event.messageID
        );
    }

    const url = encodeURIComponent(event.messageReply.attachments[0].url);
    api.sendTypingIndicator(event.threadID);

    try {
        await api.sendMessage('Recognizing...', event.threadID);

        const response = await axios.get(`https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}&url=${url}`);
        const description = response.data?.gemini;

        if (!description) {
            throw new Error("No description found in the API response.");
        }

        return api.sendMessage(
            `Answer:\n${description}`, 
            event.threadID, 
            event.messageID
        );
    } catch (error) {
        console.error("Error fetching Gemini response:", error.message || error);

        return api.sendMessage(
            'An error occurred while processing your request. Please try again later.', 
            event.threadID, 
            event.messageID
        );
    }
};
