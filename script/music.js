const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');

module.exports["config"] = {
    name: "music",
    version: "1.0.0",
    info: "Search music from SoundCloud and send it as an attachment.",
    credits: "Juno",
    isPrefix: false,
    role: 0,
    aliases: ['play', 'sing', 'song', 'kanta', 'spotify', 'lyrics', 'lyric', 'lyrist', 'soundcloud', 'sc'],
    usage: '[title]',
};

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
    "Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.6 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15"
];

module.exports["run"] = async ({ api, event, args }) => {
    const chat = {
        reply: (txt) => api.sendMessage(txt, event.threadID)
    };

    const musicName = args.join(' ');

    if (!musicName) {
        return chat.reply(`Please provide the title of the music!`);
    }

    const searching = await chat.reply(`Searching for "${musicName}"...`);

    let filePath;
    try {
        // Request music data from the custom API
        const response = await axios.get(`https://haji-mix.onrender.com/soundcloud?query=${encodeURIComponent(musicName)}`, {
            headers: {
                'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
            }
        });

        const { title, lyrics, audio_b64 } = response.data;

        if (!title || !audio_b64) {
            return chat.reply("Can't find the music you're looking for.");
        }

        // Create a temporary file to save the music from the base64 string
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        filePath = path.join(__dirname, 'cache', `${timestamp}_music.mp3`);
        const audioBuffer = Buffer.from(audio_b64, 'base64');
        fs.writeFileSync(filePath, audioBuffer);

        if (fs.statSync(filePath).size > 26214400) {
            // Check if the file size is greater than 25MB
            fs.unlinkSync(filePath);
            return chat.reply('The file could not be sent because it is larger than 25MB.');
        }

        if (lyrics) await chat.reply(lyrics);

        // Send the music file as an attachment
        const message = {
            body: title,
            attachment: fs.createReadStream(filePath)
        };
        await api.sendMessage(message, event.threadID);

    } catch (error) {
        chat.reply(error.message || "An error occurred while fetching the music.");
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Clean up the temporary file
        }
    }
};
