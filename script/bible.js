const axios = require('axios');

module.exports.config = {
    name: "bible",
    version: "1.0.0",
    credits: "Juno",
    description: "Send a random Bible verse",
    prefixRequired: false,
    adminOnly: false,
    cooldown: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;

    try {
        // Fetch a random Bible verse from the API
        const response = await axios.get('https://joshweb.click/bibles?verse=John%203:16');

        if (response.data && response.data[0]) {
            const verse = response.data[0];
            const message = `Random Bible Verse:\n${verse.bookname} ${verse.chapter}:${verse.verse}\n${verse.text}`;

            await api.sendMessage(
                global.convertToGothic ? global.convertToGothic(message) : message,
                threadID,
                messageID
            );
        } else {
            await api.sendMessage(
                global.convertToGothic
                    ? global.convertToGothic("Failed to fetch a Bible verse. Please try again.")
                    : "Failed to fetch a Bible verse. Please try again.",
                threadID,
                messageID
            );
        }
    } catch (error) {
        console.error("Error fetching Bible verse:", error);
        await api.sendMessage(
            global.convertToGothic
                ? global.convertToGothic("An error occurred while fetching the Bible verse.")
                : "An error occurred while fetching the Bible verse.",
            threadID,
            messageID
        );
    }
};
