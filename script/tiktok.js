const axios = require("axios");

module.exports.config = {
    name: "tiktok",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Download TikTok video",
    usePrefix: false,
    commandCategory: "TikTok",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply, threadID, senderID } = event;
        let url = args.join(" ");

        if (messageReply && messageReply.body) {
            const repliedMessage = messageReply.body;
            url = `${repliedMessage} ${url}`;
        }

        if (!url.trim() || !url.startsWith("https://www.tiktok.com/") && !url.startsWith("https://tikcdn.io/")) {
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const apiUrl = `https://joshweb.click/tiktokdl?url=${encodeURIComponent(url)}`;

        let attempts = 0;
        let response;

        while (attempts < 3) {
            try {
                response = await axios.get(apiUrl);
                if (response.data && response.data.video_url) {
                    break;
                }
            } catch (error) {
                attempts++;
                if (attempts >= 3) {
                    return;
                }
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }

        if (response && response.data && response.data.video_url) {
            const videoUrl = response.data.video_url;

            api.sendMessage(
                {
                    body: "Here is your TikTok video:",
                    attachment: axios.get(videoUrl, { responseType: "stream" }),
                },
                threadID,
                messageID
            );
        }
    } catch (error) {
        return;
    }
};
