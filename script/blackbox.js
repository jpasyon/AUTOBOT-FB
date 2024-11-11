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

    let responseMessage;
    try {
        // Send the initial "thinking" message as a reply to the user's message
        responseMessage = await new Promise((resolve, reject) => {
            api.sendMessage('Searching, please wait...', event.threadID, (err, info) => {
                if (err) return reject(err);
                resolve(info);
            }, event.messageID);
        });

        // Fetch data from the new API endpoint with the user prompt
        const response = await axios.get('https://jonellprojectccapisexplorer.onrender.com/api/blackbox', {
            params: { text: prompt }
        });

        const result = response.data;
        const responseString = result.data ? result.data : 'No result found.';

        const formattedResponse = `Answer Blackbox:\n${responseString}`;

        // Edit the initial message with the final response
        await api.editMessage(formattedResponse, responseMessage.messageID);

    } catch (error) {
        console.error('Error:', error);
        if (responseMessage) {
            await api.editMessage('An error occurred while fetching the response.', responseMessage.messageID);
        } else {
            await api.sendMessage('An error occurred while fetching the response.', event.threadID, event.messageID);
        }
    }
};
