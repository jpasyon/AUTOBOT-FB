const axios = require('axios');

module.exports.config = {
    name: 'blackbox',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['blackbox', 'bb'],
    description: 'Interact with Blackbox AI',
    usage: 'blackbox [question]',
    credits: 'Juno',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const prompt = args.join(' ');

    if (!prompt) {
        return api.sendMessage('Please provide a question, for example: blackbox what is the meaning of life?', event.threadID, event.messageID);
    }

    const responseMessage = await new Promise((resolve, reject) => {
        // Send the initial "thinking" message as a reply to the user's message
        api.sendMessage('Searching, please wait...', event.threadID, (err, info) => {
            if (err) return reject(err);
            resolve(info);
        }, event.messageID);
    });

    try {
        // Fetch data from the new API endpoint with the user prompt
        const response = await axios.get('https://jonellprojectccapisexplorer.onrender.com/api/blackbox?text=hi', {
            params: { prompt: prompt }
        });
        const result = response.data;
        const responseString = result.data ? result.data : 'No result found.';

        const formattedResponse = `
Answer Blackbox:
${responseString}
        `;

        await api.editMessage(formattedResponse.trim(), responseMessage.messageID);

    } catch (error) {
        console.error('Error:', error);
        await api.editMessage('An error occurred while fetching the response.', responseMessage.messageID);
    }
};
