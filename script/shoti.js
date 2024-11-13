module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  hasPermission: 0,
  credits: "libyzxy0",
  description: "Generate a random shoti TikTok video.",
  commandCategory: "Entertainment",
  usages: "[]",
  cooldowns: 5,
  usePrefix: false,
  dependencies: {}
};

module.exports.run = async ({ api, event, args }) => {
  const { messageID, threadID } = event;
  const fs = require("fs");
  const axios = require("axios");
  const request = require("request");

  // Show message "Sending Shoti Video. Please wait..."
  api.sendMessage("Sending Shoti Video. Please wait...", threadID, messageID);
  api.sendTypingIndicator(threadID, true);

  // Check if no arguments are provided
  if (!args.length) {
    api.sendMessage("Downloading a random shoti TikTok video...", threadID, messageID);
  }

  try {
    // Send GET request to the API for video
    const response = await axios.get(`https://shoti.kenliejugarap.com/getvideo.php?apikey=your-api-key-here`);

    if (response.data.status) {
      const { title, tiktokUrl, videoDownloadLink } = response.data;

      // Path to save the downloaded video
      const path = __dirname + `/cache/shoti/shoti.mp4`;
      const file = fs.createWriteStream(path);
      const rqs = request(encodeURI(videoDownloadLink));
      rqs.pipe(file);

      // Once the download is complete
      file.on('finish', () => {
        setTimeout(function() {
          // Send the video with the details
          return api.sendMessage({
            body: `Here is your Shoti video!\n\nTitle: ${title}\nTiktok URL: ${tiktokUrl}`,
            attachment: fs.createReadStream(path)
          }, threadID);
        }, 1000);
      });

      file.on('error', (err) => {
        api.sendMessage(`Error: ${err}`, threadID, messageID);
      });
    } else {
      api.sendMessage("Failed to fetch a shoti video. Please try again later.", threadID, messageID);
    }
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, threadID, messageID);
  }
};
