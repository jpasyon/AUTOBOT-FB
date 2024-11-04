module.exports.config = {
	name: "uid",
	role: 0,
	credits: "Juno",
	description: "Get the user's Facebook UID.",
	hasPrefix: false,
	usages: "{p}uid {p}uid @mention",
	cooldown: 5,
	aliases: ["id", "ui"]
};

module.exports.run = async function({ api, event }) {
	if (Object.keys(event.mentions).length === 0) {
		if (event.messageReply) {
			const senderID = event.messageReply.senderID;
			return api.sendMessage(`Your Facebook ID:\nResponse: ${senderID}`, event.threadID);
		} else {
			return api.sendMessage(
				`Your Facebook ID:\nResponse: ${event.senderID}`,
				event.threadID,
				event.messageID
			);
		}
	} else {
		for (const mentionID in event.mentions) {
			const mentionName = event.mentions[mentionID];
			api.sendMessage(
				`Your Facebook ID:\nResponse: ${mentionName.replace('@', '')}: ${mentionID}`,
				event.threadID
			);
		}
	}
};
