module.exports.config = {
    name: "element",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Get information about an element",
    usePrefix: false,
    commandCategory: "study",
    cooldowns: 3,
};

module.exports.run = async function({ api, event, args }) {
    try {
        const axios = require('axios');
        const { threadID, messageID } = event;
        const prompt = args.join(" ");
        
        if (!prompt.trim()) {
            return api.sendMessage("Please specify an element name. Example: element hydrogen", threadID, messageID);
        }

        const res = await axios.get(`https://api.popcat.xyz/periodic-table?element=${encodeURIComponent(prompt)}`);
        const data = res.data;
        const latinName = data.name_lat || data.name;

        const elementInfo = `
Name: ${data.name}
Latin Name: ${latinName}
Symbol: ${data.symbol}
Atomic Number: ${data.atomic_number}
Atomic Mass: ${data.atomic_mass}
Period: ${data.period}
Phase: ${data.phase}
Discovered By: ${data.discovered_by}
Summary: ${data.summary}
        `.trim();

        return api.sendMessage(elementInfo, threadID, messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage(
            "Unable to fetch data for the specified element. Please ensure the name is spelled correctly.",
            event.threadID,
            event.messageID
        );
    }
};
