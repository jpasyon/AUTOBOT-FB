const axios = require("axios");

module.exports.config = {
    name: "gf",
    version: "1.0.0",
    role: 0,
    credits: "Juno",
    description: "Fetch a response from GF",
    hasPrefix: true,
    aliases: ["gf"],
    usage: "[gf <query>]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        if (args.length === 0) {
            api.sendMessage("Please provide a query: ex: gf how are you?", event.threadID, event.messageID);
            return;
        }

        const query = args.join(" ");

        const response = await axios.get(`https://joshweb.click/api/ai-gf?q=${encodeURIComponent(query)}`);
        const gfResponse = response.data.result;

        if (!gfResponse) {
            api.sendMessage("No response found from GF.", event.threadID, event.messageID);
            return;
        }

        await api.sendMessage(gfResponse, event.threadID, event.messageID);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID, event.messageID);
    }
};
