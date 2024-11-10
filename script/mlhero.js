const axios = require("axios");

module.exports.config = {
    name: "mlhero",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno", // Updated credits
    description: "ML Hero Information",
    usePrefix: false,
    commandCategory: "AI Tools",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, threadID } = event;
        let heroName = args.join(" ");

        // If no hero name is provided, send a help message
        if (!heroName.trim()) {
            return api.sendMessage(
                `Please provide the name of a hero to get information.`,
                threadID,
                messageID
            );
        }

        // API URL with "mlhero:" in the prompt
        const apiUrl = `https://joshweb.click/api/mlhero?q=${encodeURIComponent(heroName)}`;

        const response = await axios.get(apiUrl);

        if (response.data && response.data.information) {
            const heroInfo = response.data.information;

            // Send the response in the specified format
            api.sendMessage(
                `ML Hero Information:\n${heroInfo}`,
                threadID,
                messageID
            );
        } else {
            api.sendMessage(
                `No information found for the specified hero. Please try another name.`,
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
