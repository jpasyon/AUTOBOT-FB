const axios = require('axios');

module.exports.config = {
    name: "gemini",
    role: 0,
    credits: "Juno",
    description: "Interact with Gemini",
    hasPrefix: false,
    version: "1.0.0",
    aliases: ["gemini"],
    usage: "gemini [url] [question]"
};

module.exports.run = async function ({ api, event, args }) {
    const prompt = args.slice(1).join(" ") || "gemini";

    if (args.length < 2 || !args[0].startsWith('http')) {
        return api.sendMessage(
            'Please provide a valid URL and a question.', 
            event.threadID, 
            event.messageID
        );
    }

    const url = encodeURIComponent(args[0]);
    api.sendTypingIndicator(event.threadID);

    try {
        await api.sendMessage('Fetching...', event.threadID);

        const response = await axios.get(`https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}&url=${url}`);
        const description = response.data?.gemini;

        if (!description) {
            throw new Error("No description found in the API response.");
        }

        return api.sendMessage(
            `Answer Gemini:\n${description}`, 
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
