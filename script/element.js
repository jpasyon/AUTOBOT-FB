module.exports.config = {
    name: "element",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno", // Update credits
    description: "Get information about a chemical element",
    commandCategory: "Study",
    cooldowns: 0,
    prefixRequired: false, // Set prefixRequired to false
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const axios = require('axios');
        const { threadID, messageID } = event;

        // Join arguments to form the element name or symbol
        const elementName = args.join(" ");

        // If no element name is provided, send an error message
        if (!elementName) {
            return api.sendMessage(
                "Please provide the name or symbol of an element.",
                threadID,
                messageID
            );
        }

        // Fetch element data from the API
        const res = await axios.get(`https://api.popcat.xyz/periodic-table?element=${encodeURIComponent(elementName)}`);
        const data = res.data;

        // Send the response with the element information
        api.sendMessage(
            `Element Information\n- Name: ${data.name}\n- Symbol: ${data.symbol}\n- Atomic Number: ${data.atomic_number}\n- Atomic Mass: ${data.atomic_mass}\n\nSummary:\n${data.summary}`,
            threadID,
            messageID
        );
    } catch (error) {
        console.error(error);
        api.sendMessage(
            "An error occurred while retrieving the element information. Please check the element name or symbol and try again.",
            event.threadID,
            event.messageID
        );
    }
};
