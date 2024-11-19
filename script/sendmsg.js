module.exports.config = {
    name: "sendmsg",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Your Name",
    description: "Send a message to a user by their UID",
    usePrefix: true,
    commandCategory: "Utilities",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, threadID } = event;

        if (args.length < 2) {
            return api.sendMessage(
                "Usage: sendmsg [UID] [message]",
                threadID,
                messageID
            );
        }

        const uid = args[0];
        const messageText = args.slice(1).join(" ");

        const formattedMessage = `Admin Bot Messages:\n${messageText}`;

        api.sendMessage(formattedMessage, uid, (error) => {
            if (error) {
                return api.sendMessage(
                    "Failed to send the message. Please check the UID or try again later.",
                    threadID,
                    messageID
                );
            }
            api.sendMessage(
                `Message successfully sent to UID: ${uid}`,
                threadID,
                messageID
            );
        });
    } catch (error) {
        console.error(error);
        api.sendMessage(
            "An unexpected error occurred. Please try again later.",
            event.threadID,
            event.messageID
        );
    }
};
