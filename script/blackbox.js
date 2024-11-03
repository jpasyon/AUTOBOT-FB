const axios = require('axios');

module.exports.config = {
    name: 'blackbox',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['blackbox', 'bb'],
    description: 'Interact with Blackbox AI',
    usage: 'blackbox [question]',
    credits: 'Juno', // Changed credits to Juno
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const prompt = args.join(' ');

    if (!prompt) {
        return api.sendMessage('Please provide a question, for example: blackbox what is the meaning of life?', event.threadID, event.messageID);
    }

    const responseMessage = await new Promise((resolve, reject) => {
        // Send the initial "thinking" message as a reply to the user's message
        api.sendMessage({
            body: 'Searching, please wait...',
            mentions: [{ tag: event.senderID, id: event.senderID }],
        }, event.threadID, (err, info) => {
            if (err) return reject(err);
            resolve(info);
        }, event.messageID); // Make it a reply to the user's message
    });

    try {
        const response = await axios.get('https://ggwp-ifzt.onrender.com/blackbox', {
            params: { prompt: prompt }
        });
        const result = response.data;
        const responseString = result.data ? result.data : 'No result found.';

        // Updated response format without font styles or emojis
        const formattedResponse = `Blackbox:\n${responseString}`;

        await api.editMessage(formattedResponse.trim(), responseMessage.messageID);

    } catch (error) {
        console.error('Error:', error);
        await api.editMessage('An error occurred while fetching the response.', responseMessage.messageID);
    }
};
