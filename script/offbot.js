module.exports.config = {
	name: "offbot",
	version: "3.9.0",
	hasPermssion: 2,
	credits: "Juno",
	description: "offbot",
	usePrefix: true,
  commandCategory: "system",
	cooldowns: 0
        };
module.exports.run = ({event, api}) =>api.sendMessage("The bot is now turning off.",event.threadID, () =>process.exit(0
                                                                                                                     
