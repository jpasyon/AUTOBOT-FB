const axios = require("axios");

module.exports.config = {
    name: "mlstalk",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno", // Updated credits
    description: "ML Stalk Info",
    usePrefix: false,
    commandCategory: "ML Stalk Players Info",
    cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, threadID } = event;
        let text = args.join(" ");

        // If no text is provided, send a help message
        if (!text.trim()) {
            return api.sendMessage(
                `Please provide the required ID to look up details.`,
                threadID,
                messageID
            );
        }

        // API URL with "mlstalk:" in the prompt
        const apiUrl = `https://joshweb.click/api/ml?id=${encodeURIComponent(text)}&serverid=12276`;

        const response = await axios.get(apiUrl);

        if (response.data) {
            const { main_hero, serverid, winrate, newest_history, rank, highest_rank, friends_count } = response.data;

            // Send the response with the specified format
            api.sendMessage(
                `ML STALK:\nMain Hero: ${main_hero}\nServer ID: ${serverid}\nWinrate: ${winrate}\nNewest History: ${newest_history}\nRank: ${rank}\nHighest Rank: ${highest_rank}\nFriends Count: ${friends_count}`,
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
