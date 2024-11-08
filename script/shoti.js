const axios = require('axios');

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
        // Inform user that the bot is fetching the video
        const sending = await api.sendMessage("Sending Shoti Video. Please wait...", event.threadID, event.messageID);
        
        // Fetch video information from the API
        const response = await axios.get('https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu');
        const data = response.data;

        // Check for a successful response
        if (data.code === 200 && data.message === "success") {
            const videoInfo = data.data;
            const { url, title, user, duration } = videoInfo;
            const { username, nickname } = user;

            // Fetch the video stream
            const videoResponse = await axios({
                url: url,
                method: 'GET',
                responseType: 'stream'
            });

            if (videoResponse && videoResponse.data) {
                // Remove the loading message
                api.unsendMessage(sending.messageID);

                // Send video with information and URL
                const message = `Title: ${title}\nDuration: ${duration}\nUser: ${nickname} (@${username})\nLink: ${url}`;

                api.sendMessage({
                    body: message,
                    attachment: videoResponse.data  
                }, event.threadID, event.messageID);
            } else {
                throw new Error("Video stream not available.");
            }

        } else {
            // Inform the user if there's an issue fetching video data
            api.sendMessage(data.message || "Failed to fetch video data.", event.threadID, event.messageID);
        }

    } catch (error) {
        // Error handling
        console.error('Error fetching video:', error);
        api.sendMessage("An error occurred while trying to send the video. Please try again later.", event.threadID, event.messageID);
    }
};
