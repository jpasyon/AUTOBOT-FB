const path = require("path");
const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "hntai",
  version: "9",
  credits: "Juno",
  description: "Send random Hentai video",
  commandCategory: "media",
  hasPermssion: 0,
  cooldowns: 9,
  usages: "[hntai]",
  role: 0,
  hasPrefix: false,
};

module.exports.run = async function ({ api, event }) {
  try {
    const ugh = api.sendMessage(`Fetching a random Hentai video...`, event.threadID);

    const response = await axios.get(`https://joshweb.click/api/randhntai`);

    const data = response.data;
    const videoUrl = data.downloadUrl;
    const title = data.title;

    const videoPath = path.join(__dirname, "cache", "video.mp4");

    const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });

    fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

    // Send the video with its title
    await api.sendMessage(
      {
        body: `Here's your random Hentai video!\n\nTitle: ${title}\nVideo: ${videoPath}`,
        attachment: fs.createReadStream(videoPath),
      },
      event.threadID,
      event.messageID
    );

    fs.unlinkSync(videoPath);  // Clean up the video file after sending it
    api.unsendMessage(ugh.messageID);  // Remove the initial "fetching" message
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    console.log(error);
  }
};
