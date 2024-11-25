const axios = require('axios');
const path = require('path');

module.exports.config = {
    name: "shoti",
    version: "1.0.0",
    hasPermission: 0,
    description: "random video from Shoti API By Lib API",
    usePrefix: true,
    credits: "Jonell Magallanes",
    cooldowns: 15,
    commandCategory: "Media",
};

module.exports.run = async function ({ api, event }) {
    try {
        const sending = await api.sendMessage("⏱️ | Sending Shoti Video Please Wait....", event.threadID, event.messageID);
        
        const response = await axios.get('https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu');
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

            api.unsendMessage(sending.messageID);

            const message = `Successfully Sent Shoti!\nTitle: ${title}\nDuration: ${duration}\nUser: ${nickname} (@${username})`;

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
