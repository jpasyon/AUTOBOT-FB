const axios = require('axios');

module.exports.config = {
    name: "imgur",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    credits: "Juno", // Changed credits to Juno
    description: "upload to imgur",
    usages: "imgur reply image, video, png, jpg",
    cooldown: 0,
};

class Imgur {
    constructor() {
        this.clientId = "fc9369e9aea767c";
        this.client = axios.create({
            baseURL: "https://api.imgur.com/3/",
            headers: {
                Authorization: `Client-ID ${this.clientId}`
            }
        });
    }

    async uploadImage(url) {
        try {
            const response = await this.client.post("image", { image: url });
            return response.data.data.link;
        } catch (error) {
            console.error(error);
            throw new Error(error.message || "SOMETHING WENT WRONG!");
        }
    }

    async fetchImgurLink(linkanh) {
        const { data } = await axios.get(`https://sampleapi-mraikero-01.vercel.app/get/imgur?url=${encodeURIComponent(linkanh)}`);
        return data.result.link;
    }
}

module.exports.run = async function ({ api, event }) {
    const imgur = new Imgur();
    const array = [];

    if (event.type !== "message_reply" || event.messageReply.attachments.length === 0) {
        return api.sendMessage("Please reply this command to the gif/photo you wanted to convert.", event.threadID, event.messageID);
    }

    for (const { url } of event.messageReply.attachments) {
        try {
            // Fetching the imgur link via the new method
            const imgurLink = await imgur.fetchImgurLink(url);
            array.push(imgurLink);
        } catch (err) {
            console.error(err);
        }
    }

    return api.sendMessage(`Success Uploads: ${array.length}
Failed Uploads: ${event.messageReply.attachments.length - array.length}
Image link:
${array.join("\n")}`, event.threadID, event.messageID);
};
