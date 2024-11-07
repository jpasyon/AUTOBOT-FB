const axios = require('axios');

module.exports.config = {
    name: 'codegpt',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['cgpt'],
    description: 'Generate code snippets using CodeGPT',
    usage: 'codegpt [query]',
    credits: 'Juno', // Updated credits
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const pangutana = args.join(' ');  

    if (!pangutana) {
        return api.sendMessage('Palihug og provide og code-related nga pangutana.', event.threadID, event.messageID);
    }

    const chilliHotUrl = `https://joshweb.click/api/codegpt?type=code&lang=nodejs?q=${encodeURIComponent(pangutana)}`;

    const bayotMessage = await new Promise((resolve, reject) => {  
        api.sendMessage({
            body: 'Generating your code snippet...',
        }, event.threadID, (err, info) => {
            if (err) return reject(err);
            resolve(info);
        }, event.messageID);
    });

    try {
        const chilliMansiResponse = await axios.get(chilliHotUrl);  
        const pogiCode = chilliMansiResponse.data.result; 

        // Simplified response format
        const formattedResponse = `CodeGPT:\n\`\`\`${pogiCode.trim()}\`\`\``; // Includes the required format

        await api.editMessage(formattedResponse.trim(), bayotMessage.messageID);

    } catch (error) {
        console.error('Error:', error);
        await api.editMessage('Error generating code. Please try again.', bayotMessage.messageID);
    }
};
