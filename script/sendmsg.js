module.exports.config = {
    name: "sendmsg",
    version: "1.0.8",  // Updated version
    hasPermission: 2,
    credits: "Juno",  // Updated credits
    description: "Send a message to a user by their user ID",
    commandCategory: "admin",
    usages: "ID [Text]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    // Check if the user has provided a valid user ID and message
    if (args.length < 2) {
        return api.sendMessage(
            "Syntax error, use: sendmsg [ID_BOX] [message]",
            event.threadID,
            event.messageID
        );
    }

    // Get the user ID (the first argument) and the message (remaining arguments)
    const idbox = args[0];
    const reason = args.slice(1).join(" "); // Join the rest as the message

    try {
        // Send the message to the specified user ID (only the message appears in their chat)
        await api.sendMessage(reason, idbox);

        // Notify the admin that the message has been sent successfully
        api.sendMessage(
            `Sent message: "${reason}" to user ID: ${idbox}`,
            event.threadID,
            event.messageID
        );
    } catch (error) {
        // If there is an error (e.g., invalid user ID or network issues), send an error message
        console.error(error);
        api.sendMessage(
            "An error occurred while trying to send the message. Please check the user ID or try again later.",
            event.threadID,
            event.messageID
        );
    }
};
