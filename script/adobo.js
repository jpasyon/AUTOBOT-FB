const axios = require('axios');

module.exports.config = {
  name: 'adobo',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['adobo'],
  description: "Adobo AI",
  usage: "adobo [query]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage('Please provide a query. Example: adobo who is Jose Rizal?', event.threadID, event.messageID);
  }

  const responseMessage = await new Promise((resolve, reject) => {
    api.sendMessage({
      body: 'Adobo is thinking...',
      mentions: [{ tag: event.senderID, id: event.senderID }],
    }, event.threadID, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    }, event.messageID);
  });

  try {
    const startTime = Date.now();
    const apiUrl = `https://markdevs-last-api-2epw.onrender.com/api/adobo/gpt?query=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);
    const adoboResponse = response.data.result;
    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);

    api.getUserInfo(event.senderID, async (err, userInfo) => {
      if (err) {
        console.error('Error fetching user info:', err);
        return await api.editMessage('Error fetching user info.', responseMessage.messageID);
      }

      const userName = userInfo[event.senderID].name;
      const formattedResponse = `Answer Adobo: //${responseTime}s\n${adoboResponse}\n\nAsked by: ${userName}`;

      await api.editMessage(formattedResponse.trim(), responseMessage.messageID);
    });
  } catch (error) {
    console.error('Error:', error);
    await api.editMessage('Error: ' + error.message, responseMessage.messageID);
  }
};
