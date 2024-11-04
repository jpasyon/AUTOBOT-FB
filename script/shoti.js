const axios = require('axios');
const path = require('path');

module.exports.config = {
    name: "shoti",
    version: "1.0.0",
    hasPermission: 0,
    description: "random video from Shoti API By Lib API",
    usePrefix: true,
    credits: "Juno",
    cooldowns: 10,
    commandCategory: "Media",
};

module.exports.run = async function ({ api, event }) {
    try {
        const sending = await api.sendMessage("Sending Shoti Video. Please wait...", event.threadID, event.messageID);
        
        const response = await axios.get('https://shoti-api.adaptable.app/api/v1/request-f');
        const data = response.data;

        if (data.code === 200 && data.message === "success") {
            const videoInfo = data.data;
            const { url, title, user, duration } = videoInfo;
            const { username, nickname } = user;

            const videoResponse = await axios({
                url: url,
                method: 'GET',
                responseType: 'stream'
            });

            if (videoResponse && videoResponse.data) {
                api.unsendMessage(sending.messageID);

                const message = `Title: ${title}\nDuration: ${duration}\nUser: ${nickname} (@${username})\n`;

                api.sendMessage({
                    body: message,
                    attachment: videoResponse.data  
                }, event.threadID, event.messageID);
            } else {
                throw new Error("Video stream not available.");
            }

        } else {
            api.sendMessage(data.message || "Failed to fetch video data.", event.threadID, event.messageID);
        }

    } catch (error) {
        console.error('Error fetching video:', error);
        api.sendMessage("An error occurred while trying to send the video. Please try again later.", event.threadID, event.messageID);
    }
};
