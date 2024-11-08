const axios = require("axios");

module.exports.config = {
    name: "gf",
    version: "1.0.0",
    role: 0,
    credits: "Juno",
    description: "Fetch a response from GF in a formal tone",
    hasPrefix: true,
    aliases: ["gf"],
    usage: "[gf <query>]",
    cooldown: 5,
};

function makeFormal(response) {
    return response
        .replace(/[#@][^\s]+/g, '')  // Remove hashtags and @mentions
        .replace(/[^\w\s.,?!]/g, '')  // Remove emojis and symbols
        .replace(/\bcutie\b/g, 'there')  // Replace casual words
        .replace(/\bstud muffin\b/g, 'there')
        .replace(/\bum\b/g, 'you')
        .replace(/\bhey\b/gi, 'Hello')
        .replace(/\bfrisky\b/g, 'a bit bold')
        .replace(/\bsexy\b/g, 'appealing');
}

module.exports.run = async function ({ api, event, args }) {
    try {
        if (args.length === 0) {
            api.sendMessage("Please provide a query: for example, 'gf what is your favorite style?'", event.threadID, event.messageID);
            return;
        }

        const query = args.join(" ");
        const response = await axios.get(`https://joshweb.click/api/ai-gf?q=${encodeURIComponent(query)}`);
        let gfResponse = response.data.result;

        if (!gfResponse) {
            api.sendMessage("No response found from GF.", event.threadID, event.messageID);
            return;
        }

        gfResponse = makeFormal(gfResponse);  // Format the response

        await api.sendMessage(gfResponse, event.threadID, event.messageID);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID, event.messageID);
    }
};
