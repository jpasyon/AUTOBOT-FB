const axios = require("axios");

module.exports.config = {
    name: "commands",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Displays available commands",
    usePrefix: false,
    commandCategory: "Information",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, threadID } = event;

        const commandsText = 
`Select Commands:

• accept
• aidetect
• ashley ❌
• bible
• blackbox
• bot2 [image recognition]
• codegpt
• commands
• count
• element
• gemini [url of an image] [question]
• gemma [question]
• gf ❌
• gpt3 [question]
• gpt4 [question]
• hack
• imgur
• leave
• liner [question]
• listbox
• listfriends
• meta [question]
• mixtral [question]
• morphic [question]
• music
• noti
• offbot
• owner
• pinterest
• remini
• restart
• riddle
• rizz
• tempm
• tiktok
• uid
• unsend
• uptime
• wiki
• wizard [question]

Select Events:

• randomReact ❌`;

        api.sendMessage(commandsText, threadID, messageID);
    } catch (error) {
        api.sendMessage(
            "An error occurred while processing your request. Please try again later.",
            event.threadID,
            messageID
        );
    }
};
