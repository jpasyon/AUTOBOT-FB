const axios = require('axios');
const path = require('path');

module.exports.config = {
    name: "shoti",
    version: "1.0.0",
    hasPermission: 0,
    description: "Random video from Shoti API by Lib API",
    usePrefix: false,
    credits: "Juno",
    cooldowns: 10,
    commandCategory: "Media",
};

module.exports.run = async function ({ api, event }) {
    try {
        const response = await axios.get('https://shoti-api.adaptable.app/api/v1/request-f');
        const data = response.data;

        if (data.code === 200 && data.message === "success") {
            const videoInfo = data.data;
            const { url, title, user, duration } = videoInfo;
            const { username, nickname } = user;

            const videoStream = await axios({
                url: url,
                method: 'GET',
                responseType: 'stream'
            });

            const message = `Successfully sent Shoti video\n\nTitle: ${title}\nDuration: ${duration}\nUser: ${nickname} (@${username})`;

            api.sendMessage({
                body: message,
                attachment: videoStream.data  
            }, event.threadID, event.messageID);

        } else {
            api.sendMessage(data.message, event.threadID, event.messageID);
        }

    } catch (error) {
        console.error('Error fetching video:', error);
        api.sendMessage(error.message, event.threadID, event.messageID);
    }
};
