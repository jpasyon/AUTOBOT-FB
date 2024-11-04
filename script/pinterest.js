module.exports.config = {
  name: "pinterest",
  version: "1.0.0",
  role: 0,
  credits: "Juno",
  description: "Image search",
  hasPrefix: false,
  commandCategory: "Search",
  usages: "[Text]",
  aliases: ["pin"],
  cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const keySearch = args.join(" ");
  
  // Check if the search query includes a hyphen (to specify the number of images)
  if (!keySearch.includes("-")) {
    return api.sendMessage('Please enter a prompt\nExample: pinterest albert einstein - 5', event.threadID, event.messageID);
  }
  
  // Separate the search term and the number of images to fetch
  const keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
  const numberSearch = keySearch.split("-").pop() || 6;
  
  // Fetch data from the Pinterest API
  const res = await axios.get(`https://api.kenliejugarap.com/pinterestbymarjhun/?search=${encodeURIComponent(keySearchs)}`);
  const data = res.data && res.data.data;

  var imgData = []; // Array to hold image streams

  // Loop to download images
  for (let i = 0; i < parseInt(numberSearch); i++) {
    if (data[i]) {
      let imgStream = await axios.get(data[i], { responseType: 'arraybuffer' });
      imgData.push(Buffer.from(imgStream.data, 'utf-8')); // Push image buffer to array
    }
  }

  // Send results with images
  api.sendMessage({
    body: 'Results:', // Static message
    attachment: imgData, // Attach the images
  }, event.threadID, event.messageID);
};
