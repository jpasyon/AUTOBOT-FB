const axios = require('axios');

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
        const { threadID, messageID } = event;
        const elementName = args.join(" ");

        // If no element name is provided, send an error message
        if (!elementName) {
            return api.sendMessage(
                "Please provide the name or symbol of an element.",
                threadID,
                messageID
            );
        }

        // Fetch element data from the provided API
        const res = await axios.get(`https://api.popcat.xyz/periodic-table?`, {
            params: { name: elementName }
        });

        // Check if the API responded with valid data
        if (res && res.data && res.data[0]) {
            const data = res.data[0];

            // If data is valid and contains the element information
            if (data.name && data.symbol && data.atomic_number && data.atomic_mass) {
                api.sendMessage(
                    `Element Information:\n- Name: ${data.name}\n- Symbol: ${data.symbol}\n- Atomic Number: ${data.atomic_number}\n- Atomic Mass: ${data.atomic_mass}\n\nSummary:\n${data.summary || "No summary available."}`,
                    threadID,
                    messageID
                );
            } else {
                // If the data is incomplete or invalid
                api.sendMessage(
                    "Could not retrieve complete information for the provided element. Please check the element name or symbol.",
                    threadID,
                    messageID
                );
            }
        } else {
            // If the API response is empty or invalid
            api.sendMessage(
                "No data found for the element. Please check the name or symbol and try again.",
                threadID,
                messageID
            );
        }
    } catch (error) {
        console.error('Error fetching element data:', error);
        api.sendMessage(
            "An error occurred while retrieving the element information. Please try again later.",
            event.threadID,
            event.messageID
        );
    }
};
