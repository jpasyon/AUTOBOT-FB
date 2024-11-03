const axios = require("axios");

module.exports.config = {
    name: "ashley",
    version: "1.0.0",
    role: 0,
    credits: "Juno",
    description: "Fetch a response from Ashley",
    hasPrefix: tr,
    aliases: ["ash"],
    usage: "[ashley <query>]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        if (args.length === 0) {
            api.sendMessage(
                "Please provide a query, e.g., ashley tell me a joke.",
                event.threadID,
                event.messageID,
            );
            return;
        }

        const query = args.join(" ");
        const initialMessage = await api.sendMessage(
            "Ashley is responding...",
            event.threadID,
            event.messageID,
        );

        const response = await axios.get(
            `https://markdevs-last-api-2epw.onrender.com/api/ashley?query=${encodeURIComponent(query)}`,
        );
        const ashleyResponse = response.data.result;

        if (!ashleyResponse) {
            api.sendMessage(
                "No response found from Ashley.",
                event.threadID,
                event.messageID,
            );
            return;
        }

        const formattedResponse = `Ashley AI Response\n\n${ashleyResponse}\n\n- Ashley`;

        await api.sendMessage(
            formattedResponse,
            event.threadID,
            event.messageID,
        );
    } catch (error) {
        console.error("Error:", error);
        api.sendMessage(
            "An error occurred while processing the request.",
            event.threadID,
            event.messageID,
        );
    }
};
