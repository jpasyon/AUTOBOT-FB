const axios = require("axios");

module.exports.config = {
    name: "help",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Displays a list of all commands and events",
    usePrefix: false,
    commandCategory: "Information",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, threadID } = event;

        const helpText = 
`LIST OF ALL COMMANDS

Commands:
•accept
•aidetect
•ashley ❌
•bible
•blackbox
•bot2 [image recognition]
•codegpt
•count
•element
•gemini [url of an image] [question]
•gemma [question]
•gf ❌
•gpt3 [question]
•gpt4 [question]
•hack
•help
•imgur
•leave
•liner [question]
•listbox
•listfriends
•meta [question]
•mixtral [question]
•morphic [question]
•music
•noti
•offbot
•owner
•pinterest
•remini
•restart
•riddle
•rizz
•tempm
•tiktok
•uid
•unsend
•uptime
•wiki
•wizard [question]

Events:
•randomReact ❌`;

        api.sendMessage(helpText, threadID, messageID);
    } catch (error) {
        api.sendMessage(
            "An error occurred while processing your request. Please try again later.",
            event.threadID,
            messageID
        );
    }
};
